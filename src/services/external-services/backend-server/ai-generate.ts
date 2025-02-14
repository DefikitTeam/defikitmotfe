import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD
} from '@/src/common/web3/constants/env';
import { ConfigService } from '@/src/config/services/config-service';
import axios from 'axios';

const config = ConfigService.getInstance();

const serviceAiGenerate = {
    generateContent: async (prompt: string) => {
        const response = await axios.post(
            `${config.getApiConfig().baseUrl}/generateDescription`,
            {
                prompt
            }
        );
        return response.data;
    },

    generateImage: async (prompt: string) => {
        const response = await axios.post(
            `${config.getApiConfig().baseUrl}/generateImage`,
            {
                prompt
            }
        );
        return response.data.data;
    },
    generateDataAiAgent: async (prompt: string) => {
        const response = await axios.post(
            `${config.getApiConfig().baseUrl}/generateDataAiAgent`,
            {
                prompt
            }
        );
        return response.data.data;
    }
};

export default serviceAiGenerate;
