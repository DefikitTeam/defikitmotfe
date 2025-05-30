/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  getTrustScoreHistoryPool,
  resetTrustScoreHistoryPool,
  setOpenModalHistoryPool
} from '../trustScoreHistoryPoolSlice';
import {
  IGetTrustScoreHistoryPoolParams,
  ITrustScoreHistoryPoolState
} from '../type';

type TrustScoreHistoryPoolType = {
  trustScoreHistoryPoolState: ITrustScoreHistoryPoolState;
  getTrustScoreHistoryPoolAction: (
    data: IGetTrustScoreHistoryPoolParams
  ) => void;
  setOpenModalHistoryPoolAction: (isOpenModalHistoryPool: boolean) => void;
  resetTrustScoreHistoryPoolAction: () => void;
};

export const useTrustScoreHistoryPool = (): TrustScoreHistoryPoolType => {
  const dispatch = useAppDispatch();
  const trustScoreHistoryPoolState = useAppSelector(
    (state: RootState) => state.trustScoreHistoryPool
  );

  const getTrustScoreHistoryPoolAction = useCallback(
    (data: IGetTrustScoreHistoryPoolParams) => {
      dispatch(getTrustScoreHistoryPool(data));
    },
    [dispatch]
  );

  const setOpenModalHistoryPoolAction = useCallback(
    (isOpenModalHistoryPool: boolean) => {
      dispatch(setOpenModalHistoryPool({ isOpenModalHistoryPool }));
    },
    [dispatch]
  );

  const resetTrustScoreHistoryPoolAction = useCallback(() => {
    dispatch(resetTrustScoreHistoryPool());
  }, [dispatch]);

  return {
    trustScoreHistoryPoolState,
    getTrustScoreHistoryPoolAction,
    setOpenModalHistoryPoolAction,
    resetTrustScoreHistoryPoolAction
  };
};
