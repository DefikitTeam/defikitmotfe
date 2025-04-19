/* eslint-disable */
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { NEXT_PUBLIC_API_ENDPOINT } from '../common/web3/constants/env';
import { REFCODE_INFO_STORAGE_KEY } from '../services/external-services/backend-server/auth';
import { useAuthLogin } from '../stores/auth/hook';
import { ILoginRequest } from '../stores/auth/type';
import { useAuthDiscordLogin } from '../stores/discord/hook';

const DiscordLoginButton = () => {
    const {
        isLoading,
        error,
        discordUser,
        handleDiscordCallback,
        handleDiscordVerify,
        // handleDiscordLogin,
        handleLogout
    } = useAuthDiscordLogin();


    const {
        authState,
        loginAction,
        logoutTelegramAction,
        logoutWalletAction,
        resetStatusLoginTeleAction,
        resetStatusLoginWalletAction,
        logoutDiscordAction,
        resetStatusLoginDiscordAction
    } = useAuthLogin();


    useEffect(() => {
        if (discordUser && authState.userWallet && !authState.userDiscord) {
            // Get the shared wallet data if available
            const refCode = localStorage
                .getItem(REFCODE_INFO_STORAGE_KEY)
                ?.replace(/"/g, '');
            const loginDiscordData: ILoginRequest = {
                wallet: authState.userWallet!,
                discord: {
                    discordId: discordUser.discordId,
                    discordUsername: discordUser.discordUsername,
                    discordEmail: discordUser.discordEmail || null,
                    discordAvatar: discordUser.discordAvatar,
                    verified: discordUser.verified === 'true' ? true : false,
                    globalName: discordUser.globalName || null,
                    locale: discordUser.locale || null
                },
                referralCode: refCode ? refCode : ''
            };

            // Use the login action to submit the data
            loginAction(loginDiscordData);
        }
    }, [discordUser, authState.userWallet, authState.userDiscord]);

    // Listen for messages from popup
    useEffect(() => {
        window.addEventListener('message', handleDiscordCallback);
        return () =>
            window.removeEventListener('message', handleDiscordCallback);
    }, [handleDiscordCallback]);

    useEffect(() => {
        window.addEventListener('message', handleDiscordVerify);
        return () =>
            window.removeEventListener('message', handleDiscordVerify);
    }, [handleDiscordVerify]);


    useEffect(() => {
        console.log('Discord user:', discordUser);
        console.log('Verification status:', discordUser?.verified);
    }, [discordUser?.verified]);



    const handleClickLogoutDiscord = () => {
        logoutDiscordAction();
        // resetStatusLoginDiscordAction();
        handleLogout()
    }
    const handleDiscordLogin = async () => {
        try {
            const response = await axios.get(
                `${NEXT_PUBLIC_API_ENDPOINT}/auth/discord/url`
            );
            const data = response.data;
            // Mở popup window để login
            const popup = window.open(
                data.url,
                'Discord Login',
                'width=600,height=700'
            );
        } catch (error) {
            console.error('Failed to login with Discord:', error);
        }
    };





    const handleVerifyDiscord = async () => {
        try {
            const response = await axios.get(
                `${NEXT_PUBLIC_API_ENDPOINT}/auth/discord/verify/url`
            );
            const data = response.data;
            const popup = window.open(
                data.url,
                'Discord Verify',
                'width=600,height=700'
            );
        } catch (error) {
            console.error('Failed to verify Discord:', error);
        }
    };

    const handleJoinDiscord = () => {
        window.open('https://discord.gg/NJYkdvPZ', '_blank', 'noopener,noreferrer');
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
                    onClick={handleDiscordLogin}
                    type="text"
                    size="small"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
                >
                    <Image
                        src="/icon/discord-logo.png"
                        alt="Discord Logo"
                        width={16}
                        height={16}
                    />
                    Try Again
                </Button>
            </div>
        );
    }
    if (authState.userDiscord && discordUser) {
        // Construct the proper Discord avatar URL
        const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.discordId}/${discordUser.discordAvatar}.png?size=256`;

        return (
            <div className="group relative w-full">
                <div className="flex w-full items-center justify-between rounded-lg p-2 transition-all duration-200 hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                        <img
                            src={avatarUrl}
                            alt={discordUser.discordName}
                            className="h-6 w-6 rounded-full"
                        />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">
                                    {discordUser.globalName ||
                                        discordUser.discordUsername}
                                </span>
                                {discordUser.verified === 'true' && (
                                    <>
                                        <svg
                                            className="h-3.5 w-3.5 text-blue-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                        <Button
                                            onClick={handleJoinDiscord}
                                            type="primary"
                                            size="small"
                                            className="ml-2 flex items-center gap-1 bg-[#5865F2] text-xs hover:bg-[#4752C4]"
                                        >
                                            Join Discord
                                        </Button>
                                    </>
                                )}
                                {discordUser.verified === 'false' && (
                                    <Button
                                        onClick={handleVerifyDiscord}
                                        type="primary"
                                        size="small"
                                        className="ml-2 flex items-center gap-1 bg-blue-500 text-xs hover:bg-blue-600"
                                    >
                                        Verify
                                    </Button>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">
                                @{discordUser.discordUsername}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleClickLogoutDiscord}
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
            onClick={handleDiscordLogin}
            className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-blue-500"
        >
            <Image
                src="/icon/discord-logo.png"
                alt="Discord Logo"
                width={16}
                height={16}
            />
            <span className="!font-forza text-sm">Login with Discord</span>
        </button>
    );
};

export default DiscordLoginButton;
