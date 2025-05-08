/* eslint-disable */
import { ChainId } from '@/src/common/constant/constance';
import { logger } from '@/src/common/utils/logger';
import { ConfigService } from '@/src/config/services/config-service';
import { updateMetaDataWorker } from '@/src/stores/pool/common';
import {
    IGetAllPoolBackgroundQuery,
    IGetAllPoolQuery,
    IGetDetailHolderDistributionParams,
    IGetDetailPoolParams,
    IGetPoolInfoRewardParams,
    IGetTop100TrustPointWalletAndTokenMonthlyQuery,
    IGetTop100TrustPointWalletAndTokenQuery,
    IGetTop100TrustPointWalletAndTokenWeeklyQuery,
    IGetTransactionByPoolAndSenderParams,
    IGetUserPoolParams,
    IGetUserTopRewardByPoolParams,
    IReferralPool
} from '@/src/stores/pool/type';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { querySubGraph } from '../fetcher';
import {
    getQueryByStatus,
    getTop100TPDailyCombinedQuery,
    getTop100TPMonthlyCombinedQuery,
    getTop100TPWeeklyCombinedQuery
} from './query';
export const REFERRAL_CODE_INFO_STORAGE_KEY = 'refId';
// const currentHostName = useCurrentHostNameInformation();
// const isProd =
//     currentHostName.url === NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD;
// const environment = getEnvironment()

const config = ConfigService.getInstance();

const servicePool = {
    getDetailPoolInfo: ({ poolAddress, chainId }: IGetDetailPoolParams) => {
        const query = {
            query: `
                {
                    pool(id: "${poolAddress}") {
                        id
                        owner
                        name
                        symbol
                        decimals
                        metadata
                        startTime
                        endTime
                        minDurationSell
                        totalSupplyToken
                        tokenForAirdrop
                        tokenForFarm
                        tokenForSale
                        tokenForLiquidity
                        capInETH
                        totalBatch
                        tokenPerBatch
                        batchAvailable
                        raisedInETH
                        soldBatch
                        feeForLiquidity
                        latestTimestampBuy
                        latestBuyTransactionHash
                        totalTransaction
                        status
                        changePrice24h
                        buyTransactions {
                            eth
                            blockNumber
                        }
                        tgeTimestamp
                        reserveETH
                        reserveToken
                    }
                }
            `
        };
        return querySubGraph(query, chainId);
    },
    // getUserPool: ({
    //     poolAddress,
    //     userAddress,
    //     chainId
    // }: IGetDetailPoolParams) => {
    //     const query = {
    //         query: `{
    //                 userInPools(where: {user: "${userAddress}, pool: "${poolAddress}"}) {
    //                     id
    //                     pool
    //                     user
    //                     batch
    //                     ethBought
    //                     batchClaimed
    //                 }
    //             }`
    //     };
    //     return querySubGraph(query, chainId);
    // },
    getTransaction: async (
        page: number,
        limit: number,
        poolAddress: string | undefined,
        chainId: ChainId = ChainId.BASE_SEPOLIA
    ) => {
        const skip = (page - 1) * limit;
        const query = {
            query: `
      {
        transactions(
          
          where: {pool: "${poolAddress}",}
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          hash
          type
          pool
          sender
          blockNumber
          timestamp
          batch
          eth
          isBuy
        }
      }
      `
        };
        return querySubGraph(query, chainId);
    },

    getAllPoolByType: ({
        chainId,
        statusPool,
        query,
        owner
    }: IGetAllPoolQuery | IGetAllPoolBackgroundQuery) => {
        const payload = {
            query: getQueryByStatus({
                status: statusPool,
                query: query,
                owner: owner
            })
        };
        return querySubGraph(payload, chainId!);
    },

    getPoolMetadata: async (poolId: string, chainId: string) => {
        try {
            const response = await updateMetaDataWorker(poolId, chainId);

            return response;
        } catch (error) {
            throw error;
        }
    },

    getTransactionByPoolAndSender: ({
        poolAddress,
        chainId,
        senderAddress
    }: IGetTransactionByPoolAndSenderParams) => {
        const query = {
            query: `
                query getTransactionByPoolAndSender {
                transactions(where: {pool: "${poolAddress}", sender: "${senderAddress}"}, orderBy: timestamp, orderDirection: desc) {
                    id
                    pool
                    sender
                    blockNumber
                    timestamp
                    batch
                    eth
                    isBuy
                }
            }
            `
        };

        return querySubGraph(query, chainId);
    },
    getUserPool: ({
        chainId,
        poolAddress,
        userAddress
    }: IGetUserPoolParams) => {
        const query = {
            query: `{
        userInPools(
          where: {user: "${userAddress}", pool: "${poolAddress}"}
        ) {
          id
          pool
          user
          batch
          ethBought
          batchClaimed
        }
      }`
        };
        return querySubGraph(query, chainId);
    },

    getPoolInfoReward: ({ id, chainId }: IGetPoolInfoRewardParams) => {
        const query = {
            query: `
             query getPool {
  pool(id: "${id}") {
    id
    tokenAddress
    owner
    name
    tokenForAirdrop
    totalReferrerBond
    tokenRewardReferrerPerBond
  }
}


            
            `
        };
        return querySubGraph(query, chainId);
    },

    getUserTopRewardByPool: ({
        pool,
        chainId
    }: IGetUserTopRewardByPoolParams) => {
        const query = {
            query: `    
               query getUserByPool {
  userInPools(
    orderBy: referrerBond
    orderDirection: desc
    where: {pool: "${pool}", referrerBond_gt: 0}
  ) {
    id
    pool
    user
    batch
    ethBought
    batchClaimed
    referrerBond
  }
}

                        `
        };
        return querySubGraph(query, chainId);
    },

    storeReferId: (refer: IReferralPool | null) => {
        if (refer) {
            if (typeof window !== 'undefined') {
                const existingRefId = localStorage.getItem(
                    REFERRAL_CODE_INFO_STORAGE_KEY
                );
                if (!existingRefId) {
                    localStorage.setItem(
                        REFERRAL_CODE_INFO_STORAGE_KEY,
                        JSON.stringify(refer)
                    );
                } else {
                    console.log('RefId existed: ', existingRefId);
                }
            }
        }
    },

    getReferId: (): IReferralPool | null => {
        if (typeof window !== 'undefined') {
            const refer = localStorage.getItem(REFERRAL_CODE_INFO_STORAGE_KEY);

            return refer ? (JSON.parse(refer) as IReferralPool) : null;
        }
        return null;
    },

    createLaunchPool: async (
        name: string,
        symbol: string,
        decimals: string,
        totalSupply: string,
        address: string,
        chainId: string,
        dataAgent?: any,
        ownerAddress?: string
    ) => {
        let res;

        const totalSupplyFormatted = new BigNumber(totalSupply)
            .div(10 ** parseInt(decimals))
            .toFixed(0);

        const data: any = {
            name,
            symbol,
            decimals,
            totalSupply: totalSupplyFormatted,
            address
        };

        if (dataAgent !== undefined) {
            data.dataAgent = dataAgent;
            data.ownerAddress = ownerAddress;
        }

        try {
            res = await axios.post(
                `${config.getApiConfig().baseUrl}/c/${chainId}/t`,
                data
            );
        } catch (error) {
            console.log('======= create launch pool to server error: ', error);
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },

    getDetailPoolDataFromServer: async (chainId: string, address: string) => {
        let res;

        try {
            res = await axios.get(
                `${config.getApiConfig().baseUrl}/c/${chainId}/t/${address}`
            );
        } catch (error) {
            logger.error(
                `======= get detail pool data from server error: ${error}`
            );
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },

    getSocialScoreInfo: async (chainId: string, address: string) => {
        let res;
        try {
            res = await axios.get(
                `${config.getApiConfig().baseUrl}/c/${chainId}/t/${address}/social-score`
            );
        } catch (error) {
            // console.log(
            //     '======= get social score info to server error: ',
            //     error
            // );
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },
    getHolderDistribution: ({
        poolAddress,
        chainId
    }: IGetDetailHolderDistributionParams) => {
        const query = {
            query: `
                  {
  holders(
    orderBy: batch
    orderDirection: desc
    where: { pool: "${poolAddress}", batch_gt: 0 }
  ) {
    pool
    user
    batch
    isPool
    isCreator
  }
        }


            `
        };
        return querySubGraph(query, chainId);
    },
    getListFocusPools: async (chainId: string) => {
        let res;

        try {
            res = await axios.get(
                `${config.getApiConfig().baseUrl}/c/${chainId}/focus-pools`
            );
        } catch (error) {
            // console.log(
            //     '======= get list focus pools to server error: ',
            //     error
            // );
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return [];
    },

    getTop100TrustPointWalletAndToken: ({
        dayStartUnix,
        chainId
    }: IGetTop100TrustPointWalletAndTokenQuery) => {
        const payload = {
            query: getTop100TPDailyCombinedQuery({ dayStartUnix })
        };
        return querySubGraph(payload, chainId);
    },

    getTop100TrustPointWalletAndTokenWeekly: ({
        weekStartUnix,
        chainId
    }: IGetTop100TrustPointWalletAndTokenWeeklyQuery) => {
        const payload = {
            query: getTop100TPWeeklyCombinedQuery({ weekStartUnix })
        };
        return querySubGraph(payload, chainId);
    },

    getTop100TrustPointWalletAndTokenMonthly: ({
        monthStartUnix,
        chainId
    }: IGetTop100TrustPointWalletAndTokenMonthlyQuery) => {
        const payload = {
            query: getTop100TPMonthlyCombinedQuery({ monthStartUnix })
        };
        return querySubGraph(payload, chainId);
    }
};

export default servicePool;
