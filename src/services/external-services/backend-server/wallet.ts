import { ConfigService } from '@/src/config/services/config-service';
import { IGetTrustScoreHistoryWalletParams } from '@/src/stores/wallet/type';
import axios from 'axios';
import { querySubGraph } from '../fetcher';

const config = ConfigService.getInstance();

const serviceWallet = {
    getRankWallet: async (chainId: string, walletAddress: string) => {
        let res;
        try {
            res = await axios.get(
                `${config.getApiConfig().baseUrl}/c/${chainId}/rank-wallet/${walletAddress}`
            );
        } catch (error) {
            // console.log(
            //     '======= get social score info to server error: ',
            //     error
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },
    getTrustScoreHistoryWallet: async ({
        userAddress,
        chainId
    }: IGetTrustScoreHistoryWalletParams) => {
        const query = {
            query: `
                {
            userTrustScoreHistories (
    where: {
      user: "${userAddress.toLowerCase()}"
    }
    orderBy: timestamp
    orderDirection: desc
  ) {
    user {
      id
    }
    timestamp
    trustScore
    reason
    transactionHash
  }

                }

            `
        };

        return querySubGraph(query, chainId);
    }
};

export default serviceWallet;
