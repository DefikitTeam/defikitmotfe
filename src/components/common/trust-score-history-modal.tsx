import { useConfig } from '@/src/hooks/useConfig';
import { useTrustScoreHistoryPool } from '@/src/stores/pool/hook';
import { useTrustScoreHistoryWallet } from '@/src/stores/wallet/hook';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { IPoolTrustScoreHistory } from '@/src/stores/pool/type';
import { IWalletTrustScoreHistory } from '@/src/stores/wallet/type';
import { ExportOutlined } from '@ant-design/icons';
import Moment from 'react-moment';

interface TrustScoreHistoryModalProps {
    type: 'wallet' | 'pool';
    address: string;
}

const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
};

const TrustScoreHistoryModal = ({
    type,
    address
}: TrustScoreHistoryModalProps) => {
    const t = useTranslations();
    const { chainConfig } = useConfig();

    const {
        trustScoreHistoryPoolState,
        getTrustScoreHistoryPoolAction,
        setOpenModalHistoryPoolAction,
        resetTrustScoreHistoryPoolAction
    } = useTrustScoreHistoryPool();

    const {
        trustScoreHistoryWalletState,
        getTrustScoreHistoryWalletAction,
        setOpenModalHistoryWalletAction,
        resetTrustScoreHistoryWalletAction
    } = useTrustScoreHistoryWallet();

    const isOpen =
        type === 'wallet'
            ? trustScoreHistoryWalletState.openModalHistoryWallet
            : trustScoreHistoryPoolState.openModalHistoryPool;

    const historyData =
        type === 'wallet'
            ? trustScoreHistoryWalletState.trustScoreHistoryWallet
            : trustScoreHistoryPoolState.trustScoreHistoryPool;

    useEffect(() => {
        if (isOpen && chainConfig?.chainId) {
            if (type === 'wallet') {
                getTrustScoreHistoryWalletAction({
                    userAddress: address,
                    chainId: chainConfig.chainId
                });
            } else {
                getTrustScoreHistoryPoolAction({
                    poolAddress: address,
                    chainId: chainConfig.chainId
                });
            }
        }
    }, [isOpen, type, address, chainConfig?.chainId]);



    const handleClose = () => {
        console.log('handleClose', type);
        if (type === 'wallet') {
            setOpenModalHistoryWalletAction(false);
        } else {
            setOpenModalHistoryPoolAction(false);
        }
    };
    const handleOpenResentTx = (hash: string, type: string) => {
        if (hash) {
            window.open(
                chainConfig?.explorer + `/${type}/` + hash,
                '_blank',
                'noopener,noreferrer'
            );
        }
    };

    const columns: ColumnsType<
        IWalletTrustScoreHistory | IPoolTrustScoreHistory
    > = [

            {
                title: <span className="font-bold text-blue-600">{t('TRUST_SCORE')}</span>,
                dataIndex: 'trustScore',
                key: 'trustScore',
                width: '5%',
                className: '!font-forza',
                align: 'center',
                render: (_, record) => (
                    <div>
                        {new BigNumber(record.trustScore).div(1e18).toFixed(2)}
                    </div>
                )
            },
            {
                title: <span className="font-bold text-purple-600">{t('REASON')}</span>,
                dataIndex: 'reason',
                key: 'reason',
                width: '5%',
                className: '!font-forza',
                align: 'center'
            },

            {
                title: <span className="font-bold text-green-600">{t('DATE')}</span>,
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: '5%',
                className: '!font-forza',
                align: 'center',
                render: (_, record) => {
                    return (
                        <Moment fromNow>
                            {new Date(Number(record.timestamp) * 1000)}
                        </Moment>
                    );
                }
            },
            {
                title: <span className="font-bold text-pink-600">{t('TXN_HASH')}</span>,
                dataIndex: 'transactionHash',
                key: 'transactionHash',
                render: (_, record) => (
                    <div className="flex justify-center items-center">
                        <ExportOutlined
                            className="text-blue-500 hover:text-blue-700 transition-transform duration-200 hover:scale-125 cursor-pointer"
                            style={{ fontSize: '15px' }}
                            onClick={() => handleOpenResentTx(record.transactionHash, 'tx')}
                        />
                    </div>
                ),
                width: '5%',
                className: '!font-forza',
                align: 'center'
            },
        ];

    return (
        <Modal
            title={
                <span className="!font-forza text-base font-bold  ">
                    {`${type === 'wallet' ? 'Wallet' : 'Pool'} Trust Score History`}
                </span>
            }
            open={isOpen}
            footer={null}
            onCancel={handleClose}
            maskClosable={true}
            className="custom-modal"
        >
            <div className="w-full bg-white/90  rounded-2xl shadow-2xl p-6 animate-fade-in border border-gray-200 dark:border-gray-700 backdrop-blur-md">
                <Table
                    columns={columns}
                    dataSource={historyData}
                    rowKey={(record) => record.transactionHash}
                    pagination={{
                        pageSize: 3,
                    }}
                    
                    bordered
                    scroll={{ x: 'max-content' }}
                    className="!rounded-xl !overflow-hidden !shadow-lg !bg-white "
                />
            </div>
        </Modal>
    );
};

export default TrustScoreHistoryModal;
