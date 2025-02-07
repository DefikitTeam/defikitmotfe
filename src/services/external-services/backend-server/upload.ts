import { NEXT_PUBLIC_API_ENDPOINT } from '@/src/common/web3/constants/env';
import axios from 'axios';

const serviceUpload = {
    getPresignedUrlAvatar: async (
        file: any,
        tokenAddress: string,
        chainId: string
    ) => {
        let data = new FormData();
        data.append('file', file);
        const response = await axios.post(
            `${NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/t/${tokenAddress}/icon`,
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

        try {
            res = await axios.post(
                `${NEXT_PUBLIC_API_ENDPOINT}/c/${chainId}/t/${tokenAddress}/metadata`,
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
    }
};

export default serviceUpload;
