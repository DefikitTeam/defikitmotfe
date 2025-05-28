/* eslint-disable */

import { ConfigService } from '@/src/config/services/config-service';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { updateMetaDataWorker } from '@/src/stores/pool/common';
import PoolDetail from '@/src/views/pool-detail';
import type { Metadata, ResolvingMetadata } from 'next';;
const configService = ConfigService.getInstance();
type Props = {
    params: { locale: string; chain: string; poolAddress: string; }
    searchParams: { [key: string]: string | undefined }
}




export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const tokenAddress = params.poolAddress as string;
    let tokenData: any = null
    let metadataResult: any = null
    try {
        const [poolDetails, metadataUpdateResult] = await Promise.all([
            servicePool.getDetailPoolDataFromServer(configService.getDefaultChain().toString(), tokenAddress),
            updateMetaDataWorker(tokenAddress, configService.getDefaultChain().toString())
        ]);
        tokenData = poolDetails;
        metadataResult = metadataUpdateResult

    } catch (error) {
        console.error('Error fetching data in generateMetadata:', error);
    }

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []


    return {
        openGraph: {
            type: 'website',
            title: tokenData.data?.name,
            description: metadataResult.metadata?.description,
            images: [
                {
                    url: metadataResult.metadata?.image || '',
                    width: 1200,
                    height: 630,
                    alt: `${tokenData.data?.name}'s Logo`
                },
                ...previousImages
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: tokenData.data?.name,
            description: metadataResult.metadata?.description,
            images: [metadataResult.metadata?.image || '']
        }
    }
}



// export default PoolDetail;
export default function Index({ params, searchParams }: Props) {
    return <PoolDetail />
}

export const runtime = 'edge';