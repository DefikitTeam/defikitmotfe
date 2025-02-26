/* eslint-disable */

import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { getContract } from '../common/blockchain/evm/contracts/utils/getContract';
import MultiCaller from '../common/wagmi/MultiCaller';
import { useConfig } from './useConfig';

export function useMultiCaller() {
    const { chainConfig } = useConfig();

    const multiCallerContract = getContract(chainConfig?.chainId!);

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
    const LaunchPoolWatcher = useWriteContract();
    const LaunchPoolListener = useWaitForTransactionReceipt({
        hash: LaunchPoolWatcher.data
    });

    const claimTokenWatcher = useWriteContract();
    const claimTokenListener = useWaitForTransactionReceipt({
        hash: claimTokenWatcher.data
    });

    const sellTokenMultiWatcher = useWriteContract();
    const sellTokenMultiListener = useWaitForTransactionReceipt({
        hash: sellTokenMultiWatcher.data
    });

    const spinLotteryWatcher = useWriteContract();
    const spinLotteryListener = useWaitForTransactionReceipt({
        hash: spinLotteryWatcher.data
    });

    const claimFundLotteryWatcher = useWriteContract();
    const claimFundLotteryListener = useWaitForTransactionReceipt({
        hash: claimFundLotteryWatcher.data
    });

    const depositForLotteryWatcher = useWriteContract();
    const depositForLotteryListener = useWaitForTransactionReceipt({
        hash: depositForLotteryWatcher.data
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
        useLaunchPool: {
            actionAsync: (params: {
                // token
                name: string;
                symbol: string;
                decimals: string | number;
                totalSupply: string | bigint;
                //active pool
                fixedCapETH: string | number;
                tokenForAirdrop: string | number;
                tokenForFarm: string | number;
                tokenForSale: string | number;
                tokenForAddLP: string | number;
                // batch purchase
                tokenPerPurchase: string | number;
                maxRepeatPurchase: string | number;
                // limit time
                startTime: string | number;
                minDurationSell: string | number;
                maxDurationSell: string | number;
                // metadata
                metadata: string | number;
                // buy
                numberBatch?: string | number;
                maxAmountETH?: string;
                referrer?: string;
            }) => {
                return multiCaller.launchPool(LaunchPoolWatcher, params);
            },
            isConfirmed: LaunchPoolListener.isSuccess,
            isLoadingAgreedLaunchPool: LaunchPoolListener.isLoading,
            isLoadingInitLaunchPool: LaunchPoolWatcher.isPending,
            isError: LaunchPoolListener.isError || LaunchPoolWatcher.isError,
            data: {
                hash: LaunchPoolWatcher.data,
                receipt: LaunchPoolListener.data
            }
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
        },

        useSpinLottery: {
            actionAsync: (params: { poolAddress: string }) => {
                return multiCaller.spinLottery(spinLotteryWatcher, params);
            },
            isConfirmed: spinLotteryListener.isSuccess,
            isLoadingAgreedSpinLottery: spinLotteryListener.isLoading,
            isLoadingInitSpinLottery: spinLotteryWatcher.isPending,
            isError: spinLotteryListener.isError || spinLotteryWatcher.isError
        },

        useClaimFundLottery: {
            actionAsync: (params: { poolAddress: string }) => {
                return multiCaller.claimFundLottery(spinLotteryWatcher, params);
            },
            isConfirmed: claimFundLotteryListener.isSuccess,
            isLoadingAgreedSpinLottery: claimFundLotteryListener.isLoading,
            isLoadingInitSpinLottery: spinLotteryWatcher.isPending,
            isError:
                claimFundLotteryListener.isError || spinLotteryWatcher.isError
        },

        useDepositForLottery: {
            actionAsync: (params: {
                poolAddress: string;
                amount: string;
                referrer: string;
            }) => {
                return multiCaller.depositForLottery(
                    depositForLotteryWatcher,
                    params
                );
            },
            isConfirmed: depositForLotteryListener.isSuccess,
            isLoadingAgreedDepositForLottery:
                depositForLotteryListener.isLoading,
            isLoadingInitDepositForLottery: depositForLotteryWatcher.isPending,
            isError:
                depositForLotteryListener.isError ||
                depositForLotteryWatcher.isError,

            error:
                depositForLotteryListener.error ||
                depositForLotteryWatcher.error
        }
    };
}
