import { EActionStatus } from '../type';

export interface ITopRefByVolState {
  topRefByVols: ITopRefByVolItem[];
  status: EActionStatus;
  errorMessage: string;
  errorCode: string;
}

export interface ITopRefByVolItem {
  id: string;
  volumeInETH: string;
}

export interface IGetAllTopRefByVolRequest {
  chainId: string;
}

export interface IGetAllTopRefByVolResponse {
  data: ITopRefByVolItem[];
}
