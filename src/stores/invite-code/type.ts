import { IGetAllQuery } from '../pool/type';
import { EActionStatus } from '../type';

export interface IInviteCodeState {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;
}

export interface IInviteListRefer extends IGetAllQuery {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;
    data: IInviteReferItem[];
    totalInviteListRefer: number;
    isOpenModalInviteListRefer: boolean;
}

export interface IInviteReferItem {
    id: number;
    code: string;
    userId: number;
    userRefId: number;
    UserRef: {
        connectedWallet: string;
    };
}

export interface IGetInviteCodeState {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;
    data: IGetInviteCodeResponseItem[];
    isOpenModalGetListCurrentCode: boolean;
}
export interface IGetInviteCodeResponse {
    data: IGetInviteCodeResponseItem[];
}

export interface IGetInviteCodeResponseItem {
    code: string;
    status: string;
}

export interface ICheckInviteCodeState {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;
    data: string;
}

export interface ICheckInviteCodeRequest {
    code: string;
}

export interface ICheckInviteCodeResponse {
    refId: string;
}

export interface IInviteListReferColumns {
    wallet: string;
    code: string;
    // isUsed: boolean;
}
