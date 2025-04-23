import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import { getTrustPoint } from './get-trust-point-status-slice';
import { IGetTrustPointStatusState } from './type';

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
