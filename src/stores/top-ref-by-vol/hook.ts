import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import { getAllTopRefByVol, resetStatusTopRefByVolState } from './slice';
import { IGetAllTopRefByVolRequest, ITopRefByVolState } from './type';

type TopRefByVolType = {
  topRefByVolState: ITopRefByVolState;
  getAllTopRefByVolAction: (data: IGetAllTopRefByVolRequest) => void;
  // eslint-disable-next-line
  resetStatusGetAllTopRefByVolAction: () => void;
};

export const useTopRefByVol = (): TopRefByVolType => {
  const dispatch = useAppDispatch();
  const topRefByVolState = useAppSelector(
    (state: RootState) => state.topRefByVol
  );

  const getAllTopRefByVolAction = useCallback(
    (data: IGetAllTopRefByVolRequest) => {
      dispatch(getAllTopRefByVol(data));
    },
    [dispatch]
  );

  const resetStatusGetAllTopRefByVolAction = useCallback(() => {
    dispatch(resetStatusTopRefByVolState());
  }, [dispatch]);

  return {
    topRefByVolState,
    getAllTopRefByVolAction,
    resetStatusGetAllTopRefByVolAction
  };
};
