/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/src/stores';
import {
  getAllTransactionByPoolAndSernder,
  setOpenModalActivities
} from '../activitiSlice';
import {
  IActivitiesState,
  IGetTransactionByPoolAndSenderParams
} from '../type';

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
