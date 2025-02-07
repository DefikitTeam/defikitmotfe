/* eslint-disable */
import BoxArea from '@/src/components/common/box-area';
import CreateTypeChatItem from '@/src/components/common/create-type-chat-item';
import { useCreatePoolLaunchInformation } from '@/src/stores/pool/hook';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, CollapseProps, Typography } from 'antd';
import { useTranslations } from 'next-intl';
const { Title } = Typography;

const StyleCommunication = () => {
    const t = useTranslations();

    const [data, setData] = useCreatePoolLaunchInformation();

    const onAddNew = (name: 'all' | 'chat' | 'post') => {
        setData({
            ...data,
            aiAgent: {
                style: {
                    ...data.aiAgent?.style,
                    [name]: [...(data.aiAgent?.style?.[name] ?? []), '']
                }
            }
        });
    };

    const onDelete = (name: 'all' | 'chat' | 'post', index: number) => () => {
        setData({
            ...data,
            aiAgent: {
                style: {
                    ...data.aiAgent?.style,
                    [name]: (data.aiAgent?.style?.[name] ?? []).filter(
                        (r, i) => i != index
                    )
                }
            }
        });
    };

    const onChange =
        (name: 'all' | 'chat' | 'post', index: number) => (value: string) => {
            const styleAlls = [...(data.aiAgent?.style?.[name] ?? [])];
            styleAlls[index] = value;

            setData({
                ...data,
                aiAgent: {
                    style: {
                        ...data.aiAgent?.style,
                        [name]: styleAlls
                    }
                }
            });
        };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '',
            children: (
                <BoxArea>
                    <div className="flex flex-col gap-2">
                        <div className="">
                            <div className="relative">
                                <span className="absolute left-[-15px] top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-black"></span>

                                <Title
                                    level={5}
                                    className="mb-0 w-fit !flex-1 text-nowrap text-center font-medium"
                                >
                                    {t('ALL')}
                                </Title>
                            </div>

                            <div className="mb-6 flex flex-col gap-6">
                                {data?.aiAgent?.style?.all &&
                                    data.aiAgent.style.all.length > 0 &&
                                    data.aiAgent.style.all.map((x, index) => (
                                        <CreateTypeChatItem
                                            key={index}
                                            index={index + 1}
                                            title={t('ALL')}
                                            content={x}
                                            onChangeContent={onChange(
                                                'all',
                                                index
                                            )}
                                            onDelete={onDelete('all', index)}
                                        />
                                    ))}
                            </div>
                            <Button
                                onClick={() => onAddNew('all')}
                                icon={<PlusOutlined />}
                                className="ml-[24px] !font-forza"
                                // disabled={(data?.aiAgent?.style?.all ?? [])?.length >= 10}
                            >
                                {t('ADD_NEW')}
                            </Button>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute left-[-15px] top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-black"></span>

                                <Title
                                    level={5}
                                    className="mb-0 w-fit !flex-1 text-nowrap text-center font-medium"
                                >
                                    {t('CHAT')}
                                </Title>
                            </div>

                            <div className="mb-6 flex flex-col gap-6">
                                {data?.aiAgent?.style?.chat &&
                                    data.aiAgent.style.chat.length > 0 &&
                                    data.aiAgent.style.chat.map((x, index) => (
                                        <CreateTypeChatItem
                                            key={index}
                                            index={index + 1}
                                            title={t('CHAT')}
                                            content={x}
                                            onChangeContent={onChange(
                                                'chat',
                                                index
                                            )}
                                            onDelete={onDelete('chat', index)}
                                        />
                                    ))}
                            </div>
                            <Button
                                onClick={() => onAddNew('chat')}
                                icon={<PlusOutlined />}
                                className="ml-[24px] !font-forza"
                                // disabled={(data?.aiAgent?.style?.all ?? [])?.length >= 10}
                            >
                                {t('ADD_NEW')}
                            </Button>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute left-[-15px] top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-black"></span>

                                <Title
                                    level={5}
                                    className="mb-0 w-fit !flex-1 text-nowrap text-center font-medium"
                                >
                                    {t('POST')}
                                </Title>
                            </div>

                            <div className="mb-6 flex flex-col gap-6">
                                {data?.aiAgent?.style?.post &&
                                    data.aiAgent.style.post.length > 0 &&
                                    data.aiAgent.style.post.map((x, index) => (
                                        <CreateTypeChatItem
                                            key={index}
                                            index={index + 1}
                                            title={t('POST')}
                                            content={x}
                                            onChangeContent={onChange(
                                                'post',
                                                index
                                            )}
                                            onDelete={onDelete('post', index)}
                                        />
                                    ))}
                            </div>
                            <Button
                                onClick={() => onAddNew('post')}
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

export default StyleCommunication;
