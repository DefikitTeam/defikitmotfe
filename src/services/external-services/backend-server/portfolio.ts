import {
    ChainId,
    ENDPOINT_GRAPHQL_WITH_CHAIN
} from '@/src/common/constant/constance';
import { getEnvironmentConfig } from '@/src/common/utils/getEnvironmentConfig';
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD
} from '@/src/common/web3/constants/env';
import { IGetPortfolioParams } from '@/src/stores/profile/type';
import axios from 'axios';
import { gql, request } from 'graphql-request';
import { IResponseProfileData } from '../../response.type';
const servicePortfolio = {
    getProfileDAtaFromSubgraph: async ({
        chainId,
        wallet
    }: IGetPortfolioParams) => {
        const response: IResponseProfileData = await request(
            ENDPOINT_GRAPHQL_WITH_CHAIN[chainId] ||
                ENDPOINT_GRAPHQL_WITH_CHAIN[ChainId.BARTIO],
            gql`
                query getProfileData {
                    user(id: "${wallet.toLowerCase()}") {
                        id
                        createdTokens {
                            id
                            owner
                            name
                            symbol
                            decimals
                            totalSupply
                            status
                        }
                        createdPools {
            id
            owner
            name
            symbol
            decimals
            metadata
            startTime
            endTime
            totalSupplyToken
            tokenForAirdrop
            tokenForFarm
            tokenForSale
            tokenForLiquidity
            capInETH
            totalBatch
            batchAvailable
            raisedInETH
            soldBatch
            feeForLiquidity
            latestTimestampBuy
            latestBuyTransactionHash
            totalTransaction
            changePrice24h
            status
          }
             investedPools(
      first: 1000
      where: {or: [{status: "ACTIVE"}, {status: "FINISHED"}]}
    ) {
      id
      owner
      name
      symbol
      decimals
      metadata
      startTime
      endTime
      totalSupplyToken
      tokenForAirdrop
      tokenForFarm
      tokenForSale
      tokenForLiquidity
      capInETH
      totalBatch
      batchAvailable
      raisedInETH
      soldBatch
      feeForLiquidity
      latestTimestampBuy
      latestBuyTransactionHash
      totalTransaction
      status
      changePrice24h
    }
          totalInvestedETH

                    }
                }
            
            `
        );

        return response || {};
    },

    getYourFriendList: async (wallet: string) => {
        const { isProd } = getEnvironmentConfig();
        let res;
        try {
            res = await axios.get(
                `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/w/${wallet}/referers`
            );
        } catch (error) {
            console.log('======== get your friend list error', error);
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return res;
    }
};

export default servicePortfolio;
