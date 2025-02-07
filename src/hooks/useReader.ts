/* eslint-disable */
import { useReadContracts } from 'wagmi';
import { ContractFunction } from '../common/utils/caller';
import { ContractStruct } from '../common/wagmi/launch-pad-interface';

export interface UseReaderParam {
    contractAddAndAbi: ContractStruct;
    poolAddress: string;
    userAddress?: string;
    chainId: number;
    value?: number;
}
export interface UseReaderReturn {
    dataReader: any;
    isFetchingDataReader: boolean;
    reFetchDataReader: () => void;
}

export function useReader({
    contractAddAndAbi,
    poolAddress,
    userAddress,
    chainId,
    value
}: UseReaderParam): any {
    const readInfo: { contract: ContractStruct; func: ContractFunction[] } = {
        contract: contractAddAndAbi,
        func: [
            {
                functionName: 'pendingClaimAmount',
                args: [poolAddress, userAddress]
            },
            {
                functionName: 'pendingRewardFarming',
                args: [poolAddress, userAddress]
            },
            {
                functionName: 'estimateBuy',
                args: [poolAddress, value]
            },
            {
                functionName: 'estimateSell',
                args: [poolAddress, value]
            },
            {
                functionName: 'getMaxBatchCurrent',
                args: [poolAddress]
            },
            {
                functionName: 'pendingReferrerReward',
                args: [poolAddress, userAddress]
            }
        ]
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
            // chainId: chainId
        }))
    });

    return {
        dataReader,
        isFetchingDataReader: isFetchingDataReader || isPending,
        reFetchDataReader
    };
}
