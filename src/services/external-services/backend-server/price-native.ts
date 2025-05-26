import { ConfigService } from '@/src/config/services/config-service';
import axios from 'axios';
const config = ConfigService.getInstance();
const servicePriceNative = {
  getPriceNative: async (chainId: string) => {
    let res;

    try {
      res = await axios.get(
        `${config.getApiConfig().baseUrl}/c/${chainId}/getPrice`
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

export default servicePriceNative;

config.getApiConfig().baseUrl;
