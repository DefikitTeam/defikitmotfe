import { EActionStatus, FetchError } from '../type';

export interface IGetTrustScoreHistoryWalletParams {
    userAddress: string;
    chainId: number;
}

export interface ITrustScoreHistoryWalletState extends FetchError {
    status: EActionStatus;
    trustScoreHistoryWallet: IWalletTrustScoreHistory[];
    openModalHistoryWallet: boolean;
}

export interface IWalletTrustScoreHistory {
    wallet: string;
    timestamp: number;
    trustScore: number;
    reason: string;
    transactionHash: string;
}
