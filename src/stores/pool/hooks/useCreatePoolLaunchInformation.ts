/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  resetAiAgent,
  resetCreatePoolLaunchData,
  updateCreatePoolLaunchInformation
} from '../createSlice';
import { ICreatePoolLaunch } from '../type';

export function useCreatePoolLaunchInformation(): [
  ICreatePoolLaunch,
  (data: ICreatePoolLaunch) => void,
  () => void,
  () => void
] {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.poolCreateLaunch);

  const setCreatePoolLaiunchInformation = useCallback(
    (data: ICreatePoolLaunch) => {
      dispatch(updateCreatePoolLaunchInformation(data));
    },
    [dispatch]
  );
  const resetData = useCallback(() => {
    dispatch(resetCreatePoolLaunchData());
  }, [dispatch]);
  const resetDataAiAgentAction = useCallback(() => {
    dispatch(resetAiAgent());
  }, [dispatch]);

  return [
    data,
    setCreatePoolLaiunchInformation,
    resetData,
    resetDataAiAgentAction
  ];
}
