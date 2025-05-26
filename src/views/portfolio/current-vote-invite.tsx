/* eslint-disable */
'use client';
import {
  CodeReferStatus,
  statusBadgeColor
} from '@/src/common/constant/constance';
import { useConfig } from '@/src/hooks/useConfig';
import serviceInviteCode from '@/src/services/external-services/backend-server/invite-code';
import { RootState } from '@/src/stores';
import { useGetInviteCode } from '@/src/stores/invite-code/hook';
import { IGetInviteCodeResponseItem } from '@/src/stores/invite-code/type';
import { CopyOutlined } from '@ant-design/icons';
import { Badge, notification, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';

const CurrentCodeInvite = () => {
  const [
    { inviteCode },
    fetchGetInviteCode,
    resetGetInviteCode,
    setIsOpenModalGetListCurrentCodeAction
  ] = useGetInviteCode();
  const chainData = useSelector((state: RootState) => state.chainData);
  const { data, status, isOpenModalGetListCurrentCode } = inviteCode;
  const { isConnected, address } = useAccount();

  const params = useParams();
  const addressParams = params?.walletAddress as string;
  const isAddressDifferent = addressParams && addressParams !== address;

  const t = useTranslations();
  const { chainConfig } = useConfig();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (address) {
        fetchGetInviteCode();
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [chainConfig?.chainId, address]);

  const handleCopy = (showCode: string | undefined) => {
    if (showCode) {
      navigator.clipboard.writeText(showCode).then(() => {
        notification.success({
          message: t('SHOW_CODE_COPIED_TO_CLIPBOARD'),
          placement: 'top',
          duration: 1.2,
          showProgress: true
        });
      });
    }
  };

  const columns: ColumnsType<IGetInviteCodeResponseItem> = [
    {
      title: t('CODE_REFER'),
      dataIndex: 'code',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <span className="text-black">
          {record.code || ''}

          <Tooltip title={t('SHOW_CODE_COPIED_TO_CLIPBOARD')}>
            <CopyOutlined
              className="ml-2 cursor-pointer text-lg"
              onClick={() => handleCopy(record.code as string)}
            />
          </Tooltip>
        </span>
      )
    },
    {
      title: t('STATUS_CODE_REFER'),
      dataIndex: 'status',
      width: '5%',
      className: '!font-forza',
      align: 'center',

      render: (_, record) => {
        const status = record.status as CodeReferStatus;
        return (
          <Badge
            color={statusBadgeColor[record.status as CodeReferStatus] || 'gray'}
            className="text-black"
            text={record.status === CodeReferStatus.ACTIVE ? 'Active' : 'Used'}
          />
        );
      }
    }
  ];

  const handleGenerateCode = async () => {
    try {
      const data = await serviceInviteCode.generateInviteCode();
      if (data) {
        notification.success({
          message: 'Success',
          // @ts-ignore
          description: data.message,
          duration: 3,
          showProgress: true
        });

        // @ts-ignore
        await fetchGetInviteCode();
      }
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.response.data.message,
        duration: 3,
        showProgress: true
      });
    }
  };

  return (
    <div className="h-full w-full">
      <div className="mt-2 !font-forza text-base text-black">
        <p className="text-gray-600">
          To create a referral code for another person, you must have a minimum
          balance of $50.
        </p>
        <button
          onClick={handleGenerateCode}
          className="mb-3 mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Generate Code Invite
        </button>
      </div>
      <Table
        rowKey="wallet"
        dataSource={data}
        // @ts-ignore
        columns={columns}
        className="!font-forza"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 200, y: 300 }}
        bordered
        sortDirections={['descend']}
      />
    </div>
  );
};

export default CurrentCodeInvite;
