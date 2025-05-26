/* eslint-disable */
import {
  useCreateAiAgentInformation,
  useCreatePoolLaunchInformation
} from '@/src/stores/pool/hook';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, CollapseProps } from 'antd';
import { useTranslations } from 'next-intl';
import BoxArea from './box-area';
import MessageItem from './message-item';

const MessageReplyByAgent = ({ mode }: { mode: string }) => {
  const t = useTranslations();
  const [data, setData] = useCreatePoolLaunchInformation();

  const [
    dataAiAgent,
    setCreateAiAgentInformationAction,
    resetDataAction,
    setOpenModalCreateAiAgentAction
  ] = useCreateAiAgentInformation();
  let items: CollapseProps['items'] = [];
  if (mode === 'launch-pool') {
    // eslint-disable-next-line
    // @ts-ignore
    const onAddNew = (index: number) => {
      setData({
        ...data,
        aiAgent: {
          ...data.aiAgent,
          messageExamples: [
            ...(data.aiAgent?.messageExamples ?? []),
            [
              {
                user: 'user',
                content: {
                  text: ''
                }
              },
              {
                user: 'agent',
                content: {
                  text: ''
                }
              }
            ]
          ]
        }
      });
    };

    const onDelete = (index: number) => () => {
      setData({
        ...data,
        aiAgent: {
          messageExamples: data?.aiAgent?.messageExamples?.filter(
            // @ts-ignore
            (r, i) => i !== index
          )
        }
      });
    };

    const onChange =
      (name: 'user' | 'agent', index: number) => (value: string) => {
        const messageExamples = [...(data?.aiAgent?.messageExamples ?? [])];

        if (name === 'user') {
          messageExamples[index][0] = {
            user: 'user',
            content: {
              text: value
            }
          };
        } else {
          messageExamples[index][1] = {
            user: 'agent',
            content: {
              text: value
            }
          };
        }

        setData({
          ...data,
          aiAgent: {
            messageExamples: messageExamples
          }
        });
      };

    items = [
      {
        key: '1',
        label: '',
        children: (
          <BoxArea>
            <div className="flex flex-col gap-2">
              <div className="">
                <div className="mb-6 flex flex-col gap-6">
                  {data?.aiAgent?.messageExamples &&
                    data?.aiAgent?.messageExamples.length > 0 &&
                    data?.aiAgent?.messageExamples.map((x, index) => (
                      <MessageItem
                        key={index}
                        index={index + 1}
                        title={t('EXAMPLE')}
                        item={x}
                        onChangeUser={onChange('user', index)}
                        onChangeAgent={onChange('agent', index)}
                        onDelete={onDelete(index)}
                      />
                    ))}
                </div>
                <Button
                  onClick={() =>
                    onAddNew((data?.aiAgent?.messageExamples?.length ?? 0) + 1)
                  }
                  icon={<PlusOutlined />}
                  className="ml-[24px] !font-forza"
                  // disabled={(data?.aiAgent?.style?.all ?? [])?.length >= 10}
                >
                  {t('ADD_NEW')}
                </Button>
              </div>
            </div>
          </BoxArea>
        )
      }
    ];
  } else if (mode === 'create-ai-agent-after-launch-pool') {
    // eslint-disable-next-line
    // @ts-ignore
    const onAddNew = (index: number) => {
      setCreateAiAgentInformationAction({
        ...dataAiAgent,

        messageExamples: [
          ...(dataAiAgent?.messageExamples ?? []),
          [
            {
              user: 'user',
              content: {
                text: ''
              }
            },
            {
              user: 'agent',
              content: {
                text: ''
              }
            }
          ]
        ]
      });
    };

    const onDelete = (index: number) => () => {
      setCreateAiAgentInformationAction({
        ...dataAiAgent,
        messageExamples: dataAiAgent?.messageExamples?.filter(
          // @ts-ignore
          (r, i) => i !== index
        )
      });
    };

    const onChange =
      (name: 'user' | 'agent', index: number) => (value: string) => {
        const messageExamples = [...(dataAiAgent?.messageExamples ?? [])];

        if (name === 'user') {
          messageExamples[index][0] = {
            user: 'user',
            content: {
              text: value
            }
          };
        } else {
          messageExamples[index][1] = {
            user: 'agent',
            content: {
              text: value
            }
          };
        }

        setCreateAiAgentInformationAction({
          ...dataAiAgent,

          messageExamples: messageExamples
        });
      };

    items = [
      {
        key: '1',
        label: '',
        children: (
          <BoxArea>
            <div className="flex flex-col gap-2">
              <div className="">
                <div className="mb-6 flex flex-col gap-6">
                  {dataAiAgent?.messageExamples &&
                    dataAiAgent?.messageExamples.length > 0 &&
                    dataAiAgent?.messageExamples.map((x, index) => (
                      <MessageItem
                        key={index}
                        index={index + 1}
                        title={t('EXAMPLE')}
                        item={x}
                        onChangeUser={onChange('user', index)}
                        onChangeAgent={onChange('agent', index)}
                        onDelete={onDelete(index)}
                      />
                    ))}
                </div>
                <Button
                  onClick={() =>
                    onAddNew((dataAiAgent?.messageExamples?.length ?? 0) + 1)
                  }
                  icon={<PlusOutlined />}
                  className="ml-[24px] !font-forza"
                  // disabled={(dataAiAgent?.style?.all ?? [])?.length >= 10}
                >
                  {t('ADD_NEW')}
                </Button>
              </div>
            </div>
          </BoxArea>
        )
      }
    ];
  }

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

export default MessageReplyByAgent;
