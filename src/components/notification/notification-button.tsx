/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import useWindowSize from '@/src/hooks/useWindowSize';
import { useTranslations } from 'next-intl';
import { useNotification } from '@/src/stores/notification/hook';
import { useAccount } from 'wagmi';
import { RootState } from '@/src/stores';
import { useSelector } from 'react-redux';
import { NOTIFICATION_STATUS } from '@/src/common/constant/constance';
import { EActionStatus } from '@/src/stores/type';
import { useRouter } from 'next/navigation';
const NotificationButton = () => {
    const { isMobile } = useWindowSize();
    const t = useTranslations();

    const chainData = useSelector((state: RootState) => state.chainData);

    const { address } = useAccount();
    const router = useRouter();
    const {
        notificationState,
        getAllNotificationAction,
        markOneNotificationAction,
        markAllNotificationAction,
        resetStatusGetAllNotificationAction,
        resetStatusMarkOneNotificationAction,
        resetStatusMarkAllNotificationAction
    } = useNotification();

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (address) {
                getAllNotificationAction({
                    address: address,
                    chainId: chainData.chainData.chainId.toString()
                });
            }
        }, 4000);
        return () => clearInterval(intervalId);
    }, [address, chainData.chainData.chainId]);

    useEffect(() => {
        (async () => {
            if (
                notificationState.statusGetAllNotification ===
                    EActionStatus.Succeeded &&
                notificationState.notifications
            ) {
                resetStatusGetAllNotificationAction();
            }
        })();
    }, [notificationState.statusGetAllNotification]);

    useEffect(() => {
        (async () => {
            if (
                notificationState.statusMarkOneNotification ===
                    EActionStatus.Succeeded &&
                notificationState.notifications
            ) {
                resetStatusMarkOneNotificationAction();
            }
        })();
    }, [notificationState.statusMarkOneNotification]);

    useEffect(() => {
        (async () => {
            if (
                notificationState.statusMarkAllNotification ===
                    EActionStatus.Succeeded &&
                notificationState.notifications
            ) {
                resetStatusMarkAllNotificationAction();
            }
        })();
    }, [notificationState.statusMarkAllNotification]);

    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const markAsRead = (id: number, poolAddress: string) => {
        markOneNotificationAction({
            chainId: chainData.chainData.chainId.toString(),
            notificationId: id
        });
        router.push(
            `/${chainData.chainData.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${poolAddress}`
        );
    };

    const markAllAsRead = async () => {
        markAllNotificationAction({
            address: address as `0x${string}`,
            chainId: chainData.chainData.chainId.toString()
        });
    };

    return (
        <div
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative cursor-pointer">
                <Bell
                    size={29}
                    strokeWidth={2.5}
                    className={`text-yellow-500 transition-colors hover:text-yellow-400 ${
                        notificationState.notifications &&
                        notificationState.notifications.length > 0
                            ? 'animate-swing'
                            : ''
                    }`}
                />
                {notificationState.notifications &&
                    notificationState.notifications.length > 0 && (
                        <div className="absolute right-0 top-0 rounded-full bg-red-500 px-1 text-xs text-white">
                            {notificationState.notifications.length}
                        </div>
                    )}
            </div>

            {isHovered && (
                <div className="absolute left-4 top-8 z-50">
                    <div className="absolute -top-2 left-0 right-0 h-4 cursor-pointer bg-transparent"></div>
                    <div
                        className={`max-h-64 ${
                            isMobile ? 'min-w-[200px]' : 'min-w-[350px]'
                        } overflow-auto rounded-lg bg-white p-4 shadow-lg`}
                    >
                        <div className="relative">
                            <h4 className="font-bold">{t('NOTIFICATION')}</h4>
                            <ul className="space-y-2">
                                {notificationState.notifications &&
                                    notificationState.notifications.length >
                                        0 &&
                                    notificationState?.notifications?.map(
                                        (notif) => (
                                            <li
                                                key={notif.id}
                                                onClick={() =>
                                                    markAsRead(
                                                        notif.id,
                                                        notif.rocket.address
                                                    )
                                                }
                                                className={`cursor-pointer rounded p-2 ${
                                                    notif.status ===
                                                    NOTIFICATION_STATUS.READ
                                                        ? 'bg-gray-200'
                                                        : 'bg-white'
                                                } border border-gray-600 hover:bg-gray-100`}
                                            >
                                                {notif.content}
                                            </li>
                                        )
                                    )}
                            </ul>
                            <button
                                onClick={markAllAsRead}
                                className={`mt-4 w-full rounded bg-blue-500 py-2 text-center text-white transition ${notificationState?.notifications?.length > 0 ? 'cursor-pointer hover:bg-blue-400' : ''}`}
                                disabled={
                                    !notificationState?.notifications ||
                                    notificationState?.notifications?.length ===
                                        0
                                }
                            >
                                {t('MARK_ALL_AS_READ')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationButton;
