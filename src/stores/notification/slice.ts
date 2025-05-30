/* eslint-disable */

import serviceNotification from '@/src/services/external-services/backend-server/notification';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import {
  IGetAllNotificationRequest,
  IGetAllNotificationResponse,
  IMarkAllNotificationAsReadRequest,
  IMarkAllNotificationAsReadResponse,
  IMarkNotificationAsReadRequest,
  IMarkNotificationAsReadResponse,
  INotificationState
} from './type';

const initialState: INotificationState = {
  errorMessageGetAllNotification: '',
  errorCodeGetAllNotification: '',
  statusGetAllNotification: EActionStatus.Idle,

  errorMessageMarkOneNotification: '',
  errorCodeMarkOneNotification: '',
  statusMarkOneNotification: EActionStatus.Idle,

  errorMessageMarkAllNotification: '',
  errorCodeMarkAllNotification: '',
  statusMarkAllNotification: EActionStatus.Idle,

  notifications: []
};

export const getAllNotifications = createAsyncThunk<
  IGetAllNotificationResponse,
  IGetAllNotificationRequest,
  {
    rejectValue: FetchError;
  }
>('notification/getAllNotifications', async (params, { rejectWithValue }) => {
  try {
    const notifications = await serviceNotification.getAllNotifications(
      params.address,
      params.chainId
    );
    return notifications;
  } catch (error) {
    const err = error as AxiosError;
    const responseData: any = err.response?.data;
    const responseStatus: any = err.response?.status || 0;
    return rejectWithValue({
      errorMessage: responseData?.error,
      errorCode: responseStatus
    });
  }
});

export const markNotificationAsRead = createAsyncThunk<
  IMarkNotificationAsReadResponse,
  IMarkNotificationAsReadRequest,
  {
    rejectValue: FetchError;
  }
>(
  'notification/markNotificationAsRead',
  async (params, { rejectWithValue }) => {
    try {
      const markNotificationResponse =
        await serviceNotification.markNotificationAsRead(
          params.chainId,
          params.notificationId
        );

      return markNotificationResponse;
    } catch (error) {
      const err = error as AxiosError;
      const responseData: any = err.response?.data;
      const responseStatus: any = err.response?.status || 0;
      return rejectWithValue({
        errorMessage: responseData?.error,
        errorCode: responseStatus
      });
    }
  }
);

export const markAllNotificationAsRead = createAsyncThunk<
  IMarkAllNotificationAsReadResponse,
  IMarkAllNotificationAsReadRequest,
  {
    rejectValue: FetchError;
  }
>(
  'notification/markAllNotificationAsRead',
  async (params, { rejectWithValue }) => {
    try {
      const markAllNotificationResponse =
        await serviceNotification.markAllNotificationAsRead(
          params.address,
          params.chainId
        );

      return markAllNotificationResponse;
    } catch (error) {
      const err = error as AxiosError;
      const responseData: any = err.response?.data;
      const responseStatus: any = err.response?.status || 0;
      return rejectWithValue({
        errorMessage: responseData?.error,
        errorCode: responseStatus
      });
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    resetStatusGetAllNotification: (state: INotificationState) => {
      state.statusGetAllNotification = EActionStatus.Idle;
    },
    resetStatusMarkOneNotification: (state: INotificationState) => {
      state.statusMarkOneNotification = EActionStatus.Idle;
    },
    resetStatusMarkAllNotification: (state: INotificationState) => {
      state.statusMarkAllNotification = EActionStatus.Idle;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state, action) => {
        state.statusGetAllNotification = EActionStatus.Pending;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.statusGetAllNotification = EActionStatus.Succeeded;
        state.notifications = action.payload.data;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.statusGetAllNotification = EActionStatus.Failed;
        state.errorMessageGetAllNotification =
          action.payload?.errorMessage || '';
        state.errorCodeGetAllNotification = action.payload?.errorCode || '';
      })
      .addCase(markNotificationAsRead.pending, (state, action) => {
        state.statusMarkOneNotification = EActionStatus.Pending;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.statusMarkOneNotification = EActionStatus.Succeeded;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.statusMarkOneNotification = EActionStatus.Failed;
        state.errorMessageMarkOneNotification =
          action.payload?.errorMessage || '';
        state.errorCodeMarkOneNotification = action.payload?.errorCode || '';
      })
      .addCase(markAllNotificationAsRead.pending, (state, action) => {
        state.statusMarkAllNotification = EActionStatus.Pending;
      })
      .addCase(markAllNotificationAsRead.fulfilled, (state, action) => {
        state.statusMarkAllNotification = EActionStatus.Succeeded;
      })
      .addCase(markAllNotificationAsRead.rejected, (state, action) => {
        state.statusMarkAllNotification = EActionStatus.Failed;
        state.errorMessageMarkAllNotification =
          action.payload?.errorMessage || '';
        state.errorCodeMarkAllNotification = action.payload?.errorCode || '';
      });
  }
});

export const {
  resetStatusGetAllNotification,
  resetStatusMarkOneNotification,
  resetStatusMarkAllNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
