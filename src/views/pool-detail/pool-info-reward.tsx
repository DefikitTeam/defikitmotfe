/* eslint-disable */
import { getContract } from '@/src/common/blockchain/evm/contracts/utils/getContract';
import { ChainId } from '@/src/common/constant/constance';
import { formatCurrency } from '@/src/common/utils/utils';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import { useReader } from '@/src/hooks/useReader';
import useWindowSize from '@/src/hooks/useWindowSize';
import { RootState } from '@/src/stores';
import { usePoolDetail, useReward } from '@/src/stores/pool/hook';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';

const PoolInfoReward = () => {
    const t = useTranslations();
    const { isMobile } = useWindowSize();
    const { address, chain, chainId } = useAccount();
    const { rewardState } = useReward();
    const { pool } = rewardState;

    const [{ poolStateDetail }] = usePoolDetail();
    const [rewardOfMe, setRewardOfMe] = useState<string>('0');
    const { pool: poolDetail } = poolStateDetail;
    const chainData = useSelector((state: RootState) => state.chainData);
    const multiCallerContract = getContract(
        chainData.chainData.chainId || ChainId.BARTIO
    );
    const { dataReader, isFetchingDataReader } = useReader({
        contractAddAndAbi: multiCallerContract,
        poolAddress: poolDetail?.id as string,
        userAddress: address as `0x${string}`,
        chainId: chainData.chainData.chainId as number
    });
    const estimateYourReward = dataReader ? dataReader[5] : undefined;

    useEffect(() => {
        try {
            if (isFetchingDataReader === false && estimateYourReward) {
                const rewardValue = estimateYourReward?.result;
                if (rewardValue) {
                    const reward = new BigNumber(rewardValue);
                    if (!reward.isNaN()) {
                        setRewardOfMe(reward.toString());
                    } else {
                        console.error('Reward value is NaN');
                    }
                } else {
                    // console.error('Reward value is undefined or null');
                }
            }
        } catch (error) {
            console.log('==== call estimateYourReward error: ', error);
        }
    }, [isFetchingDataReader, estimateYourReward]);

    return (
        <div className="bg-white pt-2  font-forza text-base">
            {(address as `0x${string}`) && (
                <div className="flex justify-between">
                    <div className="  ">{t('YOUR_REWARD')}:</div>
                    <div className="">
                        {rewardOfMe} {poolDetail?.symbol}
                    </div>
                </div>
            )}
            <div className="flex justify-between">
                <div className="  ">{t('POOL_REFERER_COUNT')}:</div>
                <div className="">{pool?.totalReferrerBond}</div>
            </div>
            {/* <div className="flex justify-between">
                <div className="  ">{t('REALTIME_REWARD_PERCENTAGE')}:</div>
                <div className="">{'updating'}</div>
            </div> */}
            <div className="flex justify-between">
                <div className="  ">{t('TOTAL_REF_AMOUNT')}:</div>
                <div className="">
                    {pool?.totalReferrerBond} {poolDetail?.symbol}
                </div>
            </div>
            <div className="flex justify-between">
                <div>{t('TOTAL_REWARD')}:</div>
                <div>
                    {formatCurrency(
                        poolDetail && pool?.tokenForAirdrop
                            ? new BigNumber(pool?.tokenForAirdrop)
                                  .div(10 ** parseInt(poolDetail?.decimals))
                                  .toFixed(0)
                            : '0'
                    )}{' '}
                    {poolDetail?.symbol}
                </div>
            </div>
        </div>
    );
};

export default PoolInfoReward;
