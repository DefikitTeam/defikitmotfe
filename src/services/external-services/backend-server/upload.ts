import { ConfigService } from '@/src/config/services/config-service';
import axios from 'axios';
const config = ConfigService.getInstance();

const serviceUpload = {
    getPresignedUrlAvatar: async (
        file: any,
        tokenAddress: string,
        chainId: string
    ) => {
        let data = new FormData();
        data.append('file', file);
        const response = await axios.post(
            `${config.getApiConfig().baseUrl}/c/${chainId}/t/${tokenAddress}/icon`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        if (response && response.status === 200) {
            return response.data.fileUrl;
        }
        return '';
    },
    getPresignedUrlAvatarWithoutAddress: async (file: any, chainId: string) => {
        let data = new FormData();
        data.append('file', file);
        const response = await axios.post(
            `${config.getApiConfig().baseUrl}/c/${chainId}/icon`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        if (response && response.status === 200) {
            return response.data.fileUrl;
        }
        return '';
    },

    uploadMetadataToServer: async (
        metadata: any,
        chainId: string,
        tokenAddress: string,
        address?: string,
        signature?: string,
        message?: string
    ) => {
        let res;
        try {
            res = await axios.post(
                `${config.getApiConfig().baseUrl}/c/${chainId}/t/${tokenAddress}/metadata`,
                {
                    body: metadata,
                    address,
                    signature,
                    message
                }
            );
        } catch (error) {
            console.log('======= UPLOAD metadata to server error: ', error);
        }

        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },

    uploadMetadataToServerWithoutAddress: async (
        metadata: any,
        chainId: string,
        signature: string
    ) => {
        let res;
        try {
            res = await axios.post(
                `${config.getApiConfig().baseUrl}/c/${chainId}/t/${signature}/metadata`,
                {
                    body: metadata
                }
            );
        } catch (error) {
            console.log('======= UPLOAD metadata to server error: ', error);
        }

        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    },

    updateMetadata: async (
        chainId: string,
        tokenAddress: string,
        signature: string
    ) => {
        let res;
        try {
            res = await axios.patch(
                `${config.getApiConfig().baseUrl}/c/${chainId}/t/${tokenAddress}/metadata`,
                // {
                //     body: metadata
                // }
                {
                    signature
                }
            );
        } catch (error) {
            console.log('======= UPLOAD metadata to server error: ', error);
        }
        if (res && res.status === 200) {
            return res.data;
        }
        return '';
    }
};

export default serviceUpload;
