/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  getAllRankPools,
  getDetailPoolBackground,
  getHolderDistribution,
  getPoolDetail,
  getTransactions,
  resetPoolDetail,
  setOpenModalSocialScore,
  setPageHolderDistribution,
  setPageTransaction
} from '../detailSlice';
import {
  IDetailPoolState,
  IGetAllRankPoolsParams,
  IGetAllTransactionsParams,
  IGetDetailHolderDistributionParams,
  IGetDetailPoolBackgroundParams,
  IGetDetailPoolParams
} from '../type';

export function usePoolDetail(): [
  {
    poolStateDetail: IDetailPoolState;
  },
  // eslint-disable-next-line
  (data: IGetDetailPoolParams) => void,
  // eslint-disable-next-line
  (data: IGetDetailPoolBackgroundParams) => void,
  // eslint-disable-next-line
  (data: IGetDetailHolderDistributionParams) => void,
  // eslint-disable-next-line
  setPageTransactionAction: (isPageTransaction: number) => void,
  // eslint-disable-next-line
  setPageHolderDistributionAction: (isPageHolderDistribution: number) => void,
  // eslint-disable-next-line
  (data: IGetAllTransactionsParams) => void,

  // eslint-disable-next-line
  setOpenModalSocialScore: (isOpenModalSocialScore: boolean) => void,
  // eslint-disable-next-line
  resetPoolDetailAction: () => void
] {
  const dispatch = useAppDispatch();

  const poolStateDetail = useAppSelector(
    (state: RootState) => state.poolDetail
  );

  const fetchPoolDetail = useCallback(
    (data: IGetDetailPoolParams) => {
      dispatch(getPoolDetail(data));
    },
    [dispatch]
  );
  const fetchPoolDetailBackground = useCallback(
    (data: IGetDetailPoolBackgroundParams) => {
      dispatch(getDetailPoolBackground(data));
    },
    [dispatch]
  );
  const fetchHolderDistribution = useCallback(
    (data: IGetDetailHolderDistributionParams) => {
      dispatch(getHolderDistribution(data));
    },
    [dispatch]
  );

  const setPageTransactionAction = useCallback(
    (isPageTransaction: number) => {
      dispatch(setPageTransaction({ isPageTransaction }));
    },
    [dispatch]
  );

  const setPageHolderDistributionAction = useCallback(
    (isPageHolderDistribution: number) => {
      dispatch(setPageHolderDistribution({ isPageHolderDistribution }));
    },
    [dispatch]
  );
  const fetchTransactions = useCallback(
    (data: IGetAllTransactionsParams) => {
      dispatch(getTransactions(data));
    },
    [dispatch]
  );

  const setOpenModalSocialScoreAction = useCallback(
    (isOpenModalSocialScore: boolean) => {
      dispatch(setOpenModalSocialScore({ isOpenModalSocialScore }));
    },
    [dispatch]
  );

  const resetPoolDetailAction = useCallback(() => {
    dispatch(resetPoolDetail());
  }, [dispatch]);

  return [
    {
      poolStateDetail
    },
    fetchPoolDetail,
    fetchPoolDetailBackground,
    fetchHolderDistribution,
    setPageTransactionAction,
    setPageHolderDistributionAction,
    fetchTransactions,
    setOpenModalSocialScoreAction,
    resetPoolDetailAction
  ];
}
