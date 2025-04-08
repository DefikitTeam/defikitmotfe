/* eslint-disable */

import { notification, Typography } from 'antd';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { shortWalletAddress } from '../common/utils/utils';
import { useConfig } from '../hooks/useConfig';
import { useTopRefByVol } from '../stores/top-ref-by-vol/hook';
import { EActionStatus } from '../stores/type';
const { Text } = Typography;

const TopReferByVol = () => {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const t = useTranslations();
    const {
        topRefByVolState,
        getAllTopRefByVolAction,
        resetStatusGetAllTopRefByVolAction
    } = useTopRefByVol();

    const { chainConfig } = useConfig();
    const fetchTopRefByVol = () => {
        if (chainConfig?.chainId) {
            getAllTopRefByVolAction({
                chainId: chainConfig.chainId.toString()
            });
        }
    };
    useEffect(() => {
        fetchTopRefByVol();

        const intervalId = setInterval(() => {
            if (topRefByVolState.status !== EActionStatus.Pending) {
                fetchTopRefByVol();
            }
        }, 5000);
        return () => clearInterval(intervalId);
    }, [chainConfig?.chainId, address]);

    useEffect(() => {
        if (
            topRefByVolState.status === EActionStatus.Succeeded &&
            topRefByVolState.topRefByVols
        ) {
            resetStatusGetAllTopRefByVolAction();
        }
    }, [topRefByVolState.status]);

    const handleClickTopRefByVol = (id: string) => {
        // if (isConnected && address) {
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/profile/address/${id}`
        );
        // } else {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }
    };

    return (
        <div className={``}>
            {topRefByVolState.topRefByVols &&
                topRefByVolState.topRefByVols.length > 0 && (
                    <div className="relative mb-8 mt-2 flex justify-center overflow-y-auto overflow-x-hidden">
                        <div className="w-full max-w-xl ">
                            <div className="mb-4 animate-king-title text-center">
                                <Text className="animate-king-text !font-forza !text-2xl !font-extrabold tracking-wider text-yellow-500">
                                    Top Referrals by Volume
                                </Text>
                            </div>
                            <div
                                className={`max-h-[290px] animate-fadeIn overflow-y-auto rounded-lg bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-6 shadow-lg`}
                            >
                                <ul>
                                    {topRefByVolState.topRefByVols &&
                                        topRefByVolState.topRefByVols.length >
                                            0 &&
                                        topRefByVolState.topRefByVols.map(
                                            (item, index) => (
                                                <li
                                                    key={index}
                                                    className="mb-4 flex animate-fadeInUp cursor-pointer items-center justify-between rounded-lg bg-white bg-opacity-20 p-4 backdrop-blur-lg backdrop-filter
                                                hover:bg-white hover:bg-opacity-20 hover:bg-opacity-30 hover:backdrop-blur-lg hover:backdrop-filter
                                            "
                                                    onClick={() =>
                                                        handleClickTopRefByVol(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        <span className="mr-3 font-bold text-white">
                                                            {index + 1}
                                                        </span>
                                                        <Star className="mr-3 h-6 w-6 animate-spin text-yellow-300" />
                                                        <span
                                                            className="cursor-pointer !font-forza text-white hover:text-blue-600"
                                                            onClick={() =>
                                                                handleClickTopRefByVol(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            {shortWalletAddress(
                                                                item.id || ''
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="!font-forza text-white">
                                                        {item.volumeInETH}{' '}
                                                        {chainConfig?.currency}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default TopReferByVol;
