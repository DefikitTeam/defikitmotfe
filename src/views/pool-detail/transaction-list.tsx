/* eslint-disable */
import { shortWalletAddress } from '@/src/common/utils/utils';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import { usePoolDetail } from '@/src/stores/pool/hook';
import { Transaction } from '@/src/stores/pool/type';
import { ExportOutlined } from '@ant-design/icons';
import { Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Moment from 'react-moment';
const { Title } = Typography;
const TransactionList = () => {
    const t = useTranslations();
    const params = useParams();
    const poolAddress = params?.poolAddress as string;
    const [
        { poolStateDetail },
        ,
        ,
        ,
        setPageTransactionAction,
        ,
        fetchTransactions
    ] = usePoolDetail();

    const { transactions } = poolStateDetail;
    const router = useRouter();
    const { chainData } = useCurrentChainInformation();
    const handleOpenResentTx = (address: string, type: string) => {
        // TODO: need change REACT_APP_TEST_SEPOLIA_EXPLORER_URL follow environment, network
        if (address) {
            window.open(
                chainData.explorerUrl + `/${type}/` + address,
                '_blank',
                'noopener,noreferrer'
            );
        }
    };

    const columns: ColumnsType<Transaction> = [
        {
            title: t('TYPE'),
            dataIndex: 'isBuy',
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => <div>{record.isBuy ? 'Buy' : 'Sell'}</div>
        },
        {
            title: t('PRICE'),
            dataIndex: 'eth',
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => (
                <div>
                    $
                    {new BigNumber(
                        new BigNumber(record.eth).div(1e18).toFixed(7)
                    )
                        .div(record.batch)
                        .toFixed(7)}
                </div>
            )
        },
        {
            title: t('BOND_AMOUNT'),
            dataIndex: 'batch',
            width: '5%',
            className: '!font-forza',
            align: 'center'
        },
        {
            title: `${t('TOTAL')} ${chainData.currency}`,
            dataIndex: 'eth',
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => (
                <div>{new BigNumber(record.eth).div(1e18).toFixed(7)}</div>
            )
        },
        {
            title: t('BUYER'),
            dataIndex: 'sender',
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => (
                <span
                    className="cursor-pointer text-blue-400"
                    // onClick={() => handleOpenResentTx(record.sender, 'address')}
                    onClick={() =>
                        router.push(`/profile/address/${record.sender}`)
                    }
                >
                    {shortWalletAddress(record.sender || '')}
                </span>
            )
        },
        {
            title: t('DATE_TIME'),
            dataIndex: 'timestamp',
            width: '10%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => {
                // const date = new Date(parseInt(record.timestamp) * 1000);
                // return <div>{getDateTimeInFormat(date)}</div>;
                return (
                    <Moment fromNow>
                        {new Date(Number(record.timestamp) * 1000)}
                    </Moment>
                );
            }
        },
        {
            title: t('TXN'),
            width: '5%',
            className: '!font-forza cursor-pointer',
            align: 'center',
            render: (_, record) => (
                <div className="">
                    <ExportOutlined
                        style={{ color: '#3687D8', fontSize: '15px' }}
                        onClick={() => handleOpenResentTx(record.id, 'tx')}
                    />
                </div>
            )
        }
    ];

    useEffect(() => {
        if (poolAddress && poolStateDetail.pageTransaction !== undefined) {
            fetchTransactions({
                page: poolStateDetail.pageTransaction,
                limit: poolStateDetail.limitTransaction,
                poolAddress: poolAddress,
                chainId: chainData.chainId as number
            });
        }
    }, [poolAddress, chainData.chainId, poolStateDetail.pageTransaction]);

    const handlePageTransactionChange = (pageTransactionChange: number) => {
        setPageTransactionAction(pageTransactionChange);
    };

    return (
        <div className="h-full w-full bg-white pt-2">
            <div className="!font-forza text-base font-bold">
                {t('RECENT_TRANSACTION')}
            </div>

            <Table
                rowKey="id"
                dataSource={transactions}
                columns={columns}
                className="!font-forza"
                // pagination={{ pageSize: 10 }}
                scroll={{ x: 300 }}
                bordered
                sortDirections={['descend']}
                // onChange={(pagination) => {
                //     setPageTransactionAction(pagination.current || 1);
                // }}
                pagination={{
                    pageSize: poolStateDetail.limitTransaction,
                    defaultCurrent: poolStateDetail.pageTransaction,
                    total: poolStateDetail.totalTransaction,
                    onChange: handlePageTransactionChange,
                    showSizeChanger: false
                }}
            />
        </div>
    );
};

export default TransactionList;
