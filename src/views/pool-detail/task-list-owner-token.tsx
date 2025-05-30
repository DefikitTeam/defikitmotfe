/* eslint-disable */
'use client';
import { useConfig } from '@/src/hooks/useConfig';
import { useTrustPointCaller } from '@/src/hooks/useTrustPointCaller';
import serviceTrustPoint from '@/src/services/external-services/backend-server/trust-point';
import {
  useCreateAiAgentInformation,
  usePoolDetail
} from '@/src/stores/pool/hooks';
import { useTrustPointToken } from '@/src/stores/trust-point/hook';
import { EActionStatus } from '@/src/stores/type';
import { CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  List,
  notification,
  Spin,
  Tag,
  Tooltip,
  Typography,
  Modal,
  Form,
  UploadFile
} from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useAccount } from 'wagmi';
import AdditionalAgent from '../launch/create/additional-agent';
import { RcFile } from 'antd/es/upload';
import ModalCreateAiAgent from './modal-create-ai-agent';
import { NEXT_PUBLIC_AI_CMS } from '@/src/common/web3/constants/env';

// Simple interface that matches the expected structure from the create launch flow
interface IPoolCreatForm { }

const { Title, Text } = Typography;
interface Task {
  id: number;
  multiplier: number;
  description: string;
  trustPointType: string;
  completed: boolean;
  claimed: boolean;
  reason: string;
}

const TaskListOwnerToken = forwardRef((props, ref) => {
  const [
    data,
    setCreateAiAgentInformationAction,
    resetDataAction,
    setOpenModalCreateAiAgentAction
  ] = useCreateAiAgentInformation();

  const t = useTranslations();
  const params = useParams();
  const poolAddress = params?.poolAddress as string;
  const { isConnected, address } = useAccount();
  // const router = useRouter();
  // const { chainConfig } = useConfig();
  // const [form] = Form.useForm<IPoolCreatForm>();
  const [
    { poolStateDetail },
    fetchPoolDetail,
    ,
    fetchHolderDistribution,
    ,
    ,
    ,
    ,
    resetPoolDetailAction
  ] = usePoolDetail();

  const { pool, status, transactions, metaDataInfo, dataDetailPoolFromServer } =
    poolStateDetail;

  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);

  const { getTrustPointTokenAction, trustPointToken } = useTrustPointToken();

  const [tokenIdProcessClaimed, setTokenIdProcessClaimed] = useState<number>(0);

  const { useMintWithSignature, useMintTokenWithSignature } =
    useTrustPointCaller();
  const [loadingMintWithSignature, setLoadingMintWithSignature] =
    useState<boolean>(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [hasUncompletedTask, setHasUncompletedTask] = useState(false);

  useEffect(() => {
    if (useMintTokenWithSignature.isLoadingInitMintTokenWithSignature) {
      notification.info({
        message: 'Transaction in Progress',
        description: 'Please wait while your transaction is being processed.',
        duration: 1.3,
        showProgress: true
      });
    }
  }, [useMintTokenWithSignature.isLoadingInitMintTokenWithSignature]);

  useEffect(() => {
    if (useMintTokenWithSignature.isLoadingAgreedMintTokenWithSignature) {
      setLoadingMintWithSignature(true);
      notification.info({
        message: 'Transaction in Progress',
        description: 'Please wait while minting your token.',
        duration: 2,
        showProgress: true
      });
    }
  }, [useMintTokenWithSignature.isLoadingAgreedMintTokenWithSignature]);

  useEffect(() => {
    if (useMintTokenWithSignature.isConfirmed) {
      setLoadingMintWithSignature(false);
      notification.success({
        message: 'Transaction Success',
        description: 'Minting token successfully.',
        duration: 1.2,
        showProgress: true
      });
      setTokenIdProcessClaimed(0);

      if (
        isConnected &&
        address &&
        address.toLowerCase() === poolStateDetail.pool?.owner?.toLowerCase()
      ) {
        setTimeout(() => {
          getTrustPointTokenAction(poolAddress);
        }, 1_000);
      }
    }
  }, [useMintTokenWithSignature.isConfirmed]);

  useEffect(() => {
    if (useMintTokenWithSignature.isError) {
      setLoadingMintWithSignature(false);
      setTokenIdProcessClaimed(0);
      notification.error({
        message: 'Transaction Failed',
        duration: 3,
        showProgress: true
      });
    }
  }, [useMintTokenWithSignature.isError]);

  useEffect(() => {
    if (
      isConnected &&
      address &&
      address.toLowerCase() === poolStateDetail.pool?.owner?.toLowerCase()
    ) {
      getTrustPointTokenAction(poolAddress);
    } else {
      setTaskList([]);
    }
  }, [poolAddress, address]);

  useEffect(() => {
    if (trustPointToken.data) {
      setTaskList(trustPointToken.data);
    } else {
      setTaskList([]);
    }
  }, [trustPointToken.data]);

  useEffect(() => {
    if (taskList) {
      setHasUncompletedTask(taskList.some((task) => !task.completed));
    }
  }, [taskList]);

  useImperativeHandle(ref, () => ({
    hasUncompletedTask
  }));

  const handleClaimClick = async (task: Task) => {
    setLoadingMintWithSignature(true);
    setTokenIdProcessClaimed(task.id);
    try {
      const signature = await serviceTrustPoint.getSignatureTrustPointToken(
        poolAddress,
        task.id
      );
      if (signature) {
        await useMintTokenWithSignature.actionAsync({
          id: task.id.toString(),
          token: poolAddress,
          signature: signature.data.signature.toString()
        });
      }
    } catch (err: any) {
      notification.error({
        message: 'Error',
        description: err?.shortMessage || err?.message || 'Error',
        showProgress: true
      });
      setLoadingMintWithSignature(false);
      setTokenIdProcessClaimed(0);
    } finally {
      setLoadingMintWithSignature(false);
      setTokenIdProcessClaimed(0);
    }
  };
  const listItemStyle = {
    transition: 'all 0.3s ease',
    padding: '16px 20px',
    cursor: 'pointer',
    borderRadius: '8px',
    marginBottom: '8px',
    backgroundColor: '#ffffff'
  };

  const listItemHoverStyle = {
    backgroundColor: '#f8f9fa',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  };

  const getStatusTag = (task: Task) => {
    if (task.claimed) {
      return (
        // <Tag
        //     icon={<CheckCircleFilled />}
        //     color="success"
        //     className="m-0 !px-3 !py-1 !font-forza !text-sm"
        // >
        //     {t('CLAIMED')}
        // </Tag>

        <div className="flex items-center gap-2">
          <Tag
            icon={<CheckCircleFilled />}
            color="success"
            className="m-0 !px-3 !py-1 !font-forza !text-sm"
          >
            {t('CLAIMED')}
          </Tag>
          {task.id === 13 && (
            <Button
              size="small"
              type="default"
              className="!px-2 !py-1 !font-forza !text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`${NEXT_PUBLIC_AI_CMS}`, '_blank');
              }}
            >
              Go to CMS
            </Button>
          )}
        </div>
      );
    }

    if (task.completed) {
      return (
        <Spin
          spinning={
            tokenIdProcessClaimed === task.id && loadingMintWithSignature
          }
          delay={0}
        >
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleClaimClick(task);
            }}
            disabled={
              tokenIdProcessClaimed !== 0 && tokenIdProcessClaimed === task.id
            }
            className="!h-auto !border-none !bg-[#1677ff] !px-6 !py-1 !font-forza hover:!bg-[#4096ff]"
          >
            {t('CLAIM')}
          </Button>
          {task.id === 13 && (
            <Button
              size="small"
              type="default"
              className="ml-2 !px-2 !py-1 !text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`${NEXT_PUBLIC_AI_CMS}`, '_blank');
              }}
            >
              Go to CMS
            </Button>
          )}
        </Spin>
      );
    }

    const notCompletedTag = (
      <Tag className="m-0 !border-[#ffa39e] !bg-[#fff1f0] !px-3 !py-1 !font-forza !text-sm !text-[#cf1322]">
        {t('NOT_COMPLETED')}
      </Tag>
    );
    let actionButton = null;
    if (task.id === 13) {
      actionButton = (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setOpenModalCreateAiAgentAction(true);
          }}
          className="ml-2 !h-auto !border-none !bg-[#1890ff] !px-6 !py-1 !font-forza hover:!bg-[#40a9ff]"
        >
          {t('GO')}
        </Button>
      );
    }

    return (
      <div className="flex items-center">
        {notCompletedTag}
        {actionButton}
      </div>
    );
  };

  return (
    <>
      <Card
        title={
          <Title
            level={4}
            className="!mb-0 !font-forza"
          >
            {t('TOKEN_TRUST_POINTS_TASKS')}
          </Title>
        }
        style={{ marginBottom: '16px' }}
        bordered={true}
        bodyStyle={{ padding: '16px' }}
        className="!rounded-lg !border-0 !shadow-md"
      >
        {trustPointToken.status === EActionStatus.Pending ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={taskList}
            renderItem={(task: Task, index) => (
              <List.Item
                style={{
                  ...listItemStyle,
                  ...(hoveredTaskId === task.id ? listItemHoverStyle : {})
                }}
                onMouseEnter={() => setHoveredTaskId(task.id)}
                onMouseLeave={() => setHoveredTaskId(null)}
                actions={[getStatusTag(task)]}
                className="!mb-4 !border-0"
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center gap-3">
                      <Text
                        strong
                        className="!font-forza !text-base"
                      >{`NFT ${task.id}`}</Text>
                      <Tag className="!m-0 !border-[#91caff] !bg-[#e6f4ff] !px-2 !py-0.5 !font-forza !text-sm !text-[#1677ff]">
                        x{task.multiplier}
                      </Tag>
                      {!task.completed && (
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#ff4d4f',
                            marginLeft: 4,
                            marginRight: 2
                          }}
                          title="Not completed"
                        />
                      )}
                      {!task.completed && (
                        <Tooltip
                          title={task.reason}
                          placement="right"
                        >
                          <InfoCircleOutlined className="text-[#1677ff] hover:text-[#4096ff]" />
                        </Tooltip>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <Text className="!mt-1 !font-forza !text-[#697586]">
                        {task.description}
                      </Text>
                      {!task.completed && (
                        <div className="mt-1">
                          <Text
                            type="secondary"
                            className="!font-forza !text-sm"
                          >
                            {task.reason}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
            className="!divide-y !divide-gray-100"
          />
        )}
      </Card>

      <ModalCreateAiAgent />
    </>
  );
});

export default TaskListOwnerToken;
