/* eslint-disable */
import { useNotification } from '@/src/hooks/use-notification';
import useWindowSize from '@/src/hooks/useWindowSize';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { ILoginRequest } from '@/src/stores/auth/type';
import { EActionStatus } from '@/src/stores/type';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import TelegramLoginButton from '../common/telegram';
import TelegramInfo from '../telegram-info';
import ConnectButtonWagmi from './connect-button-wagmi';
import useCurrentHostNameInformation from '@/src/hooks/useCurrentHostName';
import {
    NEXT_PUBLIC_DOMAIN_BARTIO_STG,
    NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD,
    NEXT_PUBLIC_DOMAIN_MULTIPLE_STG
} from '@/src/common/web3/constants/env';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
const { Text } = Typography;
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

    const currentHostName = useCurrentHostNameInformation();
    let botName = '';
    switch (currentHostName.url) {
        case NEXT_PUBLIC_DOMAIN_BARTIO_STG:
            botName = 'MotherOfTokensStgBot';
            break;
        case NEXT_PUBLIC_DOMAIN_MULTIPLE_STG:
            botName = 'MotherOfTokensDevBot';
            break;
        case NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD:
            botName = 'motheroftokens_bot';
            break;
    }

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
                // console.log('========before request auth tele: ', bodyAuthTele);
                loginAction(bodyAuthTele);
            } catch (error) {
                console.log('========= verify auth tele error: ', error);
            }
        }
    };

    useEffect(() => {
        if (!(address as `0x${string}`)) {
            disconnect();
            logoutWalletAction();
        }
    }, [address]);

    useEffect(() => {
        // eslint-disable-next-line
        (async () => {
            if (
                authState.statusLoginWallet === EActionStatus.Succeeded &&
                authState.userWallet
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
                // logoutAction();
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
                authState.statusLoginTele == EActionStatus.Succeeded &&
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
        // eslint-disable-next-line
    }, [authState.statusLoginWallet, authState.statusLoginTele]);

    return (
        <div
            className={`flex w-full items-center justify-between  ${isMobile ? 'text-sm' : 'text-base'}`}
        >
            {contextHolder}
            <ConnectButtonWagmi />
            {!authState.userTele ? (
                <TelegramLoginButton
                    botName={botName}
                    onAuth={handleLoginWithTelegram}
                />
            ) : (
                <TelegramInfo
                    name={authState.userTele.auth.username}
                    // avatar="/images/default-avatar.png"
                />
            )}
        </div>
    );
};

export default ButtonConnectWallet;
