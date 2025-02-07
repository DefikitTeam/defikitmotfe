/* eslint-disable */
import {
    convertTimeToLocalDate,
    formatCurrency,
    shortWalletAddress
} from '@/src/common/utils/utils';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import useWindowSize from '@/src/hooks/useWindowSize';
import { usePoolDetail, useVesting } from '@/src/stores/pool/hook';
import { CopyOutlined } from '@ant-design/icons';
import { Collapse, Tooltip, notification } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';

import ModalDetailVesting from './modal-detail-vesting';
import { CollapseProps } from 'antd/lib';

const PoolDetailInformation = () => {
    const t = useTranslations();
    const { isMobile } = useWindowSize();
    const [{ poolStateDetail }] = usePoolDetail();
    const { setOpenModalVesting } = useVesting();

    const { pool, analystData } = poolStateDetail;

    const { chainData } = useCurrentChainInformation();

    const handleClickOpenViewDetail = () => {
        setOpenModalVesting(true);
    };
    const handleCopy = (tokenAddress: string | undefined) => {
        if (tokenAddress) {
            navigator.clipboard.writeText(tokenAddress).then(() => {
                notification.success({
                    message: t('ADDRESS_COPIED_TO_CLIPBOARD'),
                    placement: 'top',
                    duration: 1.5,
                    showProgress: true
                });
            });
        }
    };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Click here to view pool details',
            className: '',
            children: (
                <div className="bg-white pt-2 font-forza text-base">
                    <h3 className="font-bold">{t('POOL_INFO')}:</h3>
                    <div className="flex justify-between">
                        <div className="  ">{t('CREATE_BY')}:</div>
                        <div className="  ">
                            <Tooltip title={t('COPY_TO_CLIPBOARD')}>
                                <CopyOutlined
                                    className="cursor-default text-lg"
                                    style={{}}
                                    onClick={() => handleCopy(pool?.owner)}
                                />
                            </Tooltip>
                            {isMobile
                                ? shortWalletAddress(pool ? pool.owner : '')
                                : pool?.owner}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="  ">{t('BONDING_POOL')}</div>
                        <div className="  ">
                            {formatCurrency(
                                pool
                                    ? `${new BigNumber(pool?.tokenForSale)
                                        //   .div(10 ** parseInt(pool?.decimals))
                                          .toFixed(0)} ${pool.symbol}`
                                    : '0'
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">{t('LIQUIDITY')}:</div>
                        <div className="  ">
                            {formatCurrency(
                                pool
                                    ? `${new BigNumber(pool?.tokenForLiquidity)
                                        //   .div(10 ** parseInt(pool?.decimals))
                                          .toFixed(0)} ${pool.symbol}`
                                    : '0'
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="  ">{t('AIRDROP')}:</div>
                        <div className="  ">
                            {formatCurrency(
                                pool
                                    ? `${new BigNumber(pool?.tokenForAirdrop)
                                        //   .div(10 ** parseInt(pool?.decimals))
                                          .toFixed(0)} ${pool.symbol}`
                                    : '0'
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="  ">{t('REWARD')}:</div>
                        <div className="  ">
                            {formatCurrency(
                                pool
                                    ? `${new BigNumber(pool?.tokenForFarm)
                                        //   .div(10 ** parseInt(pool?.decimals))
                                          .toFixed(0)} ${pool.symbol}`
                                    : '0'
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="  ">{t('HARDCAP')}:</div>
                        <div className="  ">
                            {pool
                                ? `${new BigNumber(pool?.capInETH)
                                      .div(1e18)
                                      .toFixed(7)} ${chainData.currency}`
                                : '0'}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">{t('BOND_START_RATE')}:</div>
                        <div className="  ">
                            1 BOND = {analystData?.tokenPerBond} {pool?.symbol}{' '}
                            = {analystData?.startBondPerETH || 0}{' '}
                            {chainData.currency}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">{t('BOND_END_RATE')}:</div>
                        <div className="  ">
                            1 BOND = {analystData?.tokenPerBond} {pool?.symbol}{' '}
                            = {analystData?.endBondPerETH || 0}{' '}
                            {chainData.currency}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">{t('LISTING_RATE')}:</div>
                        <div className="  ">
                            1 BOND = {analystData?.tokenPerBond} {pool?.symbol}{' '}
                            = {analystData?.listingBondPerETH || 0}{' '}
                            {chainData.currency}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">
                            {t('MINTING_RELEASE_TIME_(HOURS)')}
                        </div>
                        <div className="  ">
                            {new BigNumber(pool?.minDurationSell || 0)
                                .div(3600)
                                .toString()}
                            {/* {((Number(pool?.minDurationSell))/(3600))} */}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">{t('START_TIME')}:</div>
                        <div className="  ">
                            {convertTimeToLocalDate(pool?.startTime)}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="  ">{t('END_TIME')}:</div>
                        <div className="  ">
                            {convertTimeToLocalDate(pool?.endTime)}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">{t('LISTING_ON')}:</div>
                        <div className="  ">UniswapV2</div>
                    </div>

                    <div className="flex justify-between">
                        <div className="  ">{t('YOUR_VESTING')}:</div>
                        <div
                            className="cursor-pointer font-forza  text-lg text-blue-400"
                            onClick={handleClickOpenViewDetail}
                        >
                            {t('VIEW_DETAIL')}
                        </div>
                    </div>
                    <ModalDetailVesting />
                </div>
            )
        }
    ];
    return (
        <>
            <Collapse
                // onChange={onChange}
                // defaultActiveKey={['1']}
                items={items}
            />
        </>
    );
};
export default PoolDetailInformation;
