/* eslint-disable */
'use client';
import { useActivities, usePoolDetail } from '@/src/stores/pool/hooks';
import { Transaction } from '@/src/stores/pool/type';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Moment from 'react-moment';

import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import { useConfig } from '@/src/hooks/useConfig';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

const ModalActivities = () => {
  const t = useTranslations();
  const { address, chain, chainId } = useAccount();
  const [{ poolStateDetail }] = usePoolDetail();
  const { chainConfig } = useConfig();
  const [tableActivities, setTableActivities] = useState<Transaction[]>([]);

  const {
    activitiesState,
    getListTransactionByPoolAndSender,
    setOpenModalActiviti
  } = useActivities();

  const handleClose = () => {
    setOpenModalActiviti(false);
  };
  useEffect(() => {
    if (address as `0x${string}`) {
      getListTransactionByPoolAndSender({
        poolAddress: poolStateDetail?.pool?.id ?? '',
        senderAddress: address ?? '',
        chainId: chainId ?? 0
      });
    }
  }, [
    chainId,
    address,
    poolStateDetail?.pool?.id,
    poolStateDetail?.pool?.soldBatch
  ]);

  useEffect(() => {
    if (
      (address as `0x${string}`) &&
      activitiesState.transactionList.length > 0
    ) {
      setTableActivities(activitiesState.transactionList);
    }
  }, [activitiesState.transactionList]);

  useEffect(() => {
    if (!(address as `0x${string}`) || !chainId) {
      setTableActivities([] as Transaction[]);
    }
  }, [address]);

  useEffect(() => {
    if (!(address as `0x${string}`) || !chainId) {
    }
  }, [address]);

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
          {new BigNumber(new BigNumber(record.eth).div(1e18).toFixed(7))
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
    }
  ];

  return (
    <Modal
      title={
        <span className="!font-forza text-base font-bold">
          {t('TRANSACTIONS')}
        </span>
      }
      open={activitiesState.openModalActivities}
      footer={null}
      onCancel={handleClose}
      maskClosable={true}
      centered
    >
      <div className="w-full">
        <Table
          rowKey="id"
          dataSource={(address as `0x${string}`) ? tableActivities : []}
          columns={columns}
          className="!font-forza"
          pagination={{ pageSize: 3 }}
          scroll={{ x: 200 }}
          bordered
          sortDirections={['descend']}
        />
      </div>
    </Modal>
  );
};
export default ModalActivities;
