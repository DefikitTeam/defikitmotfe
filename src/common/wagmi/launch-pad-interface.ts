import { message } from 'antd';
import { JointContent } from 'antd/lib/message/interface';
import { ethers } from 'ethers';
import { Abi, BaseError, ContractFunctionRevertedError } from 'viem';
import { UseWriteContractReturnType } from 'wagmi';
import { ChainId, PLATFORM_FEE } from '../constant/constance';
import BigNumber from 'bignumber.js';
export interface ContractStruct {
    address: `0x${string}`;
    abi: Abi;
    chainId: ChainId;
}

export class LaunchPadInterface {
    _contractStruct: ContractStruct;
    constructor(contractStruct: ContractStruct) {
        this._contractStruct = contractStruct;
    }

    handleErrors(err: any) {
        if (err instanceof BaseError) {
            const revertError = err.walk(
                (err) => err instanceof ContractFunctionRevertedError
            );
            if (revertError instanceof ContractFunctionRevertedError) {
                const errorMessages = revertError.data?.args ?? [''];
                {
                    errorMessages.map((error) =>
                        message.error(error as JointContent)
                    );
                }
            } else {
                return message.error(
                    err?.shortMessage || err?.message || 'Error'
                );
            }
        } else {
            return message.error(err?.shortMessage || err?.message || 'Error');
        }
    }

    async buy(
        watcher: UseWriteContractReturnType,
        params: {
            poolAddress: string;
            numberBatch: string | number;
            maxAmountETH?: string;
            referrer: string;
        }
    ) {
        try {
            const { maxAmountETH, numberBatch, poolAddress, referrer } = params;
            if (!maxAmountETH) {
                throw new Error('Invalid maxAmountETH when buy pool');
            }

            if (numberBatch && poolAddress) {
                await watcher.writeContractAsync({
                    ...this._contractStruct,
                    functionName: 'buy',
                    args: [
                        poolAddress,
                        numberBatch,
                        ethers.parseEther(maxAmountETH),
                        referrer
                    ],
                    value: ethers.parseEther(maxAmountETH)
                });
            }
        } catch (err) {
            this.handleErrors(err);
        }
    }

    async createRocketToken(
        watcher: UseWriteContractReturnType,
        params: {
            name: string;
            symbol: string;
            decimal: string | number;
            totalSupply: string | bigint;
        }
    ) {
        try {
            const { name, symbol, decimal, totalSupply } = params;
            if (!name || !symbol || !decimal || !totalSupply) {
                throw new Error('Invalid params when create token ');
            }

            await watcher.writeContractAsync({
                ...this._contractStruct,
                functionName: 'createRocketToken',
                args: [name, symbol, decimal, totalSupply]
            });
        } catch (err) {
            this.handleErrors(err);
        }
    }

    async createLaunchPool(
        watcher: UseWriteContractReturnType,
        params: {
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
        }
    ) {
        try {
            const {
                token,
                fixedCapETH,
                tokenForAirdrop,
                tokenForFarm,
                tokenForSale,
                tokenForAddLP,
                tokenPerPurchase,
                maxRepeatPurchase,
                startTime,
                minDurationSell,
                maxDurationSell,
                metadata
            } = params;
            if (
                !token ||
                !fixedCapETH ||
                !tokenForAirdrop ||
                !tokenForFarm ||
                !tokenForSale ||
                !tokenForAddLP ||
                !tokenPerPurchase ||
                !maxRepeatPurchase ||
                !startTime ||
                !minDurationSell ||
                !maxDurationSell ||
                !metadata
            ) {
                throw new Error('Invalid params when create launch pool ');
            }
            console.log('comin here');

            await watcher.writeContractAsync({
                ...this._contractStruct,
                functionName: 'activePool',
                args: [
                    {
                        token,
                        fixedCapETH,
                        tokenForAirdrop,
                        tokenForFarm,
                        tokenForSale,
                        tokenForAddLP,
                        tokenPerPurchase,
                        maxRepeatPurchase,
                        startTime,
                        minDurationSell,
                        maxDurationSell,
                        metadata
                    }
                ],
                value: BigInt(
                    new BigNumber(PLATFORM_FEE[this._contractStruct.chainId])
                        .times(1e18)
                        .toFixed(0)
                )
            });
        } catch (error) {
            this.handleErrors(error);
        }
    }

    async claimToken(
        watcher: UseWriteContractReturnType,
        params: {
            poolAddress: string;
        }
    ) {
        try {
            const { poolAddress } = params;
            if (!poolAddress) {
                throw new Error('Invalid poolAddress when claim token ');
            }

            await watcher.writeContractAsync({
                ...this._contractStruct,
                functionName: 'claimToken',
                args: [poolAddress]
            });
        } catch (err) {
            this.handleErrors(err);
        }
    }

    async sellToken(
        watcher: UseWriteContractReturnType,
        params: {
            poolAddress: string;
            numberBatch: string | number;
        }
    ) {
        try {
            const { poolAddress, numberBatch } = params;
            if (!poolAddress || !numberBatch) {
                throw new Error('Invalid params when call sell token');
            }

            await watcher.writeContractAsync({
                ...this._contractStruct,
                functionName: 'sell',
                args: [poolAddress, numberBatch]
            });
        } catch (err) {
            this.handleErrors(err);
        }
    }
}
