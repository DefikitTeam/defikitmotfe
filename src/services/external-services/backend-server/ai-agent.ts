import { ConfigService } from '@/src/config/services/config-service';
import { post } from '../fetcher';

const config = ConfigService.getInstance();
const serviceAiAgent = {
  createAiAgentAfterLaunchPool: async (
    dataAgent: any,
    poolAddress: string,
    ownerAddress: string,
    chainId: string
  ) => {
    let res;

    res = await post<any>(
      `${config.getApiConfig().baseUrl}/c/${chainId}/t/create-agent`,
      {
        dataAgent: dataAgent,
        poolAddress: poolAddress,
        ownerAddress: ownerAddress
      }
    );
    return res;
  }
};

export default serviceAiAgent;
