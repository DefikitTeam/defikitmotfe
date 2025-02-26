import { config } from '@/src/components/connect-wallet/wagmi';
import { getGasPrice } from '@wagmi/core';
import { message } from 'antd';
import { JointContent } from 'antd/lib/message/interface';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Abi, BaseError, ContractFunctionRevertedError } from 'viem';
import { UseWriteContractReturnType } from 'wagmi';
import { ChainId, PLATFORM_FEE } from '../constant/constance';

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
                const chainId = Number(this._contractStruct.chainId);

                if (isNaN(chainId)) {
                    throw new Error('Invalid chainId');
                }

                const parameters = { chainId: chainId };

                const gasPrice = await getGasPrice(config, parameters);

                if (!gasPrice) {
                    throw new Error('Failed to fetch gas price');
                }

                const adjustedGasPrice = (gasPrice * BigInt(13)) / BigInt(10);

                await watcher.writeContractAsync({
                    ...this._contractStruct,
                    functionName: 'buy',
                    args: [
                        poolAddress,
                        numberBatch,
                        ethers.parseEther(maxAmountETH),
                        referrer
                    ],
                    gasPrice: adjustedGasPrice,
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

    async launchPool(
        watcher: UseWriteContractReturnType,
        params: {
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
        }
    ) {
        try {
            const {
                name,
                symbol,
                decimals,
                totalSupply,
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
                metadata,
                numberBatch,
                maxAmountETH,
                referrer
            } = params;

            const validations: Record<string, any> = {
                name,
                symbol,
                decimals,
                totalSupply,
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
                metadata,
                numberBatch,
                maxAmountETH,
                referrer
            };

            for (const [key, value] of Object.entries(validations)) {
                if (value === undefined || value === null) {
                    const friendlyFieldName = key
                        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                        .toLowerCase() // Convert to lowercase
                        .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
                    throw new Error(
                        `Please provide all required information: ${friendlyFieldName} is missing`
                    );
                }
            }

            await watcher.writeContractAsync({
                ...this._contractStruct,
                functionName: 'launchPool',
                args: [
                    {
                        name,
                        symbol,
                        decimals,
                        totalSupply,
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
                        metadata,
                        numberBatch,
                        maxAmountETH,
                        referrer
                    }
                ],
                // value: BigInt(
                //     new BigNumber(PLATFORM_FEE[this._contractStruct.chainId] + Number(new BigNumber(maxAmountETH).toFixed(0)))
                //         .times(1e18)
                //         .toFixed(0)
                // )
                value: BigInt(
                    new BigNumber(maxAmountETH!)
                        .plus(
                            new BigNumber(
                                PLATFORM_FEE[this._contractStruct.chainId]
                            ).times(1e18)
                        )
                        .toFixed(0)
                )
            });
        } catch (err) {
            this.handleErrors(err);
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

    async spinLottery(
        watcher: UseWriteContractReturnType,
        params: {
            poolAddress: string;
        }
    ) {
        try {
            const { poolAddress } = params;
            if (!poolAddress) {
                throw new Error('Invalid params when call spinLottery');
            }

            await watcher.writeContractAsync({
                ...this._contractStruct,
                functionName: 'spinLottery',
                args: [poolAddress]
            });
        } catch (err) {
            this.handleErrors(err);
        }
    }

    async claimFundLottery(
        watcher: UseWriteContractReturnType,
        params: {
            poolAddress: string;
        }
    ) {
        try {
            const { poolAddress } = params;
            if (!poolAddress) {
                throw new Error('Invalid params when call claimFundLottery');
            }

            await watcher.writeContractAsync({
                ...this._contractStruct,
                functionName: 'claimFundLottery',
                args: [poolAddress]
            });
        } catch (err) {
            this.handleErrors(err);
        }
    }

    async depositForLottery(
        watcher: UseWriteContractReturnType,
        params: {
            poolAddress: string;
            amount: string;
            referrer: string;
        }
    ) {
        try {
            const { poolAddress, amount, referrer } = params;
            console.log('params line 428----', params);
            if (!poolAddress || !amount || !referrer) {
                throw new Error('Invalid params when call depositForLottery');
            }

            if (!amount) {
                throw new Error('Invalid amount when call depositForLottery');
            }

            if (poolAddress) {
                const chainId = Number(this._contractStruct.chainId);

                if (isNaN(chainId)) {
                    throw new Error('Invalid chainId');
                }

                const parameters = { chainId: chainId };

                const gasPrice = await getGasPrice(config, parameters);

                if (!gasPrice) {
                    throw new Error('Failed to fetch gas price');
                }

                const adjustedGasPrice = (gasPrice * BigInt(13)) / BigInt(10);

                await watcher.writeContractAsync({
                    ...this._contractStruct,
                    functionName: 'depositForLottery',
                    args: [poolAddress, ethers.parseEther(amount), referrer],
                    gasPrice: adjustedGasPrice,
                    value: ethers.parseEther(amount)
                });
            }

            // await watcher.writeContractAsync({
            //     ...this._contractStruct,
            //     functionName: 'depositForLottery',
            //     args: [poolAddress, ethers.parseEther(amount), referrer],
            //     gasPrice: adjustedGasPrice,
            //     value: ethers.parseEther(amount)
            // });
        } catch (err) {
            this.handleErrors(err);
        }
    }
}
