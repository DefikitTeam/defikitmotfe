/* eslint-disable */
import { useNotification } from '@/src/hooks/use-notification';
import useWindowSize from '@/src/hooks/useWindowSize';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { ILoginRequest } from '@/src/stores/auth/type';
import { EActionStatus } from '@/src/stores/type';
import { Dropdown } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import TelegramLoginButton from '../common/telegram';
import TelegramInfo from '../telegram-info';
import XLoginButton from '../XLoginButton';
import ConnectButtonWagmi from './connect-button-wagmi';

import { UserOutlined } from '@ant-design/icons';
import DiscordLoginButton from '../discord-login-button';
import {
  useTrustPoint,
  useTrustPointToken
} from '@/src/stores/trust-point/hook';
import RankBadge from '@/src/components/common/rank-badge';
import axios from 'axios';
import serviceWallet from '@/src/services/external-services/backend-server/wallet';
import { useConfig } from '@/src/hooks/useConfig';
import { useTrustScoreHistoryWallet } from '@/src/stores/wallet/hook';

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
    resetStatusLoginWalletAction,
    resetStatusLoginDiscordAction,
    resetStatusLoginTwitterAction,
    logoutDiscordAction,
    logoutTwitterAction
  } = useAuthLogin();

  const {
    trustScoreHistoryWalletState,
    getTrustScoreHistoryWalletAction,
    setOpenModalHistoryWalletAction,
    resetTrustScoreHistoryWalletAction
  } = useTrustScoreHistoryWallet();

  const { getTrustPointStatusAction, trustPointStatus } = useTrustPoint();
  const { getTrustPointTokenAction, trustPointToken } = useTrustPointToken();
  let botName = 'motheroftokens_bot';

  const [walletRank, setWalletRank] = useState<{
    rank: number;
    total: number;
    trustScore: string;
  } | null>(null);

  const { chainConfig } = useConfig();

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
      logoutTelegramAction();
      logoutDiscordAction();
      logoutTwitterAction();
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      if (authState.statusLoginWallet === EActionStatus.Succeeded) {
        if (authState.userWallet?.address === address) {
          resetStatusLoginWalletAction();
          setTimeout(() => {
            getTrustPointStatusAction();
            // getTrustPointTokenAction();
          }, 500);
        }
      } else if (authState.statusLoginWallet === EActionStatus.Failed) {
        if (authState.errorMessage) {
          resetStatusLoginWalletAction();
          await openNotification({
            message: authState.errorMessage,
            placement: 'topRight',
            type: 'error'
          });
        }
      }
    })();
  }, [
    authState.statusLoginWallet,
    authState.userWallet,
    address,
    authState.errorMessage
  ]);

  useEffect(() => {
    (async () => {
      if (authState.statusLoginTele === EActionStatus.Succeeded) {
        if (authState.userTele) {
          resetStatusLoginTeleAction();
          // await openNotification({
          //     message: t('LOGIN_TELE_SUCCESSFULLY'),
          //     placement: 'topRight',
          //     type: 'success'
          // });
        }
      } else if (authState.statusLoginTele === EActionStatus.Failed) {
        if (authState.errorMessage) {
          await openNotification({
            message: authState.errorMessage,
            placement: 'topRight',
            type: 'error'
          });
        }
        logoutTelegramAction();
      }
    })();
  }, [authState.statusLoginTele, authState.userTele, authState.errorMessage]);

  useEffect(() => {
    (async () => {
      if (authState.statusLoginDiscord === EActionStatus.Succeeded) {
        if (authState.userDiscord) {
          resetStatusLoginDiscordAction();
          setTimeout(() => {
            getTrustPointStatusAction();
            // getTrustPointTokenAction();
          }, 500);

          // await openNotification({
          //     message: t('LOGIN_DISCORD_SUCCESSFULLY'),
          //     placement: 'topRight',
          //     type: 'success'
          // });
        }
      } else if (authState.statusLoginDiscord === EActionStatus.Failed) {
        if (authState.errorMessage) {
          await openNotification({
            message: authState.errorMessage,
            placement: 'topRight',
            type: 'error'
          });
        }
        logoutDiscordAction();
      }
    })();
  }, [
    authState.statusLoginDiscord,
    authState.userDiscord,
    authState.errorMessage
  ]);

  useEffect(() => {
    (async () => {
      if (authState.statusLoginTwitter === EActionStatus.Succeeded) {
        if (authState.userTwitter) {
          resetStatusLoginTwitterAction();
          setTimeout(() => {
            getTrustPointStatusAction();
            // getTrustPointTokenAction();
          }, 500);
          // await openNotification({
          //     message: t('LOGIN_TWITTER_SUCCESSFULLY'),
          //     placement: 'topRight',
          //     type: 'success'
          // });
        }
      } else if (authState.statusLoginTwitter === EActionStatus.Failed) {
        if (authState.errorMessage) {
          await openNotification({
            message: authState.errorMessage,
            placement: 'topRight',
            type: 'error'
          });
        }
        logoutTwitterAction();
      }
    })();
  }, [
    authState.statusLoginTwitter,
    authState.userTwitter,
    authState.errorMessage
  ]);

  useEffect(() => {
    // Fetch wallet rank
    const fetchWalletRank = async () => {
      if (!address) {
        setWalletRank(null);
        return;
      }
      try {
        const res = await serviceWallet.getRankWallet(
          chainConfig?.chainId.toString()!,
          address
        );
        setWalletRank({
          rank: res.rank,
          total: res.totalUser,
          trustScore: res.trustScore
        });
      } catch (e) {
        setWalletRank(null);
      }
    };
    fetchWalletRank();
  }, [address, chainConfig?.chainId]);

  const socialItems = [
    {
      key: 'twitter',
      label: <XLoginButton />
    },
    {
      key: 'discord',
      label: <DiscordLoginButton />
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
    <div className="flex h-12 w-full items-center justify-between gap-2">
      {contextHolder}

      <div className="flex-shrink-0">
        {!authState.openModalInviteBlocker && <ConnectButtonWagmi />}
      </div>

      {walletRank && address && (
        <div className="mt-1 w-full sm:mt-0 sm:w-auto">
          <RankBadge
            rank={walletRank.rank}
            total={walletRank.total}
            trustScore={walletRank.trustScore}
            type="wallet"
            isHeader={true}
          />
        </div>
      )}

      {authState.userInfo?.connectedWallet && (
        <div className={`${!isMobile ? 'flex-shrink-0' : ''}`}>
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
            <button
              className={`
    hover:border-primary-500 hover:text-primary-500 flex h-10 items-center gap-2 rounded-lg 
    border border-gray-200 bg-white px-4 py-2
    transition-all duration-200
    hover:shadow-sm sm:h-12
  `}
            >
              <UserOutlined className="text-lg" />
              <span
                className={`${isMobile ? 'text-sm' : 'text-base'} !font-forza`}
              >
                Social Login
              </span>
            </button>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default ButtonConnectWallet;
