import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import { getTrustPoint } from './get-trust-point-status-slice';
import {
    IGetTrustPointStatusState,
    ITrustPointDailyWalltTokenState,
    ITrustPointWeeklyWalletTokenState
} from './type';
import { getTrustPointToken } from './get-trust-point-status-token-slice';
import {
    IGetTop100TrustPointWalletAndTokenQuery,
    IGetTop100TrustPointWalletAndTokenWeeklyQuery
} from '../pool/type';
import { getTop100TPDailyWalletAndToken } from './trust-point-daily-wallet-token-slice';
import { getTop100TPWeeklyWalletAndToken } from './trust-point-weekly-wallet-token-slice';

type TrustPointType = {
    trustPointStatus: IGetTrustPointStatusState;
    getTrustPointStatusAction: () => void;
};

export function useTrustPoint(): TrustPointType {
    const dispatch = useAppDispatch();
    const trustPointStatus = useAppSelector(
        (state: RootState) => state.trustPoint
    );

    const getTrustPointStatusAction = useCallback(() => {
        dispatch(getTrustPoint());
    }, [dispatch]);

    return {
        trustPointStatus,
        getTrustPointStatusAction
    };
}

type TrustPointTokenType = {
    trustPointToken: IGetTrustPointStatusState;
    getTrustPointTokenAction: (poolAddress: string) => void;
};

export function useTrustPointToken(): TrustPointTokenType {
    const dispatch = useAppDispatch();
    const trustPointToken = useAppSelector(
        (state: RootState) => state.trustPointToken
    );

    const getTrustPointTokenAction = useCallback(
        (poolAddress: string) => {
            dispatch(getTrustPointToken({ poolAddress }));
        },
        [dispatch]
    );

    return {
        trustPointToken,
        getTrustPointTokenAction
    };
}

type TrustPointDailyWalletTokenType = {
    trustPointDailyWalletToken: ITrustPointDailyWalltTokenState;
    getTrustPointDailyWalletTokenAction: (
        params: IGetTop100TrustPointWalletAndTokenQuery
    ) => void;
};

export function useTrustPointDailyWalletToken(): TrustPointDailyWalletTokenType {
    const dispatch = useAppDispatch();
    const trustPointDailyWalletToken = useAppSelector(
        (state: RootState) => state.trustPointDailyWalletToken
    );

    const getTrustPointDailyWalletTokenAction = useCallback(
        (params: IGetTop100TrustPointWalletAndTokenQuery) => {
            dispatch(getTop100TPDailyWalletAndToken(params));
        },
        [dispatch]
    );

    return {
        trustPointDailyWalletToken,
        getTrustPointDailyWalletTokenAction
    };
}

type TrustPointWeeklyWalletTokenType = {
    trustPointWeeklyWalletToken: ITrustPointWeeklyWalletTokenState;
    getTrustPointWeeklyWalletTokenAction: (
        params: IGetTop100TrustPointWalletAndTokenWeeklyQuery
    ) => void;
};

export function useTrustPointWeeklyWalletToken(): TrustPointWeeklyWalletTokenType {
    const dispatch = useAppDispatch();
    const trustPointWeeklyWalletToken = useAppSelector(
        (state: RootState) => state.trustPointWeeklyWalletToken
    );

    const getTrustPointWeeklyWalletTokenAction = useCallback(
        (params: IGetTop100TrustPointWalletAndTokenWeeklyQuery) => {
            dispatch(getTop100TPWeeklyWalletAndToken(params));
        },
        [dispatch]
    );

    return {
        trustPointWeeklyWalletToken,
        getTrustPointWeeklyWalletTokenAction
    };
}
