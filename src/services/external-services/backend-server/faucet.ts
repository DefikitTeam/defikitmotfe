import { ConfigService } from '@/src/config/services/config-service';
import axios from 'axios';
const config = ConfigService.getInstance();

const serviceFaucet = {
  getFaucet: async (address: string, chainId: number) => {
    let res;
    try {
      res = await axios.post(
        `${config.getApiConfig().baseUrl}/c/${chainId}/faucet/${address}`
      );
    } catch (error) {
      // console.log('=========== GET faucet error: ', error);
    }
    if (res && res.status === 200) {
      return res.data;
    }
    return '';
  }
};

export default serviceFaucet;
