/* eslint-disable */

import { useAuthLogin } from '@/src/stores/auth/hook';
import { CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Col, Input, notification, Row, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    XIcon
} from 'react-share';
import { useAccount } from 'wagmi';

const ShareSocialAffiliate = () => {
    const t = useTranslations();

    const { authState } = useAuthLogin();
    const [affiliate, setAffiliate] = useState('');

    useEffect(() => {
        if (authState.userInfo?.refId) {
            const url = new URL(window.location.href);
            const searchParams = new URLSearchParams(url.search);

            if (searchParams.has('refId')) {
                searchParams.set('refId', authState.userInfo.refId);
            } else {
                searchParams.append('refId', authState.userInfo.refId);
            }

            const newUrl = `${url.origin}${url.pathname}?${searchParams.toString()}`;
            window.history.replaceState({}, '', newUrl);

            // Cập nhật giá trị của affiliate với URL mới bao gồm cả domain
            setAffiliate(newUrl);
        } else {
            setAffiliate(window.location.href);
        }
    }, [authState.userInfo?.refId]);

    const { isConnected, address } = useAccount();
    const handleCopy = (tokenAddress: string | undefined) => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        if (tokenAddress) {
            navigator.clipboard.writeText(tokenAddress).then(() => {
                notification.success({
                    message: t('AFFILIATE_COPIED_TO_CLIPBOARD'),
                    placement: 'top',
                    duration: 1.2,
                    showProgress: true
                });
            });
        }
    };

    const handleShare = async () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    // title: 'kienkien',
                    // text: 'Check out this awesome website!',
                    url: affiliate
                });
            } catch (error) {
                console.log('Sharing failed', error);
            }
        } else {
            alert('Your browser does not support the share feature.');
        }
    };

    return (
        <div className="flex flex-col gap-1 ">
            <Row gutter={[1, 5]}>
                <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    className="font-forza"
                >
                    <div>
                        {t('SHARE_SOCIAL_MEDIA_AFFILIATE')}{' '}
                        <Tooltip
                            title={t('BENEFIT_TOOLTIP_SHARE_LINK_AFFILIATE')}
                        >
                            <QuestionCircleOutlined
                                style={{ marginLeft: '0px' }}
                            />
                            <span className="text-lg text-red-500">* </span>
                        </Tooltip>
                    </div>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                >
                    <div className="flex h-full items-center space-x-4">
                        <Tooltip title="Share on Facebook">
                            <span>
                                <FacebookShareButton
                                    url={affiliate}
                                    // title={t('TITLE_SHARE_TELEGRAM_AFFILIATE')}
                                >
                                    <FacebookIcon
                                        size={30}
                                        round
                                    />
                                </FacebookShareButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Share on X">
                            <span>
                                <TwitterShareButton
                                    url={affiliate}
                                    // title="kienkien"
                                    title={t('TITLE_SHARE_TELEGRAM_AFFILIATE')}
                                >
                                    <XIcon
                                        size={30}
                                        round
                                    />
                                </TwitterShareButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Share on Telegram">
                            <span>
                                <TelegramShareButton
                                    url={affiliate}
                                    title={t('TITLE_SHARE_TELEGRAM_AFFILIATE')}
                                >
                                    <TelegramIcon
                                        size={30}
                                        round
                                    />
                                </TelegramShareButton>
                            </span>
                        </Tooltip>

                        <Tooltip title="Share">
                            <div
                                onClick={handleShare}
                                className="cursor-pointer  hover:text-blue-600"
                            >
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="29"
                                    width="29"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="128"
                                        cy="256"
                                        r="48"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="30"
                                    ></circle>
                                    <circle
                                        cx="384"
                                        cy="112"
                                        r="48"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="30"
                                    ></circle>
                                    <circle
                                        cx="384"
                                        cy="400"
                                        r="48"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="30"
                                    ></circle>
                                    <path
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="30"
                                        d="M169.83 279.53l172.34 96.94m0-240.94l-172.34 96.94"
                                    ></path>
                                </svg>
                            </div>
                        </Tooltip>
                    </div>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    // className="font-forza"
                >
                    <div>
                        <Input
                            size="middle"
                            value={affiliate}
                            className="!font-forza "
                            style={{ paddingRight: 0 }}
                            suffix={
                                <Tooltip
                                    title={t('AFFILIATE_COPIED_TO_CLIPBOARD')}
                                    className=""
                                >
                                    <CopyOutlined
                                        className="text-lg"
                                        style={{}}
                                        onClick={() =>
                                            handleCopy(affiliate as string)
                                        }
                                    />
                                </Tooltip>
                            }
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ShareSocialAffiliate;
