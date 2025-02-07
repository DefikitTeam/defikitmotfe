import { IGetPortfolioParams } from '@/src/stores/profile/type';
import { IResponseProfileData } from '../../response.type';
import {
    ChainId,
    ENDPOINT_GRAPHQL_WITH_CHAIN
} from '@/src/common/constant/constance';
import { gql, request } from 'graphql-request';
import axios from 'axios';
import { NEXT_PUBLIC_API_ENDPOINT } from '@/src/common/web3/constants/env';

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
             investedPools {
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
        let res;
        try {
            res = await axios.get(
                `${NEXT_PUBLIC_API_ENDPOINT}/w/${wallet}/referers`
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
