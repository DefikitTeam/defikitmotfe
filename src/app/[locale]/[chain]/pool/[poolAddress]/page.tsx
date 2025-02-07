import PoolDetail from '@/src/views/pool-detail';

// export async function generateMetadata({ params }: { params: { poolAddress: string } }): Promise<Metadata> {
//   const { poolAddress } = params;
//   const poolDetails = await getPoolDetails(poolAddress);

//   return {
//     title: poolDetails.title || 'Pool Details',
//     description: poolDetails.description || 'Detailed view of the pool.',
//     openGraph: {
//       title: poolDetails.title || 'Pool Details',
//       description: poolDetails.description || 'Detailed view of the pool.',
//       images: [
//         {
//           url: poolDetails.imageUrl || 'https://example.com/default-image.png',
//           width: 800,
//           height: 600,
//         },
//       ],
//     },
//   };
// }

export default PoolDetail;
export const runtime = 'edge';
