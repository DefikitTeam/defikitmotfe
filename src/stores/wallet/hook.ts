import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "..";
import { RootState } from "..";
import { IGetTrustScoreHistoryWalletParams } from "./type";
import { ITrustScoreHistoryWalletState } from "./type";
import { getTrustScoreHistoryWallet, resetTrustScoreHistoryWallet, setOpenModalHistoryWallet } from "./walletSlice";




type TrustScoreHistoryWalletType = {
    trustScoreHistoryWalletState: ITrustScoreHistoryWalletState;
    getTrustScoreHistoryWalletAction: (data: IGetTrustScoreHistoryWalletParams) => void;
    setOpenModalHistoryWalletAction: (isOpenModalHistoryWallet: boolean) => void;
    resetTrustScoreHistoryWalletAction: () => void;
};

export const useTrustScoreHistoryWallet = (): TrustScoreHistoryWalletType => {
    const dispatch = useAppDispatch();
    const trustScoreHistoryWalletState = useAppSelector((state: RootState) => state.trustScoreHistoryWallet);
    
    const getTrustScoreHistoryWalletAction = useCallback(
        (data: IGetTrustScoreHistoryWalletParams) => {
            dispatch(getTrustScoreHistoryWallet(data));
        },
        [dispatch]
    );

    const setOpenModalHistoryWalletAction = useCallback(
        (isOpenModalHistoryWallet: boolean) => {
            dispatch(setOpenModalHistoryWallet({ isOpenModalHistoryWallet }));
        },
        [dispatch]
    );
    
    const resetTrustScoreHistoryWalletAction = useCallback(() => {
        dispatch(resetTrustScoreHistoryWallet());
    }, [dispatch]);

    return {
        trustScoreHistoryWalletState,
        getTrustScoreHistoryWalletAction,
        setOpenModalHistoryWalletAction,
        resetTrustScoreHistoryWalletAction
    };
};