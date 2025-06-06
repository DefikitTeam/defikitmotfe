/* eslint-disable */
'use client';
import { chains } from '@/src/common/constant/constance';
import BoxArea from '@/src/components/common/box-area';
import Loader from '@/src/components/loader';
import { useConfig } from '@/src/hooks/useConfig';
import { IChainInfor } from '@/src/hooks/useCurrentChainInformation';
import useRefCodeWatcher from '@/src/hooks/useRefCodeWatcher';
import useWindowSize from '@/src/hooks/useWindowSize';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { setChainData } from '@/src/stores/Chain/chainDataSlice';
import { useInviteListReferPortfolio } from '@/src/stores/invite-code/hook';
import { usePortfolio } from '@/src/stores/profile/hook';
import { EActionStatus } from '@/src/stores/type';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import SellToken from './sell-token';
import Statistical from './statistical';
import TaskList from './task-list';

const Portfolio = () => {
  const { isMobile } = useWindowSize();
  const t = useTranslations();
  const { disconnect } = useDisconnect();
  const { address, chainId } = useAccount();

  const [
    { portfolio },
    fetchPortfolio,
    setIdCurrentChoosedTokenSell,
    fetchYourListFriendAction
  ] = usePortfolio();
  const {
    createdPools,
    createdTokens,
    investedPools,
    priceNative,
    totalInvestedETH,
    status
  } = portfolio;

  const [
    { inviteListRefer },
    fetchInviteListRefer,
    setOpenModalInviteListReferAction
  ] = useInviteListReferPortfolio();

  const params = useParams();
  const addressParams = params?.walletAddress as string;
  const isAddressDifferent =
    addressParams && addressParams.toLowerCase() !== address?.toLowerCase();
  let walletAddress;
  const pathname = usePathname();
  const dispatch = useDispatch();
  const currentPath = pathname?.split('/');
  const { switchChain } = useSwitchChain();
  const { authState, setOpenModalInviteBlocker } = useAuthLogin();

  const { chainConfig } = useConfig();

  const getCurrentChainUrl = (): IChainInfor | undefined => {
    return chains.find(
      (item) => item.name.replace(/\s+/g, '').toLowerCase() === currentPath?.[2]
    );
  };

  useEffect(() => {
    if (window.AIChatWidget) {
      window.AIChatWidget.destroy?.();
    }
    document
      .querySelectorAll('#ai-chat-widget-container')
      .forEach((e) => e.remove());
    document
      .querySelectorAll('[data-ai-chat-widget]')
      .forEach((e) => e.remove());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const chainInfo = getCurrentChainUrl();
    if (chainInfo) {
      dispatch(setChainData(chainInfo));
      switchChain({ chainId: chainInfo.chainId });
      // router.push(`${currentPath?.join('/')}?refId=${refId}`);
    }
  }, [currentPath?.[2]]);

  useEffect(() => {
    if (addressParams) {
      walletAddress = addressParams;
    } else {
      walletAddress = address;
    }
    if (walletAddress) {
      fetchPortfolio({
        chainId: Number(chainConfig?.chainId!),
        wallet: walletAddress as `0x${string}`
      });
      fetchYourListFriendAction({
        wallet: walletAddress as `0x${string}`
      });

      if (!isAddressDifferent) {
        fetchInviteListRefer({
          page: inviteListRefer.page,
          limit: inviteListRefer.limit
        });
      }
    }
  }, [address, addressParams, walletAddress, chainId, fetchPortfolio]);

  if (
    // !investedPools ||
    status === EActionStatus.Pending
  ) {
    return <Loader />;
  }

  return (
    <BoxArea>
      <div className={`!pt-[30px] ${isMobile ? '' : 'px-5'}`}>
        <div className="py-2">
          <Row gutter={[16, 16]}>
            <Col
              span={isAddressDifferent ? 24 : 16}
              xs={24}
              sm={isAddressDifferent ? 24 : 16}
              lg={isAddressDifferent ? 24 : 16}
              md={isAddressDifferent ? 24 : 16}
              xl={isAddressDifferent ? 24 : 16}
            >
              <div className=" overflow-y-auto overflow-x-hidden px-2">
                <Statistical />
              </div>
            </Col>
            {!isAddressDifferent && (
              <Col
                span={8}
                xs={24}
                sm={8}
                lg={8}
                md={8}
                xl={8}
              >
                {isMobile ? (
                  <>
                    <SellToken />
                    <TaskList />
                  </>
                ) : (
                  <>
                    <SellToken />
                    <TaskList />
                  </>
                )}
              </Col>
            )}
          </Row>
        </div>
      </div>

      {/* <ModalInviteBlocker /> */}
    </BoxArea>
  );
};

export default Portfolio;
