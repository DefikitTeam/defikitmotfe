/* eslint-disable */
import { ConfigService } from "@/src/config/services/config-service";
import { IVerifyTwitterShareResponse } from "../../response.type";
import { post } from "../fetcher";

const config = ConfigService.getInstance();


const serviceVerify = {
    verifyTwitterShare: async (ownerAddress: string, poolAddress: string, chainId: string, finalTwitterUrl: string): Promise<IVerifyTwitterShareResponse> => {
        let res;
        res = await post<any>(
            `${config.getApiConfig().baseUrl}/verify/twitter/token/${chainId}/${poolAddress}/${ownerAddress}`,
            {
                linkTwitterToken: finalTwitterUrl
            }
        )

        const formattedData = res as unknown as IVerifyTwitterShareResponse;
        return formattedData;



    }
}

export default serviceVerify;
