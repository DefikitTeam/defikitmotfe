/* eslint-disable */
'use client';

import { chains } from '@/src/common/constant/constance';
import BoxArea from '@/src/components/common/box-area';
import Loader from '@/src/components/common/loader';
import NotFoundPage from '@/src/components/errors/not-found';
import { useConfig } from '@/src/hooks/useConfig';
import { IChainInfor } from '@/src/hooks/useCurrentChainInformation';
import useWindowSize from '@/src/hooks/useWindowSize';
import { Col, notification, Row } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAccount, useSwitchChain } from 'wagmi';
import FaucetInformation from './faucet-information';

const Faucet = () => {
  const { isMobile } = useWindowSize();
  // const chainData = useSelector((state: RootState) => state.chainData);
  const { chainConfig } = useConfig();

  const [loading, setLoading] = useState(true);
  const [onFaucet, setOnFaucet] = useState(false);

  const pathname = usePathname();
  const dispatch = useDispatch();
  const currentPath = pathname?.split('/');
  const { switchChain } = useSwitchChain();

  // const getCurrentChainUrl = (): IChainInfor | undefined => {
  //   return chains.find(
  //     (item) =>
  //       item.name.replace(/\s+/g, '').toLowerCase() === currentPath?.[2]
  //   );
  // };

  const router = useRouter();

  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      notification.error({
        message: 'Error',
        description: 'Please connect to your wallet',
        duration: 3,
        showProgress: true
      });

      router.push(
        `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}`
      );
      return;
    }
  }, [address]);



  useEffect(() => {
    setOnFaucet(chainConfig?.onFaucet!);
    setLoading(false);
  }, [chainConfig?.onFaucet]);

  return loading ? (
    <Loader />
  ) : onFaucet ? (
    <BoxArea>
      <div className={`!pt-[20px] ${isMobile ? '' : 'px-5'} `}>
        <div className="py-2">
          <Row gutter={[8, 10]}>
            <Col
              xs={1}
              sm={2}
              md={6}
              lg={1}
              xl={1}
              xxl={2}
            ></Col>
            <Col
              xs={22}
              sm={20}
              md={12}
              lg={10}
              xl={10}
              xxl={8}
            >
              <FaucetInformation />
            </Col>
            <Col
              xs={1}
              sm={2}
              md={0}
              lg={1}
              xl={1}
              xxl={2}
            ></Col>
            <Col
              xs={0}
              sm={0}
              md={0}
              lg={3}
              xl={3}
              xxl={3}
            ></Col>

            <Col
              xs={0}
              md={0}
              sm={0}
              lg={6}
              xl={6}
              xxl={6}
            // className="h-full"
            >
              {/* <ImageFaucet /> */}
            </Col>
            <Col
              xs={0}
              sm={0}
              md={0}
              lg={3}
              xl={3}
              xxl={3}
            ></Col>
          </Row>
        </div>
      </div>
      {/* <ModalInviteBlocker /> */}
    </BoxArea>
  ) : (
    <NotFoundPage />
  );
};

export default Faucet;
