/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  resetSellPoolInformation,
  updateSellPoolInformation
} from '../sellPoolSlice';
import { ISellPool } from '../type';

export function useSellPoolInformation(): [
  ISellPool,
  (data: ISellPool) => void,
  () => void
] {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.poolSell);

  const setSellPoolInformation = useCallback(
    (data: ISellPool) => {
      dispatch(updateSellPoolInformation(data));
    },
    [dispatch]
  );

  const resetData = useCallback(() => {
    dispatch(resetSellPoolInformation());
  }, [dispatch]);

  return [data, setSellPoolInformation, resetData];
}
