import {
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi';
import { getContract } from '../common/blockchain/evm/contracts/utils/getContract';
import { ChainId } from '../common/constant/constance';
import MultiCaller from '../common/wagmi/MultiCaller';

export function useMultiCaller() {
    const { chainId } = useAccount();
    const multiCallerContract = getContract(chainId || ChainId.BARTIO);

    // multi caller
    const multiCaller = new MultiCaller(multiCallerContract);

    // multi watcher
    const buyPoolMultiWatcher = useWriteContract();
    const buyPoolMultiListener = useWaitForTransactionReceipt({
        hash: buyPoolMultiWatcher.data
    });

    const createRocketTokenWatcher = useWriteContract();
    const createRocketTokenListener = useWaitForTransactionReceipt({
        hash: createRocketTokenWatcher.data
    });

    const createLaunchPoolWatcher = useWriteContract();
    const creeateLaunchPoolListener = useWaitForTransactionReceipt({
        hash: createLaunchPoolWatcher.data
    });

    const claimTokenWatcher = useWriteContract();
    const claimTokenListener = useWaitForTransactionReceipt({
        hash: claimTokenWatcher.data
    });

    const sellTokenMultiWatcher = useWriteContract();
    const sellTokenMultiListener = useWaitForTransactionReceipt({
        hash: sellTokenMultiWatcher.data
    });

    return {
        /*=======================MULTI=======================*/

        useBuyPoolMulti: {
            actionAsync: (params: {
                poolAddress: string;
                numberBatch: string | number;
                maxAmountETH?: string;
                referrer: string;
            }) => {
                return multiCaller.buy(buyPoolMultiWatcher, params);
            },
            isConfirmed: buyPoolMultiListener.isSuccess,
            isLoadingAgreedBuyToken: buyPoolMultiListener.isLoading,
            isLoadingInitBuyToken: buyPoolMultiWatcher.isPending,
            // || buyPoolMultiListener.isLoading
            isError: buyPoolMultiListener.isError || buyPoolMultiWatcher.isError
        },
        useCreateRocketToken: {
            actionAsync: (params: {
                name: string;
                symbol: string;
                decimal: string | number;
                totalSupply: string | bigint;
            }) => {
                return multiCaller.createRocketToken(
                    createRocketTokenWatcher,
                    params
                );
            },
            isConfirmed: createRocketTokenListener.isSuccess,
            isLoadingAgreedCreateToken: createRocketTokenListener.isLoading,
            isLoadingInitCreateToken: createRocketTokenWatcher.isPending,
            // isLoading: createRocketTokenListener.isLoading || createRocketTokenWatcher.isPending
            isError:
                createRocketTokenListener.isError ||
                createRocketTokenWatcher.isError
        },
        useCreateLaunchPool: {
            actionAsync: (params: {
                token: string;
                fixedCapETH: string | number;
                tokenForAirdrop: string | number;
                tokenForFarm: string | number;
                tokenForSale: string | number;
                tokenForAddLP: string | number;
                tokenPerPurchase: string | number;
                maxRepeatPurchase: string | number;
                startTime: string | number;
                minDurationSell: string | number;
                maxDurationSell: string | number;
                metadata: string | number;
            }) => {
                return multiCaller.createLaunchPool(
                    createLaunchPoolWatcher,
                    params
                );
            },
            isConfirmed: creeateLaunchPoolListener.isSuccess,
            isLoadingAgreedCreateLaunchPool:
                creeateLaunchPoolListener.isLoading,
            isLoadingInitCreateLaunchPool: createLaunchPoolWatcher.isPending,
            isError:
                creeateLaunchPoolListener.isError ||
                createLaunchPoolWatcher.isError
        },
        useClaimToken: {
            actionAsync: (params: { poolAddress: string }) => {
                return multiCaller.claimToken(claimTokenWatcher, params);
            },
            isConfirmed: claimTokenListener.isSuccess,
            isLoadingAgreedClaimToken: claimTokenListener.isLoading,
            isLoadingInitClaimToken: claimTokenWatcher.isPending,
            isError: claimTokenListener.isError || claimTokenWatcher.isError
        },
        useSellToken: {
            actionAsync: (params: {
                poolAddress: string;
                numberBatch: string | number;
            }) => {
                return multiCaller.sellToken(sellTokenMultiWatcher, params);
            },
            isConfirmed: sellTokenMultiListener.isSuccess,
            isLoadingAgreedSellToken: sellTokenMultiListener.isLoading,
            isLoadingInitSellToken: sellTokenMultiWatcher.isPending,
            isError:
                sellTokenMultiListener.isError || sellTokenMultiWatcher.isError
        }
    };
}
