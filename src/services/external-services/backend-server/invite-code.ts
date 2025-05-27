import { ConfigService } from '@/src/config/services/config-service';
import {
  IGetInviteCodeResponse,
  IInviteReferItem
} from '@/src/stores/invite-code/type';
import { IGetAllQuery } from '@/src/stores/pool/type';
import axios from 'axios';
import {
  IGetAllDataResponse,
  IGetAllInviteListReferResponse
} from '../../response.type';
import { get, post } from '../fetcher';
const config = ConfigService.getInstance();

const serviceInviteCode = {
  getInviteCode: async (): Promise<IGetInviteCodeResponse> => {
    let res;

    res = await get(
      `${config.getApiConfig().baseUrl}/user/referral-code/get-invite-code`
    );

    const data = res as IGetInviteCodeResponse;
    return data;
    // if (res && res.status === 200) {
    //     return res.data;
    // }

    // return res?.data;
  },
  generateInviteCode: async (): Promise<IGetInviteCodeResponse> => {
    let res;
    res = await post<any>(
      `${config.getApiConfig().baseUrl}/user/referral-code/generate-invite-code`
    );

    const data = res as IGetInviteCodeResponse;
    return data;
  },

  checkInviteCode: async (code: string) => {
    let res;
    try {
      res = await axios.get(
        `${config.getApiConfig().baseUrl}/referral-code/check-invite-code?code=${code}`
      );
    } catch (error) {
      console.log('=========== check invite code error: ', error);
      // @ts-ignore
      res = error.response.data;
      return res;
    }

    if (res && res.status === 200) {
      return res.data;
    }
    return '';
  },
  getAllReferrer: async ({
    page,
    limit
  }: IGetAllQuery): Promise<IGetAllDataResponse<IInviteReferItem>> => {
    const payload = { page, limit };
    const response: IGetAllInviteListReferResponse = await get(
      `${config.getApiConfig().baseUrl}/user/referral-code/list-referers`,
      payload
    );

    const formattedResponse: IGetAllDataResponse<IInviteReferItem> = {
      items: response.data,
      meta: {
        itemCount: response.perPage,
        totalItems: response.totalRecords,
        itemsPerPage: response.perPage,
        totalPages: response.totalPage,
        currentPage: response.currentPage
      }
    };
    return formattedResponse;
  }
};

export default serviceInviteCode;
