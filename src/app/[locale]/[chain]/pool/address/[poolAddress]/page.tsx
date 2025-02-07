/* eslint-disable */

import PoolDetail from '@/src/views/pool-detail';

// interface Params {
//     poolAddress: string;
// }

// export async function generateMetadata({
//     params
// }: {
//     params: Params;
// }): Promise<Metadata> {
//     const { poolAddress } = params;
//     // console.log('poolAddress-------', poolAddress);
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const { chainData } = useCurrentChainInformation();
//     const poolDetail = await servicePool.getDetailPoolInfo({
//         poolAddress,
//         chainId: chainData.chainId as number
//     });
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     // const {} = usePoolDetail()
//     const poolDetailData = await poolDetail.json();
//     // console.log('poolDetailData1111111', poolDetailData);
//     const metaDataInfo = await updateMetaDataWorker(
//         poolDetailData.data?.pool?.id,
//         poolDetailData.data?.pool?.metadata
//     );
//     const image: any = metaDataInfo?.metadata.image;
//     let finalImageUrl: string;
//     if (typeof image === 'object') {
//         finalImageUrl = image.value;
//     } else {
//         finalImageUrl = image;
//     }
//     // console.log(
//     //     'poolDetailData?.data.pool.name------',
//     //     poolDetailData?.data?.pool?.name
//     // );
//     return {
//         title: `Rocket Launch - ${poolDetailData?.data?.pool?.name}`,
//         description:
//             typeof metaDataInfo?.metadata.description === 'object'
//                 ? metaDataInfo?.metadata.description.value
//                 : metaDataInfo?.metadata.description,
//         openGraph: {
//             title: `Rocket Launch - ${poolDetailData?.data?.pool?.name}`,
//             description:
//                 typeof metaDataInfo?.metadata.description === 'object'
//                     ? metaDataInfo?.metadata.description.value
//                     : metaDataInfo?.metadata.description,
//             images: [
//                 {
//                     url: finalImageUrl,
//                     width: 800,
//                     height: 600,
//                     alt: poolDetailData?.data?.pool?.name || 'Pool Image'
//                 }
//             ],
//             url: `https://staging.rocketlaunch.fun/en/pool/address/${poolAddress}`
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: `Rocket Launch - ${poolDetailData?.data?.pool?.name}`,
//             description:
//                 typeof metaDataInfo?.metadata.description === 'object'
//                     ? metaDataInfo?.metadata.description.value
//                     : metaDataInfo?.metadata.description,
//             images: finalImageUrl
//         }
//     };
// }

export default PoolDetail;

export const runtime = 'edge';
