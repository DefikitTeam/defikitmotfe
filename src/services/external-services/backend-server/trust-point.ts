import { ConfigService } from '@/src/config/services/config-service';
import {
    IGetSignatureTrustPointResponse,
    IGetSignatureTrustPointResponseItem,
    IGetTrustPointResponse
} from '@/src/stores/trust-point/type';
import { get, post } from '../fetcher';

const config = ConfigService.getInstance();

const serviceTrustPoint = {
    getTrustPoint: async (): Promise<IGetTrustPointResponse> => {
        let res;
        res = await get(
            `${config.getApiConfig().baseUrl}/user/trust-point/status`
        );
        // @ts-ignore
        const formattedData = res.trustPoints.wallet;
        return { data: formattedData };
    },
    getSignatureTrustPoint: async (
        tokenId: number
    ): Promise<IGetSignatureTrustPointResponse> => {
        let res;
        res = await post<any>(
            `${config.getApiConfig().baseUrl}/user/trust-point/signature`,
            {
                tokenId: tokenId
            }
        );

        const data = res as unknown as IGetSignatureTrustPointResponseItem;

        const formattedData = {
            data: {
                tokenId: data.tokenId,
                signature: data.signature
            }
        };

        return formattedData;
    }
};

export default serviceTrustPoint;
