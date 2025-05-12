import { ConfigService } from '@/src/config/services/config-service';
import axios from 'axios';

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
    }
};

export default serviceWallet;
