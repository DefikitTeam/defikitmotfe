/* eslint-disable */
import { useNotification } from '@/src/hooks/use-notification';
import useWindowSize from '@/src/hooks/useWindowSize';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { ILoginRequest } from '@/src/stores/auth/type';
import { EActionStatus } from '@/src/stores/type';
import { Button, Dropdown } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import TelegramLoginButton from '../common/telegram';
import TelegramInfo from '../telegram-info';
import XLoginButton from '../XLoginButton';
import ConnectButtonWagmi from './connect-button-wagmi';

import { UserOutlined } from '@ant-design/icons';

const ButtonConnectWallet = () => {
    const t = useTranslations();
    const { openNotification, contextHolder } = useNotification();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { isMobile } = useWindowSize();

    const {
        authState,
        loginAction,
        logoutTelegramAction,
        logoutWalletAction,
        resetStatusLoginTeleAction,
        resetStatusLoginWalletAction
    } = useAuthLogin();

    let botName = 'MotherOfTokensMonadBot';

    const handleLoginWithTelegram = async (user: any) => {
        if (user) {
            const refCode = localStorage.getItem(REFCODE_INFO_STORAGE_KEY);
            const bodyAuthTele: ILoginRequest = {
                tele: {
                    botName: botName,
                    auth: user
                },
                referralCode: refCode ? refCode : ''
            };
            try {
                loginAction(bodyAuthTele);
            } catch (error) {
                console.log('verify auth tele error: ', error);
            }
        }
    };

    useEffect(() => {
        if (!(address as `0x${string}`)) {
            if (isMobile) return;
            disconnect();
            logoutWalletAction();
        }
    }, [address]);

    useEffect(() => {
        (async () => {
            if (
                authState.statusLoginWallet === EActionStatus.Succeeded &&
                authState.userWallet?.address === address
            ) {
                await openNotification({
                    message: t('LOGIN_WALLET_SUCCESSFULLY'),
                    placement: 'topRight',
                    type: 'success'
                });
                await new Promise((resolve) => setTimeout(resolve, 1000));
                resetStatusLoginWalletAction();
            }

            if (authState.statusLoginWallet === EActionStatus.Failed) {
                if (authState.errorMessage) {
                    await openNotification({
                        message: authState.errorMessage,
                        placement: 'topRight',
                        type: 'error'
                    });
                }
                disconnect();
                logoutWalletAction();
            }

            if (authState.statusLoginTele === EActionStatus.Failed) {
                if (authState.errorMessage) {
                    await openNotification({
                        message: authState.errorMessage,
                        placement: 'topRight',
                        type: 'error'
                    });
                }
                logoutTelegramAction();
            }
            if (
                authState.statusLoginTele === EActionStatus.Succeeded &&
                authState.userTele
            ) {
                await openNotification({
                    message: t('LOGIN_TELE_SUCCESSFULLY'),
                    placement: 'topRight',
                    type: 'success'
                });
                await new Promise((resolve) => setTimeout(resolve, 1000));
                resetStatusLoginTeleAction();
            }
        })();
    }, [authState.statusLoginWallet, authState.statusLoginTele]);

    const socialItems = [
        {
            key: 'twitter',
            label: <XLoginButton />
        },
        {
            key: 'telegram',
            label: !authState.userTele ? (
                <TelegramLoginButton
                    botName={botName}
                    onAuth={handleLoginWithTelegram}
                />
            ) : (
                <TelegramInfo name={authState.userTele.auth.username} />
            )
        }
    ];

    const dropdownRender = (menu: React.ReactNode) => (
        <div className="min-w-[280px] origin-top transform overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg transition-all duration-200">
            <div className="border-b border-gray-100 bg-gray-50 p-3">
                <span className="!font-forza text-sm text-gray-700">
                    Choose Login Method
                </span>
            </div>
            <div className="p-1">{menu}</div>
        </div>
    );

    return (
        <div className="flex w-full items-center justify-between gap-4">
            {contextHolder}

            {/* Wallet button on the left */}
            <div className="flex-shrink-0">
                {!authState.openModalInviteBlocker && <ConnectButtonWagmi />}
            </div>

            {/* Social login dropdown on the right */}
            <div className="flex-shrink-0">
                <Dropdown
                    menu={{ items: socialItems }}
                    trigger={['hover']}
                    placement="bottomRight"
                    dropdownRender={dropdownRender}
                    overlayStyle={{
                        animationDuration: '0.2s',
                        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <button className="hover:border-primary-500 hover:text-primary-500 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all duration-200 hover:shadow-sm">
                        <UserOutlined className="text-lg" />
                        <span
                            className={`${isMobile ? 'text-sm' : 'text-base'} !font-forza`}
                        >
                            Social Login
                        </span>
                    </button>
                </Dropdown>
            </div>
        </div>
    );
};

export default ButtonConnectWallet;
