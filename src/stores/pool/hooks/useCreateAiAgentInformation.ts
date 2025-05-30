/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  resetCreateAiAgentInformation,
  setOpenModalCreateAiAgent,
  updateCreateAiAgentInformation
} from '../createAiAgent';
import {
  ICreateAiAgent
} from '../type';

export function useCreateAiAgentInformation(): [
  ICreateAiAgent,
  (data: ICreateAiAgent) => void,
  () => void,
  setOpenModalCreateAiAgentAction: (isOpenModalCreateAiAgent: boolean) => void
] {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state.createAiAgent);
  const setCreateAiAgentInformationAction = useCallback(
    (data: ICreateAiAgent) => {
      dispatch(updateCreateAiAgentInformation(data));
    },
    [dispatch]
  );
  const resetDataAction = useCallback(() => {
    dispatch(resetCreateAiAgentInformation());
  }, [dispatch]);

  const setOpenModalCreateAiAgentAction = useCallback(
    (isOpenModalCreateAiAgent: boolean) => {
      dispatch(setOpenModalCreateAiAgent({ isOpenModalCreateAiAgent }));
    },
    [dispatch]
  );

  return [
    data,
    setCreateAiAgentInformationAction,
    resetDataAction,
    setOpenModalCreateAiAgentAction
  ];
} 