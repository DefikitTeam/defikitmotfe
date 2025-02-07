import { ChainId } from '@/src/common/constant/constance';
import { EActionStatus, FetchError } from '../type';
import { ITokenList } from '../token/type';
import { IPool } from '@/src/services/response.type';
import { IBuyPool } from '../pool/type';

export interface IGetPortfolioParams {
    chainId: ChainId;
    wallet: string;
}

export interface IPortfolioState extends FetchError {
    status: EActionStatus;
    createdTokens: ITokenList[];
    createdPools: IPool[];
    investedPools: IPool[];
    totalInvestedETH: string;
    priceNative: number;
    idChooseTokenSell: string;
    openModalYourFriendList: boolean;
    openModalReferralHistory: boolean;
    yourFriendList: IYourFriendList[];
    errorCodeYourListFriend: string;
    errorMessageYourListFriend: string;
}
export interface IYourFriendList {
    wallet: string;
    username: string;
}

export interface IGetYourFriendListParams {
    wallet: string;
}
export interface IPortfolioResponseData {
    status: EActionStatus;
    createdTokens: ITokenList[];
    createdPools: IPool[];
    investedPools: IPool[];
    totalInvestedETH: string;
    priceNative: number;
    yourFriendList: IYourFriendList[];
}

export interface InvestPool {
    pendingClaimAmount: string;
    pendingRewardFarming: string;
    balance: string;
}

export interface ISellToken extends IBuyPool {}
