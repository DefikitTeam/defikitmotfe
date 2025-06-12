/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  resetBuyPoolInformation,
  updateBuyPoolInformation
} from '../buyPoolSlice';
import { IBuyPool } from '../type';

export function useBuyPoolInformation(): [
  IBuyPool,
  (data: IBuyPool) => void,
  () => void
] {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.poolBuy);
  const setBuyPoolInformation = useCallback(
    (data: IBuyPool) => {
      dispatch(updateBuyPoolInformation(data));
    },
    [dispatch]
  );

  const resetData = useCallback(() => {
    dispatch(resetBuyPoolInformation());
  }, [dispatch]);

  return [data, setBuyPoolInformation, resetData];
}
