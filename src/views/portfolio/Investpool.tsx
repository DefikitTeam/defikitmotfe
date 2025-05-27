/* eslint-disable */
'use client';
import { getContract } from '@/src/common/blockchain/evm/contracts/utils/getContract';
import { useConfig } from '@/src/hooks/useConfig';
import { useReader } from '@/src/hooks/useReader';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { IPool } from '@/src/services/response.type';
import { RootState } from '@/src/stores';
import { InvestPool } from '@/src/stores/pool/type';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const Investpool = ({
  item,
  onUpdateClaimMap,
  onLoading,
  address
}: {
  item: IPool;
  onUpdateClaimMap: (poolAddress: string, investPoolObj: InvestPool) => void;
  onLoading: (isLoading: boolean) => void;
  address: string;
}) => {
  const { chainConfig } = useConfig();
  const chainData = useSelector((state: RootState) => state.chainData);
  const multiCallerContract = getContract(chainConfig?.chainId!);

  const { dataReader, isFetchingDataReader } = useReader({
    contractAddAndAbi: multiCallerContract,
    poolAddress: item.id as string,
    userAddress: address as `0x${string}`,
    chainId: chainConfig?.chainId as number
  });
  useEffect(() => {
    onLoading(true);
    const logData = async () => {
      if (!isFetchingDataReader && dataReader && dataReader.length > 0) {
        const investPoolObj = {
          pendingClaimAmount: '0',
          pendingRewardFarming: '0',
          balance: '0'
        };
        const pendingClaimAmountOfThisPool = dataReader
          ? dataReader[0]
          : undefined;
        const claimValueMapOfThisPool = dataReader ? dataReader[1] : undefined;

        const decimals = 10 ** Number(item.decimals);
        investPoolObj.pendingClaimAmount = new BigNumber(
          pendingClaimAmountOfThisPool?.result
        )
          .div(decimals)
          .toFixed(7);
        investPoolObj.pendingRewardFarming = new BigNumber(
          claimValueMapOfThisPool?.result
        )
          .div(decimals)
          .toFixed(7);
        investPoolObj.balance = await getUserPoolInfo(
          item.id,
          address as string
        );

        onUpdateClaimMap(item.id, investPoolObj);
        onLoading(false);
      }
    };

    logData();
  }, [isFetchingDataReader, dataReader, item.id]);

  const getUserPoolInfo = async (poolAddress: string, address: string) => {
    if (address && poolAddress) {
      const userPoolInfo = await servicePool.getUserPool({
        chainId: chainConfig?.chainId!,
        poolAddress: poolAddress,
        userAddress: address
      });
      if (userPoolInfo.ok) {
        const userPoolInforResponse = await userPoolInfo.json();
        const dataResponse = userPoolInforResponse?.data?.userInPools ?? [];
        let balanceOfUserParam = '0';
        if (dataResponse && dataResponse.length > 0) {
          balanceOfUserParam = dataResponse[0].batch;
          return balanceOfUserParam;
        }
      }
    }
    return '0';
  };
  return <></>;
};

export default Investpool;
