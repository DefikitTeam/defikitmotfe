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

export interface ITrustPointDailyWalltTokenState {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;
    data: {
        userTrustScoreDailies: IUserTrustPointScoreDailyItem[];
        poolTrustScoreDailies: IPoolTrustPointScoreDailyItem[];
    };
}

export interface ITrustPointWeeklyWalletTokenState {
    status: EActionStatus;
    errorMessage: string;
    errorCode: string;
    data: {
        userTrustScoreWeeklies: IUserTrustPointScoreWeeklyItem[];
        poolTrustScoreWeeklies: IPoolTrustPointScoreWeeklyItem[];
    };
}

export interface IUserTrustPointScoreDailyItem {
    id: string;
    user: {
        id: string;
        multiplier: string;
    };
    dayStartUnix: number;
    trustScore: string;
    volume: string;
}

export interface IUserTrustPointScoreWeeklyItem
    extends Omit<IUserTrustPointScoreDailyItem, 'dayStartUnix'> {
    weekStartUnix: number;
}

export interface IPoolTrustPointScoreWeeklyItem
    extends Omit<IPoolTrustPointScoreDailyItem, 'dayStartUnix'> {
    weekStartUnix: number;
}

export interface IPoolTrustPointScoreDailyItem {
    id: string;
    pool: {
        id: string;
        multiplier: string;
        name: string
        symbol: string
        metadata: string
        changePrice24h: string
    };
    dayStartUnix: number;
    tokenTrustPoint: string;
    trustScore: string;
    volume: string;
}
