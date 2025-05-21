/* eslint-disable */
import { TIME_IN_YEAR } from '@/src/common/constant/constance';
import { IPoolDetail } from '@/src/services/response.type';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { IMetaData, IPoolList, IResponseMetadata } from './type';
import { ConfigService } from '@/src/config/services/config-service';

export const getReserves = (pool: IPoolDetail) => {
    return {
        reserveEth: new BigNumber(pool.reserveETH),
        reserveBatch: new BigNumber(pool.reserveToken)
    };
};

const config = ConfigService.getInstance();
export async function updateMetaDataWorker(
    id: string,

    metadataLink: string,
    // chainId?: string
): Promise<any> {
    try {
        /**
         * 
         *
         *  await axios.get(
                `${config.getApiConfig().baseUrl}/c/${chainId}/getPrice`
            );
         */
        const response: IResponseMetadata | IResponseMetadata =
            await axios.get(metadataLink);
        // await axios.get(
        //     `${config.getApiConfig().baseUrl}/c/${chainId}/t/${id}/metadata`
        // );

        if ('body' in response.data) {
            const { body } = response.data;
            // @ts-ignore
            const res = JSON.parse(body);

            return {
                id: id,
                metadata: {
                    image: res.image,
                    imageAiAgent: res.imageAiAgent,
                    description: res.description,
                    website: res.website,
                    telegram: res.telegram,
                    twitter: res.twitter,
                    discord: res.discord
                }
            };
        }
        const { data } = response;

        return {
            id: id,
            metadata: {
                image: data.image || '',
                imageAiAgent: data.imageAiAgent || '',
                description: data.description || '',
                website: data.website || '',
                telegram: data.telegram,
                twitter: data.twitter,
                discord: data.discord
            }
        };
    } catch (error) {
        return null;
    }
}

export async function updateAnalystDataWorker(
    pool: IPoolDetail,
    priceNative: number
): Promise<any> {
    try {
        // get Price
        const decimalsToken = Number(pool.decimals);
        const tokenPerBatch = new BigNumber(pool.tokenPerBatch).div(
            10 ** decimalsToken
        );
        const tokenPerBondFloorMath = tokenPerBatch.isLessThan(1)
            ? tokenPerBatch.toFixed(6)
            : tokenPerBatch.toFixed(0);

        if (new BigNumber(pool.capInETH).isZero()) {
            return {
                id: pool.id,
                analystData: {
                    apy: '0',
                    raisedETH: pool.raisedInETH,
                    raisedUSD: '0',
                    startPrice: '0',
                    endPrice: '0',
                    currentPrice: '0',
                    liquidityPrice: '0',
                    startBondPerETH: '0',
                    endBondPerETH: '0',
                    listingBondPerETH: '0',
                    tokenPerBond: tokenPerBondFloorMath
                }
            };
        }
        const { reserveBatch, reserveEth } = getReserves(pool);

        const startBondPerETH = new BigNumber(pool.capInETH)
            .div(1e18)
            .div(new BigNumber(pool.totalBatch).times(2)); // start bond = raised / (totalBatch * 2)
        const startPriceBatchInUSD = startBondPerETH.times(priceNative); // start price = cap / (totalBatch * 2 )
        const endBondPerETH = startBondPerETH.times(4); // end bond = start bond * 4
        const endPriceBatchInUSD = startPriceBatchInUSD.times(4); // end price = start price * 4
        const listingBondPerETH = new BigNumber(pool.capInETH)
            .div(1e18)
            .div(
                new BigNumber(pool.tokenForLiquidity).div(
                    new BigNumber(pool.tokenPerBatch)
                )
            ); // listing bond = cap/ tokenForLiquidity
        const liquidityPriceTokenInUSD = listingBondPerETH.times(priceNative); // liquidity price = (cap/tokenForLiquidity) * price ETH
        const currentBondPerETH = reserveEth.div(1e18).div(reserveBatch); // current bond = reverse ETH / reversebatch

        const currentPriceBatchInUSD = currentBondPerETH.times(priceNative); // current price = current bond * price ETH

        // check APY
        let apy = new BigNumber(0);

        if (new BigNumber(pool.tokenForFarm).isZero()) {
            return {
                id: pool.id,
                analystData: {
                    apy: apy.toFixed(2),
                    raisedETH: pool.raisedInETH,
                    raisedUSD: new BigNumber(pool.raisedInETH)
                        .times(priceNative)
                        .div(1e18)
                        .toFixed(2),
                    startPrice: startPriceBatchInUSD
                        .div(tokenPerBatch)
                        .toFixed(18),
                    endPrice: endPriceBatchInUSD.div(tokenPerBatch).toFixed(18),
                    currentPrice: currentPriceBatchInUSD
                        .div(tokenPerBatch)
                        .toFixed(18),
                    liquidityPrice: liquidityPriceTokenInUSD
                        .div(tokenPerBatch)
                        .toFixed(18),
                    startBondPerETH: startBondPerETH.toFixed(6),
                    endBondPerETH: endBondPerETH.toFixed(6),
                    listingBondPerETH: listingBondPerETH.toFixed(6),
                    tokenPerBond: tokenPerBondFloorMath
                }
            };
        }
        const timeDuration = new BigNumber(pool.endTime).minus(pool.startTime);
        const rewardTokenPerYear = new BigNumber(pool.tokenForFarm)
            .div(10 ** decimalsToken)
            .div(timeDuration)
            .times(TIME_IN_YEAR);
        // APY = (rewardTokenPerYear)/ (priceCurrent * totalInvested)
        if (new BigNumber(pool.soldBatch).isZero()) {
            apy = rewardTokenPerYear
                .div(currentPriceBatchInUSD.times(0.5))
                .times(100); // fake soldBatch = 0.5
        } else {
            apy = rewardTokenPerYear
                .div(currentPriceBatchInUSD.times(pool.soldBatch))
                .times(100);
        }

        return {
            id: pool.id,
            analystData: {
                apy: apy.toFixed(2),
                raisedETH: pool.raisedInETH,
                raisedUSD: new BigNumber(pool.raisedInETH)
                    .times(priceNative)
                    .div(1e18)
                    .toFixed(2),
                startPrice: startPriceBatchInUSD.div(tokenPerBatch).toFixed(18),
                endPrice: endPriceBatchInUSD.div(tokenPerBatch).toFixed(18),
                currentPrice: currentPriceBatchInUSD
                    .div(tokenPerBatch)
                    .toFixed(18),
                liquidityPrice: liquidityPriceTokenInUSD
                    .div(tokenPerBatch)
                    .toFixed(18),
                startBondPerETH: startBondPerETH.toFixed(6),
                endBondPerETH: endBondPerETH.toFixed(6),
                listingBondPerETH: listingBondPerETH.toFixed(6),
                tokenPerBond: tokenPerBondFloorMath
            }
        };
    } catch (error) {
        return null;
    }
}

export async function reCalculatePool(
    pools: IPoolList[],
    priceNative: number,
    metaDataFromStore: {
        [key: string]: { id: string; analystData?: IMetaData };
    }
): Promise<any> {
    let metaDataExtraInfo = metaDataFromStore;
    let analystDataExtraInfo = {};
    for (let i = 0; i < pools.length; i++) {
        const pool = pools[i];
        const analystDataPool = await updateAnalystDataWorker(
            pool,
            priceNative
        );
        if (analystDataPool) {
            analystDataExtraInfo = {
                ...analystDataExtraInfo,
                [pool.id]: analystDataPool
            };
        }
        // if (!metaDataExtraInfo[pool.id]) {
        //     const metaDataLink = pool.metadata;
        //     const metaDataPool = await updateMetaDataWorker(
        //         pool.id,
        //         metaDataLink
        //     );
        //     if (metaDataPool) {
        //         metaDataExtraInfo = {
        //             ...metaDataExtraInfo,
        //             [pool.id]: metaDataPool
        //         };
        //     }
        // }
    }
    return {
        metaDataExtraInfo,
        analystDataExtraInfo
    };
}
