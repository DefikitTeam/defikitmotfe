import { IResponsePriceNative } from '@/src/stores/pool/type';
import { get } from '../fetcher';

const servicePriceNative = {
    getPriceNative: async (): Promise<IResponsePriceNative> => {
        const response = await get<IResponsePriceNative>('/getPriceETH');
        return response.data;
    }
};

export default servicePriceNative;
