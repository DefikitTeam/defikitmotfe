import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD
} from '@/src/common/web3/constants/env';
import { ConfigService } from '@/src/config/services/config-service';
import axios from 'axios';
const config = ConfigService.getInstance();

const serviceTopRefByVol = {
    getAllTopRefByVol: async (chainId: string) => {
        let res;
        try {
            res = await axios.get(
                `${config.getApiConfig().baseUrl}/c/${chainId}/top-referrer`
            );
        } catch (error) {
            console.log('=========== GET faucet error: ', error);
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    }
};

export default serviceTopRefByVol;
