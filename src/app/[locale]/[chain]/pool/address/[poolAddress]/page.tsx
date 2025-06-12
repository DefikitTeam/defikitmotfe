/* eslint-disable */

import { ConfigService } from '@/src/config/services/config-service';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { updateMetaDataWorker } from '@/src/stores/pool/common';
import PoolDetail from '@/src/views/pool-detail';
import type { Metadata, ResolvingMetadata } from 'next';
import { siteConfig } from '@/src/common/constant/siteConfig';

const configService = ConfigService.getInstance();

type Props = {
    params: { locale: string; chain: string; poolAddress: string; }
    searchParams: { [key: string]: string | undefined }
}

const metadataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const safeExtractMetadata = (tokenData: any, metadataResult: any) => {
    const fallback = {
        title: siteConfig.title,
        description: siteConfig.description,
        image: siteConfig.landing
    };

    try {
        const tokenName = tokenData?.data?.name || tokenData?.name || fallback.title;
        const tokenDescription = metadataResult?.metadata?.description || fallback.description;
        const tokenImage = metadataResult?.metadata?.image || fallback.image;

        // Validate image URL format
        const validImageUrl = tokenImage &&
            typeof tokenImage === 'string' &&
            (tokenImage.startsWith('http://') || tokenImage.startsWith('https://')) &&
            tokenImage.length > 10
            ? tokenImage
            : fallback.image;

        return {
            title: typeof tokenName === 'string' && tokenName.length > 0 ? tokenName : fallback.title,
            description: typeof tokenDescription === 'string' && tokenDescription.length > 0 ? tokenDescription : fallback.description,
            image: validImageUrl
        };
    } catch (error) {
        console.error('Error extracting metadata:', error);
        return fallback;
    }
};

const createSafeMetadata = (title: string, description: string, image: string, previousImages: any[] = []): Metadata => {
    return {
        title,
        description,
        openGraph: {
            type: 'website',
            title,
            description,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: `${title}'s Logo`
                },
                ...previousImages
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image]
        }
    };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const tokenAddress = params.poolAddress as string;

    if (!tokenAddress || typeof tokenAddress !== 'string' || tokenAddress.length < 10) {
        console.warn('Invalid token address:', tokenAddress);
        return createSafeMetadata(siteConfig.title, siteConfig.description, siteConfig.landing);
    }

    const cacheKey = `${tokenAddress}-${configService.getDefaultChain()}`;
    const cached = metadataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached metadata for:', tokenAddress);
        try {
            const { title, description, image } = safeExtractMetadata(cached.data.tokenData, cached.data.metadataResult);
            const previousImages = (await parent).openGraph?.images || [];
            return createSafeMetadata(title, description, image, previousImages);
        } catch (error) {
            console.error('Error using cached metadata:', error);
        }
    }

    const fallbackMetadata = {
        title: siteConfig.title,
        description: siteConfig.description,
        image: siteConfig.landing
    };

    let tokenData: any = null;
    let metadataResult: any = null;

    try {
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 8000) // Giảm timeout xuống 8s
        );

        const chainId = configService.getDefaultChain().toString();

        const [poolDetails, metadataUpdateResult] = await Promise.race([
            Promise.all([
                servicePool.getDetailPoolDataFromServer(chainId, tokenAddress),
                updateMetaDataWorker(tokenAddress, chainId)
            ]),
            timeout
        ]) as any[];

        tokenData = poolDetails;
        metadataResult = metadataUpdateResult;

        if (tokenData || metadataResult) {
            metadataCache.set(cacheKey, {
                data: { tokenData, metadataResult },
                timestamp: Date.now()
            });
        }

    } catch (error) {
        console.error('Error fetching data in generateMetadata:', error);
        return createSafeMetadata(fallbackMetadata.title, fallbackMetadata.description, fallbackMetadata.image);
    }

    const { title: tokenName, description: tokenDescription, image: validImageUrl } =
        safeExtractMetadata(tokenData, metadataResult);

    try {
        const previousImages = (await parent).openGraph?.images || [];
        return createSafeMetadata(tokenName, tokenDescription, validImageUrl, previousImages);
    } catch (parentError) {
        console.error('Error accessing parent metadata:', parentError);
        return createSafeMetadata(tokenName, tokenDescription, validImageUrl);
    }
}

// export default PoolDetail;
export default function Index({ params, searchParams }: Props) {
    return <PoolDetail />
}

// Revalidate metadata every 5 minutes
export const revalidate = 300;
export const runtime = 'edge';