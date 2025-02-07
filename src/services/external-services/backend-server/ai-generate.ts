import { getEnvironmentConfig } from '@/src/common/utils/getEnvironmentConfig';
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD
} from '@/src/common/web3/constants/env';
import axios from 'axios';
const serviceAiGenerate = {
    generateContent: async (prompt: string) => {
        const { isProd } = getEnvironmentConfig();

        const response = await axios.post(
            `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/generateDescription`,
            {
                prompt
            }
        );
        return response.data;
    },

    generateImage: async (prompt: string) => {
        const { isProd } = getEnvironmentConfig();

        const response = await axios.post(
            `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/generateImage`,
            {
                prompt
            }
        );
        return response.data.data;
    },
    generateDataAiAgent: async (prompt: string) => {
        const { isProd } = getEnvironmentConfig();

        const response = await axios.post(
            `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/generateDataAiAgent`,
            {
                prompt
            }
        );
        return response.data.data;
    }
};

export default serviceAiGenerate;
