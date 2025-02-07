import { getEnvironmentConfig } from '@/src/common/utils/getEnvironmentConfig';
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD
} from '@/src/common/web3/constants/env';
import axios from 'axios';

const serviceFaucet = {
    getFaucet: async (address: string, chainId: number) => {
        const { isProd } = getEnvironmentConfig();
        let res;
        try {
            res = await axios.post(
                `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/faucet/${address}`
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

export default serviceFaucet;
