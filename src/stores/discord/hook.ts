import { useCallback, useEffect } from 'react';
import { useRef } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import { DiscordUser } from './type';
import { setDiscordUser, setLoading, setError, logout } from './userSlice';
import { NEXT_PUBLIC_API_ENDPOINT } from '@/src/common/web3/constants/env';

type AuthDiscordLoginType = {
    isLoading: boolean;
    error: string | null;
    discordUser: DiscordUser | null;
    handleDiscordCallback: (event: MessageEvent) => void;
    handleDiscordLogin: () => void;
    handleLogout: () => void;
};

export const useAuthDiscordLogin = (): AuthDiscordLoginType => {
    const dispatch = useAppDispatch();
    const discordUser = useAppSelector(
        (state: RootState) => state.discordUser.discord
    );
    const isLoading = useAppSelector(
        (state: RootState) => state.discordUser.isLoading
    );
    const error = useAppSelector((state: RootState) => state.discordUser.error);

    const popupRef = useRef<Window | null>(null);
    const checkPopupInterval = useRef<NodeJS.Timeout | null>(null);
    const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup function
    const cleanupPopup = useCallback(() => {
        if (checkPopupInterval.current) {
            clearInterval(checkPopupInterval.current);
            checkPopupInterval.current = null;
        }

        if (popupTimeoutRef.current) {
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = null;
        }

        // Chỉ đóng popup nếu nó thực sự tồn tại và đang mở
        if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.close();
        }
        popupRef.current = null;

        dispatch(setLoading(false));
    }, [dispatch]);

    const handleDiscordCallback = useCallback(
        (event: MessageEvent) => {
            // Chấp nhận message từ cả API endpoint
            if (
                event.origin === NEXT_PUBLIC_API_ENDPOINT ||
                event.origin === 'http://localhost:4000'
            ) {
                const data = event.data;

                if (data.success && data.discord) {
                    dispatch(setDiscordUser(data.discord));
                    dispatch(setLoading(false));
                } else if (data.error) {
                    dispatch(setError(data.error));
                    dispatch(setLoading(false));
                }
            } else {
                console.warn(
                    'Received message from unexpected origin:',
                    event.origin
                );
            }
        },
        [dispatch]
    );

    useEffect(() => {
        window.addEventListener('message', handleDiscordCallback);
        return () => {
            window.removeEventListener('message', handleDiscordCallback);
            cleanupPopup();
        };
    }, [handleDiscordCallback, cleanupPopup]);

    const handleDiscordLogin = useCallback(() => {
        try {
            // Nếu đã có popup đang mở, focus vào nó
            if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.focus();
                return;
            }

            // Reset states
            dispatch(setLoading(true));
            dispatch(setError(''));

            // Cấu hình popup
            const width = 700;
            const height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            // Mở popup
            const popup = window.open(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/discord/url`,
                'Discord Login',
                `width=${width},height=${height},left=${left},top=${top},popup=true,scrollbars=yes`
            );

            // Check if popup was blocked
            if (!popup || popup.closed) {
                throw new Error(
                    'Popup was blocked. Please enable popups for this site.'
                );
            }

            popupRef.current = popup;

            // Check popup status ngay lập tức và sau đó mỗi 1 giây
            const checkPopup = () => {
                if (!popup || popup.closed) {
                    console.log('Popup was closed');
                    cleanupPopup();
                }
            };

            // Check ngay lập tức
            checkPopup();

            // Sau đó check mỗi 1 giây
            checkPopupInterval.current = setInterval(checkPopup, 1000);

            // Safety timeout - 5 phút
            popupTimeoutRef.current = setTimeout(
                () => {
                    console.log('Login timeout reached');
                    dispatch(setError('Login timeout. Please try again.'));
                    cleanupPopup();
                },
                5 * 60 * 1000
            );
        } catch (error) {
            console.error('Login error:', error);
            dispatch(
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to open login window'
                )
            );
            cleanupPopup();
        }
    }, [dispatch, cleanupPopup]);
    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return {
        isLoading,
        error,
        discordUser,
        handleDiscordCallback,
        handleDiscordLogin,
        handleLogout
    };
};
