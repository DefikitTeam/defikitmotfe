/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  resetDepositLotteryInformation,
  updateDepositLotteryInformation
} from '../depositLotterySlice';
import { IDepositLottery } from '../type';

export function useDepositLottery(): [
  IDepositLottery,
  (data: IDepositLottery) => void,
  () => void
] {
  const dispatch = useAppDispatch();
  const dataDeposit = useAppSelector(
    (state: RootState) => state.depositLottery
  );
  const setDepositLotteryInformation = useCallback(
    (data: IDepositLottery) => {
      dispatch(updateDepositLotteryInformation(data));
    },
    [dispatch]
  );
  const resetData = useCallback(() => {
    dispatch(resetDepositLotteryInformation());
  }, [dispatch]);

  return [dataDeposit, setDepositLotteryInformation, resetData];
}
