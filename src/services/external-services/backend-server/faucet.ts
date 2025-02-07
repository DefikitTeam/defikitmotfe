import { NEXT_PUBLIC_API_ENDPOINT } from '@/src/common/web3/constants/env';
import axios from 'axios';

const serviceFaucet = {
    getFaucet: async (address: string, chainId: number) => {
        let res;
        try {
            res = await axios.post(
                `${NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/faucet/${address}`
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
