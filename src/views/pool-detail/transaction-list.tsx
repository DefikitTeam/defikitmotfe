/* eslint-disable */
'use client';
import { shortWalletAddress } from '@/src/common/utils/utils';
import { TrustScore } from '@/src/components/common/rank-badge';
import { useConfig } from '@/src/hooks/useConfig';
import { RootState } from '@/src/stores';
import { useListPool, usePoolDetail } from '@/src/stores/pool/hooks';
import { Transaction } from '@/src/stores/pool/type';
import { ExportOutlined } from '@ant-design/icons';
import { notification, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
const { Title } = Typography;
const TransactionList = () => {
  const t = useTranslations();
  const params = useParams();
  const poolAddress = params?.poolAddress as string;
  const chainData = useSelector((state: RootState) => state.chainData);
  const [
    { poolStateDetail },
    ,
    ,
    ,
    setPageTransactionAction,
    ,
    fetchTransactions
  ] = usePoolDetail();

  const { getAllRankWalletAction } = useListPool();

  const { transactions, rankWallet } = poolStateDetail;
  const router = useRouter();
  const { chainConfig } = useConfig();
  const handleOpenResentTx = (hash: string, type: string) => {
    if (hash) {
      window.open(
        chainConfig?.explorer + `/${type}/` + hash,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const handleClickAddress = (address: string) => {
    router.push(
      `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/profile/address/${address}`
    );
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: t('TYPE'),
      dataIndex: 'type',
      width: '10%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => <div>{record.type}</div>
    },
    {
      title: t('PRICE'),
      dataIndex: 'eth',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <div>
          {new BigNumber(record.eth).gt(0)
            ? `$${new BigNumber(new BigNumber(record.eth).div(1e18).toFixed(5))
                .div(record.batch)
                .toFixed(7)}`
            : 'N/A'}
        </div>
      )
    },
    {
      title: t('TRUST_SCORE'),
      dataIndex: 'trustScorePool',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <div>
          {record.trustScorePool
            ? new BigNumber(record.trustScorePool).div(1e18).toFixed(2)
            : '0'}
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
      title: `${t('TOTAL')} ${chainConfig?.currency}`,
      dataIndex: 'eth',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <div>{new BigNumber(record.eth).div(1e18).toFixed(7)}</div>
      )
    },
    {
      title: t('SENDER'),
      dataIndex: 'sender',
      width: '10%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <span
          className="flex cursor-pointer items-center justify-between text-blue-400"
          onClick={() => handleClickAddress(record.sender || '')}
        >
          <span className="flex w-full items-center gap-2">
            {shortWalletAddress(record.sender || '')}
          </span>
          <TrustScore
            rank={
              rankWallet.users.findIndex((user) => user.id === record.sender) +
              1
            }
            total={rankWallet.totalUser}
            isHeader={false}
            size={30}
          />
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
          <Moment fromNow>{new Date(Number(record.timestamp) * 1000)}</Moment>
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
            onClick={() => handleOpenResentTx(record.hash, 'tx')}
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
        chainId: chainConfig?.chainId as number
      });
    }
  }, [poolAddress, chainConfig?.chainId, poolStateDetail.pageTransaction]);

  useEffect(() => {
    if (!rankWallet.isFetchedRankWallet && chainConfig?.chainId) {
      getAllRankWalletAction({
        skip: 0,
        chainId: chainConfig?.chainId!
      });
    }
  }, [rankWallet, chainConfig?.chainId]);

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
        className="!w-full !font-forza"
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
