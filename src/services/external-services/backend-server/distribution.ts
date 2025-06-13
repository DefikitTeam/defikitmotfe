import { ConfigService } from '@/src/config/services/config-service';
import { get } from '../fetcher';

const config = ConfigService.getInstance();
const serviceDistribution = {
  getReward: async (
    timestamp: string,
    type: string,
  ) => {
    return await get<any>(
      `${config.getApiConfig().baseUrl}/distribution/reward/${timestamp}/${type.toUpperCase()}`
    );
  }
};

export default serviceDistribution;
