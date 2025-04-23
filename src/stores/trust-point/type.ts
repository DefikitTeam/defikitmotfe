import { EActionStatus } from '../type';

export interface IGetTrustPointResponse {
    data: IGetTrustPointResponseItem[];
}

export interface IGetTrustPointResponseItem {
    id: number;
    multiplier: number;
    description: string;
    trustPointType: string;
    completed: boolean;
    claimed: boolean;
    reason: string;
}

export interface IGetSignatureTrustPointResponse {
    data: IGetSignatureTrustPointResponseItem;
}

export interface IGetSignatureTrustPointResponseItem {
    tokenId: number;
    signature: string;
}

export interface IGetTrustPointStatusState {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;

    data: IGetTrustPointResponseItem[];
}

export interface IGetSignatureTrustPointState {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;
    data: IGetSignatureTrustPointResponseItem;
}
