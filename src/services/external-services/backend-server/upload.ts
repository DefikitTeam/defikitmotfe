import { getEnvironmentConfig } from '@/src/common/utils/getEnvironmentConfig';
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_ENDPOINT_PROD
} from '@/src/common/web3/constants/env';
import axios from 'axios';

const serviceUpload = {
    getPresignedUrlAvatar: async (
        file: any,
        tokenAddress: string,
        chainId: string
    ) => {
        const { isProd } = getEnvironmentConfig();
        let data = new FormData();
        data.append('file', file);
        const response = await axios.post(
            `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/t/${tokenAddress}/icon`,
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
        const { isProd } = getEnvironmentConfig();
        let data = new FormData();
        data.append('file', file);
        const response = await axios.post(
            `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/icon`,
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
        tokenAddress: string
    ) => {
        let res;
        const { isProd } = getEnvironmentConfig();
        try {
            res = await axios.post(
                `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/t/${tokenAddress}/metadata`,
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

    uploadMetadataToServerWithoutAddress: async (
        metadata: any,
        chainId: string,
        signature: string
    ) => {
        let res;
        const { isProd } = getEnvironmentConfig();
        try {
            res = await axios.post(
                `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/t/${signature}/metadata`,
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
        const { isProd } = getEnvironmentConfig();
        try {
            res = await axios.patch(
                `${isProd ? NEXT_PUBLIC_API_ENDPOINT_PROD : NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/t/${tokenAddress}/metadata`,
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
