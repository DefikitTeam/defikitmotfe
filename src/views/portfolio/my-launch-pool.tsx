import { PoolStatus } from '@/src/common/constant/constance';
import { useConfig } from '@/src/hooks/useConfig';
import { useListPool } from '@/src/stores/pool/hooks/useListPool';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IPoolList } from '@/src/stores/pool/type';
import EmptyPool from '@/src/components/empty';
import ItemPool from '../home/item-pool';
import { useRouter } from 'next/navigation';
import { RootState } from '@/src/stores';
import { useAppSelector } from '@/src/stores';

const MyLaunchPool = ({ walletAddress }: { walletAddress: string }) => {
  const t = useTranslations();
  const { chainConfig } = useConfig();
  const router = useRouter();
  const { getListPoolAction, poolStateList } = useListPool();

  const [allPool, setAllPool] = useState<IPoolList[]>([]);
  const [metadataShow, setMetadataShow] = useState<any>(null);

  const {
    analystData,
    metadata,
    priceNative,
    poolList,
    orderByDirection,
    orderBy
  } = poolStateList;

  const { getAllRankPoolsAction } = useListPool();

  const rankPools = useAppSelector(
    (state: RootState) => state.poolDetail.rankPools
  );

  useEffect(() => {
    if (!rankPools.isFetchedRankPools && chainConfig?.chainId) {
      getAllRankPoolsAction({
        skip: 0,
        chainId: chainConfig?.chainId!
      });
    }
  }, [rankPools, chainConfig?.chainId]);

  useEffect(() => {
    if (walletAddress && chainConfig?.chainId) {
      getListPoolAction({
        statusPool: PoolStatus.MY_POOl,
        orderByDirection: orderByDirection,
        orderBy: orderBy,
        chainId: chainConfig?.chainId!,
        metaDataFromStore: metadata,
        query: '',
        owner: walletAddress.toLowerCase()
      });
    }
  }, [walletAddress, chainConfig?.chainId]);

  useEffect(() => {
    if (metadata) {
      setMetadataShow(metadata);
    }
  }, [metadata]);

  useEffect(() => {
    if (poolList) {
      setAllPool(poolList);
    }
  }, [poolList]);

  const handleClickPoolItem = (poolId: string) => {
    router.push(
      `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${poolId.toLowerCase()}`
    );
  };

  return (
    <div>
      <div className="mt-3 !font-forza text-lg font-bold">
        {t('MY_LAUNCH_POOL')}
      </div>
      <div className="grid gap-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-3 ">
        {allPool.length === 0 && (
          <div className="col-span-full">
            <EmptyPool />
          </div>
        )}
        {allPool &&
          allPool.length > 0 &&
          allPool?.map((pool: IPoolList, index) => {
            return (
              <div
                key={pool.id}
                className="contents"
              >
                <div
                  className="pool-item"
                  data-pool-id={pool.id}
                >
                  <ItemPool
                    poolItem={pool}
                    onClick={() => handleClickPoolItem(pool.id)}
                    className={`${
                      (index + 1) % 2 === 0 ? 'bg-evenColor' : 'bg-oddColor'
                    }  ${index === 0 ? 'animate-newMessage' : ''}  `}
                    metadata={
                      metadataShow && metadataShow?.[pool.id]
                        ? metadataShow[pool.id]
                        : undefined
                    }
                    analysisData={
                      (analystData && analystData[pool.id]?.analystData) ||
                      undefined
                    }
                    priceNative={priceNative}
                    rankPools={rankPools}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyLaunchPool;
