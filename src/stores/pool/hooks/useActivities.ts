/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/src/stores';
import {
  getAllTransactionByPoolAndSernder,
  setOpenModalActivities
} from '../activitiSlice';
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
  IActivitiesState,
  IDetailPoolState,
  IGetAllTransactionsParams,
  IGetDetailHolderDistributionParams,
  IGetDetailPoolBackgroundParams,
  IGetDetailPoolParams,
  IGetTransactionByPoolAndSenderParams
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

  // const fetchPoolDetailFromServerAction = useCallback(() => {
  //     dispatch(fetchPoolDetailFromServer());
  // }, [dispatch]);

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
    // fetchPoolDetailFromServerAction
  ];
}

type ActivitiesType = {
  activitiesState: IActivitiesState;
  getListTransactionByPoolAndSender: (
    data: IGetTransactionByPoolAndSenderParams
  ) => void;
  setOpenModalActiviti: (isOpenModalActivities: boolean) => void;
};

export const useActivities = (): ActivitiesType => {
  const dispatch = useAppDispatch();
  const activitiesState = useAppSelector(
    (state: RootState) => state.activities
  );

  const getListTransactionByPoolAndSender = useCallback(
    (data: IGetTransactionByPoolAndSenderParams) => {
      dispatch(getAllTransactionByPoolAndSernder(data));
    },
    [dispatch]
  );
  const setOpenModalActiviti = useCallback(
    (isOpenModalActivities: boolean) => {
      dispatch(setOpenModalActivities({ isOpenModalActivities }));
    },
    [dispatch]
  );

  return {
    activitiesState,
    getListTransactionByPoolAndSender,
    setOpenModalActiviti
  };
};
