/* eslint-disable */
import { ConfigService } from '@/src/config/services/config-service';
import { IGetPortfolioParams } from '@/src/stores/profile/type';
import axios from 'axios';
import { gql, request } from 'graphql-request';
import { IResponseProfileData } from '../../response.type';
import { ChainId } from '@/src/common/constant/constance';
import { querySubGraph } from '../fetcher';

const config = ConfigService.getInstance();

const servicePortfolio = {
  getProfileDAtaFromSubgraph: async ({
    chainId,
    wallet
  }: IGetPortfolioParams) => {
    const config = ConfigService.getInstance();
    const endpoint = config.getApiConfig().endpoints.subgraph[chainId];

    const response: IResponseProfileData = await request(
      endpoint,
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
    let res;
    try {
      res = await axios.get(
        `${config.getApiConfig().baseUrl}/w/${wallet}/referers`
      );
    } catch (error) {
      console.log('======== get your friend list error', error);
    }
    if (res && res.status === 200) {
      return res.data;
    }
    return res;
  },

  getRecentTx: async (
    page: number,
    limit: number,
    userWalletAddress: string,
    chainId: ChainId = ChainId.BASE_SEPOLIA
  ) => {
    const skip = (page - 1) * limit;
    const query = {
      query: `
      {
        transactionUsers(
          where: {sender: "${userWalletAddress}"}
          orderBy: timestamp
          orderDirection: desc
        ) {
            id
            hash
            sender
            blockNumber
            timestamp
            batch
            eth
            type
            trustScoreUser
        }
      }
      `
    };
    return querySubGraph(query, chainId);
  }
};

export default servicePortfolio;
