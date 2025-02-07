import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import {
    getAllNotifications,
    markAllNotificationAsRead,
    markNotificationAsRead,
    resetStatusGetAllNotification,
    resetStatusMarkAllNotification,
    resetStatusMarkOneNotification
} from './slice';
import {
    IGetAllNotificationRequest,
    IMarkAllNotificationAsReadRequest,
    IMarkNotificationAsReadRequest,
    INotificationState
} from './type';

type NotificationType = {
    notificationState: INotificationState;
    getAllNotificationAction: (data: IGetAllNotificationRequest) => void;
    markOneNotificationAction: (data: IMarkNotificationAsReadRequest) => void;
    markAllNotificationAction: (
        data: IMarkAllNotificationAsReadRequest
    ) => void;
    // eslint-disable-next-line
    resetStatusGetAllNotificationAction: () => void;
    // eslint-disable-next-line
    resetStatusMarkAllNotificationAction: () => void;
    // eslint-disable-next-line
    resetStatusMarkOneNotificationAction: () => void;
};

export const useNotification = (): NotificationType => {
    const dispatch = useAppDispatch();
    const notificationState = useAppSelector(
        (state: RootState) => state.notification
    );

    const getAllNotificationAction = useCallback(
        (data: IGetAllNotificationRequest) => {
            dispatch(getAllNotifications(data));
        },
        [dispatch]
    );

    const markOneNotificationAction = useCallback(
        (data: IMarkNotificationAsReadRequest) => {
            dispatch(markNotificationAsRead(data));
        },
        [dispatch]
    );

    const markAllNotificationAction = useCallback(
        (data: IMarkAllNotificationAsReadRequest) => {
            dispatch(markAllNotificationAsRead(data));
        },
        [dispatch]
    );

    const resetStatusGetAllNotificationAction = useCallback(() => {
        dispatch(resetStatusGetAllNotification());
    }, [dispatch]);

    const resetStatusMarkOneNotificationAction = useCallback(() => {
        dispatch(resetStatusMarkOneNotification());
    }, [dispatch]);

    const resetStatusMarkAllNotificationAction = useCallback(() => {
        dispatch(resetStatusMarkAllNotification());
    }, [dispatch]);

    return {
        notificationState,
        getAllNotificationAction,
        markOneNotificationAction,
        markAllNotificationAction,
        resetStatusGetAllNotificationAction,
        resetStatusMarkOneNotificationAction,
        resetStatusMarkAllNotificationAction
    };
};
