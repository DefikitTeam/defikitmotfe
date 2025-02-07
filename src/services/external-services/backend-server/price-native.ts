import { getEnvironmentConfig } from '@/src/common/utils/getEnvironmentConfig';
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD
} from '@/src/common/web3/constants/env';
import axios from 'axios';

const servicePriceNative = {
    getPriceNative: async (chainId: string) => {
        const { isProd } = getEnvironmentConfig();

        let res;

        try {
            res = await axios.get(
                `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/getPrice`
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

export default servicePriceNative;
