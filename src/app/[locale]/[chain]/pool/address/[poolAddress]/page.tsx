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
    // const chain = params.chain;
    // const locale = params.locale;
    // console.log('chain line 20-----', chain

    // )
    // console.log('locale line 21-----', locale)
    // console.log('tokenAddress line 19-----', tokenAddress)
    let tokenData: any = null
    let metadataResult: any = null
    try {
        const [poolDetails, metadataUpdateResult] = await Promise.all([
            servicePool.getDetailPoolDataFromServer(configService.getDefaultChain().toString(), tokenAddress),
            updateMetaDataWorker(tokenAddress,configService.getDefaultChain().toString())
        ]);
        tokenData = poolDetails;
        metadataResult = metadataUpdateResult

        // console.log('Fetched poolDetails for metadata:', tokenData);
        // console.log('Result of updateMetaDataWorker:', metadataUpdateResult);
    } catch (error) {
        console.error('Error fetching data in generateMetadata:', error);
    }

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    console.log('metadataResult line 45-----', metadataResult)
    console.log('tokenData line 46-----', tokenData)

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
