/* eslint-disable */
'use client';
import { shortWalletAddress } from '@/src/common/utils/utils';
import { usePortfolio } from '@/src/stores/profile/hook';
import { IYourFriendList } from '@/src/stores/profile/type';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { Span } from 'next/dist/trace';
import React from 'react';
import { useAccount } from 'wagmi';

const ModalYourFriend = () => {
  const t = useTranslations();
  const { address, chain, chainId } = useAccount();

  const [
    { portfolio },
    fetchPortfolio,
    setIdCurrentChoosedTokenSell,
    fetchYourListFriendAction,
    setOpenModalYourFriendListAction
  ] = usePortfolio();
  const handleClose = () => {
    setOpenModalYourFriendListAction(false);
  };
  const columns: ColumnsType<IYourFriendList> = [
    {
      title: t('INVITED_WALLET'),
      dataIndex: 'wallet',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <span className="text-black">
          {shortWalletAddress(record.wallet || '')}
        </span>
      )
    },
    {
      title: t('TG_USER_NAME'),
      dataIndex: 'username',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <span className="text-black">{record.username || ''}</span>
      )
    }
  ];
  return (
    <Modal
      title={
        <span className="!font-forza text-lg font-bold">
          {t('YOUR_FRIEND_LIST')}
        </span>
      }
      open={portfolio.openModalYourFriendList}
      footer={null}
      onCancel={handleClose}
      maskClosable={true}
      centered
    >
      <div className="w-full">
        <Table
          rowKey="id"
          dataSource={
            (address as `0x${string}`) ? portfolio.yourFriendList : []
          }
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

export default ModalYourFriend;
