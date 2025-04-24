import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import { getTrustPoint } from './get-trust-point-status-slice';
import { IGetTrustPointStatusState } from './type';
import { getTrustPointToken } from './get-trust-point-status-token-slice';

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
