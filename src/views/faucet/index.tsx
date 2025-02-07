/* eslint-disable */
'use client';

import BoxArea from '@/src/components/common/box-area';
import useWindowSize from '@/src/hooks/useWindowSize';
import { Col, Row } from 'antd';
import FaucetInformation from './faucet-information';
import ImageFaucet from './image-faucet';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import NotFoundPage from '@/src/components/errors/not-found';
import { useEffect, useState } from 'react';
import Loader from '@/src/components/common/loader';

const Faucet = () => {
    const { isMobile } = useWindowSize();
    const { chainData } = useCurrentChainInformation();
    const [loading, setLoading] = useState(true);
    const [onFaucet, setOnFaucet] = useState(false);

    useEffect(() => {
        setOnFaucet(chainData.onFaucet);
        setLoading(false);
    }, [chainData.onFaucet]);

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
                            <ImageFaucet />
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
        </BoxArea>
    ) : (
        <NotFoundPage />
    );
};

export default Faucet;
