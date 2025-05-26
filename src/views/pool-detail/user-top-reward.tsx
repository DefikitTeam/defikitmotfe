/* eslint-disable */
'use client';
import { formatCurrency, shortWalletAddress } from '@/src/common/utils/utils';
import { useConfig } from '@/src/hooks/useConfig';
import useWindowSize from '@/src/hooks/useWindowSize';
import { RootState } from '@/src/stores';
import { usePoolDetail, useReward } from '@/src/stores/pool/hook';
import {
  IUserTopRewardByPool,
  IUserTopRewardByPoolTransformed
} from '@/src/stores/pool/type';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Modal, notification, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';

const UserTopReward = () => {
  const t = useTranslations();
  const { isMobile } = useWindowSize();
  const { address, chain, chainId, isConnected } = useAccount();
  const [{ poolStateDetail }] = usePoolDetail();
  const router = useRouter();
  const chainData = useSelector((state: RootState) => state.chainData);

  const { pool } = poolStateDetail;
  const { rewardState } = useReward();
  const { dataTopUserRewardByPool } = rewardState;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { chainConfig } = useConfig();

  const userTopRewardByPoolTransformed: IUserTopRewardByPoolTransformed[] =
    dataTopUserRewardByPool?.map((item: IUserTopRewardByPool) => {
      let rewardItem: IUserTopRewardByPoolTransformed = {
        address: '',
        bond: '',
        reward: ''
      };
      let reward: string = '';
      if (pool) {
        reward = new BigNumber(item.referrerBond)
          .times(rewardState.pool?.tokenRewardReferrerPerBond)
          .div(10 ** parseInt(pool?.decimals))
          .toFixed(0);
      }
      rewardItem.address = item.user;
      rewardItem.bond = item.referrerBond;
      rewardItem.reward = reward;

      return rewardItem;
    });
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

  const handleClickAddress = (addressUser: string) => {
    router.push(
      `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/profile/address/${addressUser}`
    );
  };

  const columns: ColumnsType<IUserTopRewardByPoolTransformed> = [
    {
      title: t('ADDRESS'),
      dataIndex: 'address',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <div className="mx-auto flex w-fit !flex-1 items-center justify-between text-nowrap">
          <Tooltip
            title={t('COPY_TO_CLIPBOARD')}
            className="cursor-pointer"
          >
            <CopyOutlined
              className="cursor-default text-lg"
              style={{}}
              onClick={() => handleCopy(pool?.owner)}
            />
          </Tooltip>
          <span
            className="text-blue-400"
            onClick={() => handleClickAddress(record.address)}
          >
            {isMobile
              ? shortWalletAddress(record ? record.address : '')
              : record.address}
          </span>
        </div>
      )
    },

    // {
    //     title: t('BOND'),
    //     dataIndex: 'bond',
    //     width: '5%',
    //     className: '!font-forza',
    //     align: 'center'
    // },
    {
      title: `${t('REWARD')} ${pool?.symbol}`,
      dataIndex: 'reward',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => <div>{formatCurrency(record.reward)}</div>
    }
  ];
  const limitedData = userTopRewardByPoolTransformed?.slice(0, 5);
  const hasMore = userTopRewardByPoolTransformed?.length > 5;

  const handleSetModalVisible = (isVisible: boolean) => {
    if (!isConnected || !address) {
      notification.error({
        message: 'Error',
        description: 'Please connect to your wallet',
        duration: 3,
        showProgress: true
      });
      return;
    }

    setIsModalVisible(isVisible);
  };
  return (
    <div className="h-full w-full bg-white pt-2">
      <div className="!font-forza text-base font-bold">{t('TOP_REWARDS')}</div>
      <Table
        rowKey="address"
        dataSource={limitedData}
        columns={columns}
        className="!font-forza"
        // pagination={{ pageSize: 10 }}
        pagination={false}
        scroll={{ x: 300 }}
        bordered
      />
      {hasMore && (
        <div className="mt-4">
          <Button
            onClick={() => handleSetModalVisible(true)}
            className="!font-forza "
          >
            {t('VIEW_ALL')}
          </Button>
        </div>
      )}
      <Modal
        title={
          <span className="!font-forza text-base font-bold">
            {t('ALL_TOP_REWARDS')}
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          rowKey="address"
          dataSource={userTopRewardByPoolTransformed}
          columns={columns}
          className="!font-forza"
          scroll={{ x: 300 }}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  );
};

export default UserTopReward;
