import { EActionStatus } from '../type';
export interface INotificationState {
    // all notis
    errorMessageGetAllNotification: string;
    errorCodeGetAllNotification: string;
    statusGetAllNotification: EActionStatus;
    // mark one noti
    errorMessageMarkOneNotification: string;
    errorCodeMarkOneNotification: string;
    statusMarkOneNotification: EActionStatus;
    // mark all notis
    errorMessageMarkAllNotification: string;
    errorCodeMarkAllNotification: string;
    statusMarkAllNotification: EActionStatus;

    notifications: INotification[];
}

export interface INotification {
    id: number;
    userId: number;
    rocketId: number;
    title: string;
    content: string;
    type: string;
    status: string;
    rocket: {
        address: string;
    };
}

export interface IGetAllNotificationRequest {
    chainId: string;
    address: string;
}

export interface IGetAllNotificationResponse {
    data: INotification[];
}

export interface IMarkNotificationAsReadRequest {
    chainId: string;
    notificationId: number;
}
export interface IMarkNotificationAsReadResponse
    extends Omit<INotification, 'rocket'> {}

export interface IMarkAllNotificationAsReadRequest
    extends IGetAllNotificationRequest {}
export interface IMarkAllNotificationAsReadResponse {
    status: EActionStatus;
}
