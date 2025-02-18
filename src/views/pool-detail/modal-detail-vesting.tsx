/* eslint-disable */

import {
    formatCurrency,
    getDateTimeInFormat,
    shortWalletAddress
} from '@/src/common/utils/utils';
import { useConfig } from '@/src/hooks/useConfig';
import useWindowSize from '@/src/hooks/useWindowSize';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { usePoolDetail, useVesting } from '@/src/stores/pool/hook';
import { Modal, Table } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const ModalDetailVesting = () => {
    const t = useTranslations();
    const [{ poolStateDetail }] = usePoolDetail();
    const { pool } = poolStateDetail;
    const { isMobile } = useWindowSize();
    const { address } = useAccount();
    const { setOpenModalVesting, vestingState } = useVesting();

    const { chainConfig } = useConfig();
    const [balanceOfUser, setBalanceOfUser] = useState('0');

    const [maxRepeatPurchase, setMaxRepeatPurchase] = useState('0');

    const [viewDetailRows, setViewDetailRows] = useState<
        {
            key: string;
            amount: string;
            time: string;
            status: string;
        }[]
    >([]);

    if (!pool) return null;
    useEffect(() => {
        if (pool) {
            getUserPoolInfo(pool.id);
        }
    }, [pool.id, chainConfig?.chainId, pool.soldBatch]);

    useEffect(() => {
        const tokenForSale = new BigNumber(pool.tokenForSale);
        const totalBatch = new BigNumber(pool.totalBatch);
        const maxRepeatPurchase = tokenForSale
            .div(totalBatch)
            .div(10 ** parseInt(pool.decimals))
            .toFixed(7);
        setMaxRepeatPurchase(maxRepeatPurchase);
    }, [
        pool.tokenForSale,
        pool.totalBatch,
        pool.decimals,
        pool.id,
        pool.soldBatch
    ]);

    const getUserPoolInfo = async (poolAddress: string) => {
        if (address) {
            const userPoolInfo = await servicePool.getUserPool({
                chainId: chainConfig?.chainId!,
                poolAddress: poolAddress,
                userAddress: address
            });
            if (userPoolInfo) {
                const userPoolInforResponse = await userPoolInfo.json();
                const dataResponse =
                    userPoolInforResponse?.data?.userInPools ?? [];

                let balanceOfUserParam = '0';
                if (dataResponse && dataResponse.length > 0) {
                    balanceOfUserParam = dataResponse[0].batch;
                    setBalanceOfUser(balanceOfUserParam);
                }
            }
        }
    };

    const setDataForDetailModal = (
        balanceOfUserParam: string,
        tgeTime: string | null
    ) => {
        const NOW = new Date();
        const dateArr = tgeTime
            ? [
                  {
                      time: getDateTimeInFormat(
                          new Date(parseInt(tgeTime) * 1000)
                      ),
                      status:
                          NOW.valueOf() < parseInt(tgeTime) * 1000
                              ? 'lock'
                              : 'unlock'
                  },
                  {
                      time: getDateTimeInFormat(
                          new Date(
                              parseInt(tgeTime) * 1000 + 8 * 60 * 60 * 1000
                          )
                      ),
                      status:
                          NOW.valueOf() <
                          parseInt(tgeTime) * 1000 + 8 * 60 * 60 * 1000
                              ? 'lock'
                              : 'unlock'
                  },
                  {
                      time: getDateTimeInFormat(
                          new Date(
                              parseInt(tgeTime) * 1000 + 16 * 60 * 60 * 1000
                          )
                      ),
                      status:
                          NOW.valueOf() <
                          parseInt(tgeTime) * 1000 + 16 * 60 * 60 * 1000
                              ? 'lock'
                              : 'unlock'
                  },
                  {
                      time: getDateTimeInFormat(
                          new Date(
                              parseInt(tgeTime) * 1000 + 24 * 60 * 60 * 1000
                          )
                      ),
                      status:
                          NOW.valueOf() <
                          parseInt(tgeTime) * 1000 + 24 * 60 * 60 * 1000
                              ? 'lock'
                              : 'unlock'
                  }
              ]
            : [
                  {
                      time: 'TGE',
                      status: 'lock'
                  },
                  {
                      time: '8 hours after TGE',
                      status: 'lock'
                  },
                  {
                      time: '16 hours after TGE',
                      status: 'lock'
                  },
                  {
                      time: '24 hours after TGE',
                      status: 'lock'
                  }
              ];

        const data = [
            {
                key: '1',
                amount:
                    formatCurrency(
                        new BigNumber(balanceOfUserParam)
                            .times(maxRepeatPurchase)
                            .times(0.4)
                            .toFixed(0)
                    ) + ' (40%)',
                time: dateArr[0].time,
                status: dateArr[0].status
            },
            {
                key: '2',
                amount:
                    formatCurrency(
                        new BigNumber(balanceOfUserParam)
                            .times(maxRepeatPurchase)
                            .times(0.2)
                            .toFixed(0)
                    ) + ' (20%)',
                time: dateArr[1].time,
                status: dateArr[1].status
            },
            {
                key: '3',
                amount:
                    formatCurrency(
                        new BigNumber(balanceOfUserParam)
                            .times(maxRepeatPurchase)
                            .times(0.2)
                            .toFixed(0)
                    ) + ' (20%)',
                time: dateArr[2].time,
                status: dateArr[2].status
            },
            {
                key: '4',
                amount:
                    formatCurrency(
                        new BigNumber(balanceOfUserParam)
                            .times(maxRepeatPurchase)
                            .times(0.2)
                            .toFixed(0)
                    ) + ' (20%)',
                time: dateArr[3].time,
                status: dateArr[3].status
            }
        ];

        setViewDetailRows(data);
    };

    useEffect(() => {
        if (!pool) return;
        setDataForDetailModal(balanceOfUser, pool?.tgeTimestamp);
    }, [balanceOfUser, pool]);

    const columns = [
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center' as 'center',
            className: 'font-forza'
        },
        {
            title: 'Unlock Time',
            dataIndex: 'time',
            key: 'time',
            align: 'center' as 'center',
            className: 'font-forza'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center' as 'center',
            className: 'font-forza'
        }
    ];
    const handleClose = () => {
        setOpenModalVesting(false);
    };

    return (
        <Modal
            title={
                <span className="!font-forza text-base font-bold">
                    {t('VIEW_DETAIL')}
                </span>
            }
            open={vestingState.openModalVesting}
            footer={null}
            onCancel={handleClose}
            maskClosable={true}
            centered
        >
            <div className="flex flex-col">
                <div className="w-fit text-left !font-forza text-base">
                    <div className="w-fit !flex-1 overflow-hidden text-nowrap">
                        {t('NAME')}: <strong>{pool?.name}</strong>
                    </div>
                    <div className="w-fit !flex-1 overflow-hidden text-nowrap">
                        {t('CONTRACT')}:{' '}
                        <strong>
                            {isMobile
                                ? shortWalletAddress(pool ? pool.id : '')
                                : pool?.id}
                        </strong>
                    </div>
                    <div className="w-fit !flex-1 overflow-hidden text-nowrap">
                        {t('YOUR_CONTRIBUTED')}:
                        <strong>
                            {' '}
                            {balanceOfUser} bond ~{' '}
                            {formatCurrency(
                                new BigNumber(balanceOfUser)
                                    .times(maxRepeatPurchase)
                                    .toFixed(0)
                            )}{' '}
                            {pool?.symbol}
                        </strong>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={viewDetailRows}
                    pagination={false}
                    bordered
                />
            </div>
        </Modal>
    );
};

export default ModalDetailVesting;
