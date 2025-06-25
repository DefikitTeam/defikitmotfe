import { ConfigService } from '@/src/config/services/config-service';
import { get, querySubGraph } from '../fetcher';

const config = ConfigService.getInstance();
const serviceDistribution = {
  getReward: async (
    timestamp: string,
    type: string,
  ) => {
    return await get<any>(
      `${config.getApiConfig().baseUrl}/distribution/reward/${timestamp}/${type.toUpperCase()}`
    );
  },
  getHistoryTransaction: ({ chainId }: { chainId: number }) => {
    const query = {
      query: `
               query getUserDistributionHistory {
  distributionClaims (
    skip: 0
    first: 1000
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    user {
      id
    }
      campaign {
      id
      description
    }
    campaignType
    timestamp
    amount
    transactionHash
    blockNumber
    blockTimestamp
  }
}
            `
    };
    return querySubGraph(query, chainId);
  },
};

export default serviceDistribution;
