import { Action } from '@reduxjs/toolkit';

export interface FetchError {
  errorCode: string;
  errorMessage: string;
}

export interface IAction<Payload = any> extends Action {
  payload: Payload;
}

export enum EActionStatus {
  Idle = 'idle',
  Pending = 'pending',
  Succeeded = 'succeeded',
  Failed = 'failed'
}
