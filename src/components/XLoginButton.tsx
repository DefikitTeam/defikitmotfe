/* eslint-disable */
'use client';

import { useAuthTwitterLogin } from '@/src/stores/Twitter/hook';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import Image from 'next/image';
import { FC, useEffect } from 'react';
import { REFCODE_INFO_STORAGE_KEY } from '../services/external-services/backend-server/auth';
import { useAuthLogin } from '../stores/auth/hook';
import { ILoginRequest } from '../stores/auth/type';

export const XLoginButton: FC = () => {
    const {
        isLoading,
        error,
        twitterUser,
        handleTwitterCallback,
        handleTwitterLogin,
        handleLogout
    } = useAuthTwitterLogin();

    const {
        authState,
        loginAction,
        logoutTwitterAction,
        resetStatusLoginTwitterAction
    } = useAuthLogin();

    useEffect(() => {
        if (twitterUser && authState.userWallet && !authState.userTwitter) {
            // Get the shared wallet data if available
            const refCode = localStorage
                .getItem(REFCODE_INFO_STORAGE_KEY)
                ?.replace(/"/g, '');
            const loginTwitterData: ILoginRequest = {
                wallet: authState.userWallet!,
                twitter: {
                    twitterId: twitterUser.twitterId,
                    twitterUsername: twitterUser.twitterUsername,
                    twitterName: twitterUser.twitterName,
                    twitterProfileImage: twitterUser.twitterProfileImage
                },
                referralCode: refCode ? refCode : ''
            };

            // Use the login action to submit the data
            loginAction(loginTwitterData);
        }
    }, [twitterUser, authState.userWallet, authState.userTwitter]);

    // Listen for messages from popup
    useEffect(() => {
        window.addEventListener('message', handleTwitterCallback);
        return () =>
            window.removeEventListener('message', handleTwitterCallback);
    }, [handleTwitterCallback]);

    const handleClickLogoutTwitter = () => {
        logoutTwitterAction();
        // resetStatusLoginTwitterAction();
        handleLogout();
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-3 py-2">
                <Spin size="small" />
                <span className="text-gray-600">Connecting...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-1 p-2">
                <div className="text-xs text-red-500">{error}</div>
                <Button
                    onClick={handleTwitterLogin}
                    type="text"
                    size="small"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
                >
                    <Image
                        src="/icon/x-logo.png"
                        alt="X Logo"
                        width={16}
                        height={16}
                    />
                    Try Again
                </Button>
            </div>
        );
    }

    if (twitterUser && authState.userWallet && authState.userTwitter) {
        return (
            <div className="group relative w-full">
                <div className="flex w-full items-center justify-between rounded-lg p-2 transition-all duration-200 hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                        <img
                            src={twitterUser.twitterProfileImage}
                            alt={twitterUser.twitterName}
                            className="h-6 w-6 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {twitterUser.twitterName}
                            </span>
                            <span className="text-xs text-gray-500">
                                @{twitterUser.twitterUsername}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleClickLogoutTwitter}
                        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogoutOutlined className="text-xs" />
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleTwitterLogin}
            className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-blue-500"
        >
            <Image
                src="/icon/x-logo.png"
                alt="X Logo"
                width={16}
                height={16}
            />
            <span className="!font-forza text-sm">Login with X</span>
        </button>
    );
};

export default XLoginButton;
