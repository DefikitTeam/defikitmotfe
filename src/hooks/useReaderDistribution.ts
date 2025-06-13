/* eslint-disable */
import { useReadContracts } from 'wagmi';
import { ContractFunction } from '../common/utils/caller';
import { ContractInfo } from '../common/wagmi/launch-pad-interface';
import { useDistributionContract } from './useDistributionContract';

export interface UseReaderDistributionParam {
  timestamp: number;
  address: string[];
  type: 'week' | 'month' | 'quarter' | 'year';
  chainId: number;
}

export interface UserClaimInfo {
  claimedAmount: bigint;
  claimTimestamp: bigint;
  hasClaimed: boolean;
  address: string;
}

export interface UseReaderDistributionReturn {
  claimInfos: Record<string, UserClaimInfo>;
  isFetchingClaimInfo: boolean;
  reFetchClaimInfo: () => void;
}

export function useReaderDistribution({
  timestamp,
  address,
  type,
  chainId,
}: UseReaderDistributionParam): UseReaderDistributionReturn {

  // Get distribution contract using the new hook
  const contractAddAndAbi = useDistributionContract(chainId);

  // Map type to corresponding function name
  const getFunctionName = (claimType: string) => {
    switch (claimType) {
      case 'week':
        return 'userWeeklyClaimed';
      case 'month':
        return 'userMonthlyClaimed';
      case 'quarter':
        return 'userQuarterlyClaimed';
      case 'year':
        return 'userYearlyClaimed';
      default:
        return 'userWeeklyClaimed';
    }
  };

  const readInfo: { contract: ContractInfo; func: ContractFunction[] } = {
    contract: contractAddAndAbi,
    func: address.map(addr => ({
      functionName: getFunctionName(type),
      args: [timestamp, addr]
    }))
  };

  const {
    data: dataReader,
    isFetching: isFetchingDataReader,
    refetch: reFetchDataReader,
    isSuccess,
    error,
    isPending
  } = useReadContracts({
    contracts: readInfo.func.map((item) => ({
      ...readInfo.contract,
      ...item
    }))
  });

  // Transform the contract data into UserClaimInfo
  const claimInfos: Record<string, UserClaimInfo> = {};

  if (dataReader) {
    dataReader.forEach((result, index) => {
      if (result.status === 'success' && result.result) {
        claimInfos[address[index]] = {
          claimedAmount: (result.result as any)[0],
          claimTimestamp: (result.result as any)[1],
          hasClaimed: (result.result as any)[2] || false,
          address: address[index]
        };
      }
    });
  }

  return {
    claimInfos,
    isFetchingClaimInfo: isFetchingDataReader || isPending,
    reFetchClaimInfo: reFetchDataReader
  };
} 