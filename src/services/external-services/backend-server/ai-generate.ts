import { NEXT_PUBLIC_API_ENDPOINT } from '@/src/common/web3/constants/env';
import axios from 'axios';

const serviceAiGenerate = {
    generateContent: async (prompt: string) => {
        const response = await axios.post(
            `${NEXT_PUBLIC_API_ENDPOINT}/generateDescription`,
            {
                prompt
            }
        );
        return response.data;
    },

    generateImage: async (prompt: string) => {
        const response = await axios.post(
            `${NEXT_PUBLIC_API_ENDPOINT}/generateImage`,
            {
                prompt
            }
        );
        return response.data.data;
    }
};

export default serviceAiGenerate;
