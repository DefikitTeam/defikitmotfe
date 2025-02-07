/* eslint-disable */
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import useWindowSize from '@/src/hooks/useWindowSize';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { useReward } from '@/src/stores/pool/hook';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import PoolInfoReward from './pool-info-reward';
import ShareSocialAffiliate from './share-social-affiliate';
import UserTopReward from './user-top-reward';

const Affiliate = () => {
    const t = useTranslations();
    const { isMobile } = useWindowSize();

    const {
        rewardState,
        getPoolInfoRewardAction,
        getTopUserRewardByPoolAction
    } = useReward();
    const params = useParams();
    const poolAddress = params?.poolAddress as string;
    const { chainData } = useCurrentChainInformation();
    const { authState } = useAuthLogin();
    useEffect(() => {
        if (poolAddress) {
            getPoolInfoRewardAction({
                id: poolAddress,
                chainId: chainData.chainId as number
            });
            const intervalId = setInterval(() => {
                getTopUserRewardByPoolAction({
                    pool: poolAddress,
                    chainId: chainData.chainId as number
                });
            }, 10000);
            return () => clearInterval(intervalId);
        }
    }, [poolAddress, chainData.chainId]);

    return (
        <div
            className={`flex flex-col justify-between bg-white pt-2  ${!isMobile ? 'mt-[-30px]' : ''}  font-forza text-base`}
        >
            <div className=" w-fit !flex-1 text-nowrap font-bold">
                {t('AFFILIATE_PROGRAM')}:{' '}
            </div>
            <div
                className=" flex 
                             flex-col gap-6 overflow-y-auto overflow-x-hidden"
            >
                {authState.userInfo && <ShareSocialAffiliate />}
                <PoolInfoReward />
                <UserTopReward />
            </div>
        </div>
    );
};

export default Affiliate;
