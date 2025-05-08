'use client';
/* eslint-disable */
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import useWindowSize from '../hooks/useWindowSize';
import { useAuthLogin } from '../stores/auth/hook';

const { Text } = Typography;
const TelegramInfo = ({ name }: { name: string }) => {
    const t = useTranslations();
    const { isMobile } = useWindowSize();
    const { authState, logoutTelegramAction } = useAuthLogin();
    const handleClickLogoutTelegram = () => {
        logoutTelegramAction();
    };

    let botName = '';
    // switch (environment) {
    //     case 'staging':
    botName = 'motheroftokens_bot';
    //         break;
    //     case 'development':
    //         botName = 'MotherOfTokensDevBot';
    //         break;
    //     case 'production':
    //         botName = 'motheroftokens_bot';
    //         break;
    // }

    const items: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <Link
                    className="py-[5px] font-forza  text-sm  leading-[22px]"
                    rel="noopener noreferrer"
                    href={`https://t.me/${botName}`}
                    target="_blank"
                >
                    {t('CHAT_BOT')}
                </Link>
            )
        },
        {
            key: '1',
            label: (
                <div
                    className="py-[2px] font-forza text-sm text-red-600"
                    onClick={async () => {
                        handleClickLogoutTelegram();
                        await new Promise((resolve) =>
                            setTimeout(resolve, 500)
                        );
                    }}
                >
                    {t('LOGOUT')}
                </div>
            )
        }
    ];

    return (
        <Dropdown
            arrow={true}
            menu={{ items }}
            placement="bottomLeft"
            overlayStyle={{ borderRadius: '2px' }}
            className="cursor-pointer"
            trigger={['hover']}
        >
            <div
                className={`flex items-center gap-[2px]  rounded-xl bg-[#54A8EA]  px-1 py-[3px] !font-forza  ${isMobile ? 'text-sm' : ''} text-base text-white hover:opacity-85 
             `}
            >
                <div
                    className={`flex items-center gap-[2px]  ${isMobile ? 'px-2 py-[5px]' : ''}`}
                >
                    {authState.userTele?.auth?.photo_url && !isMobile ? (
                        <Image
                            loader={() => authState.userTele?.auth?.photo_url}
                            src={authState.userTele?.auth?.photo_url}
                            alt={'avatar-telegram'}
                            width={12}
                            height={12}
                            className={`${isMobile ? 'h-[20px] w-[20px]' : ''}h-[32px] w-[32px] rounded-full`}
                        />
                    ) : null}
                    <Text
                        className={`font-forza text-base leading-[22px] text-white`}
                    >
                        {name}
                    </Text>
                </div>
                <DownOutlined className="h-[10px] w-[10px] text-4xl font-extrabold text-white" />
            </div>
        </Dropdown>
    );
};

export default TelegramInfo;
