/* eslint-disable */
'use client';
import {
    REGEX_DISCORD,
    REGEX_TELEGRAM,
    REGEX_TWITTER,
    REGEX_WEBSITE
} from '@/src/common/constant/constance';
import { useCreatePoolLaunchInformation } from '@/src/stores/pool/hook';
import {
    Col,
    Collapse,
    CollapseProps,
    Form,
    FormInstance,
    Input,
    Row,
    Typography
} from 'antd';
import { useTranslations } from 'next-intl';
import { IPoolCreatForm } from '.';
interface PoolInforProps {
    form: FormInstance<IPoolCreatForm>;
}
const { Text } = Typography;

const SocialMedia = ({ form }: PoolInforProps) => {
    const t = useTranslations();
    const [data, setData] = useCreatePoolLaunchInformation();
    const onChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setData({
            ...data,
            [name]: value.trim()
        });
    };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '',
            children: (
                <div className="">
                    {
                        <Row gutter={[4, 8]}>
                            <Col
                                xs={24}
                                sm={24}
                                lg={24}
                                md={24}
                                xxl={24}
                            >
                                <Form.Item
                                    name="websiteLink"
                                    label={
                                        <span className="!font-forza text-base">
                                            {t('POOL_WEBSITE')}
                                        </span>
                                    }
                                    className="mb-0"
                                    rules={[
                                        {
                                            pattern: REGEX_WEBSITE,
                                            message: t(
                                                'INVALID_LINK_ERROR_MESSAGE'
                                            )
                                        }
                                    ]}
                                    initialValue={data.websiteLink}
                                >
                                    <Input
                                        size="large"
                                        className="!font-forza text-base"
                                        placeholder="Ex: https://mot.com/"
                                        onChange={onChange}
                                        name="websiteLink"
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                xs={24}
                                sm={24}
                                lg={24}
                                md={24}
                                xxl={24}
                            >
                                <Form.Item
                                    name="discordLink"
                                    label={
                                        <span className="!font-forza text-base">
                                            {t('POOL_DICORD')}
                                        </span>
                                    }
                                    className="mb-0"
                                    rules={[
                                        {
                                            pattern: REGEX_DISCORD,
                                            message: t(
                                                'INVALID_LINK_ERROR_MESSAGE'
                                            )
                                        }
                                    ]}
                                    initialValue={data.discordLink}
                                >
                                    <Input
                                        size="large"
                                        className="!font-forza text-base"
                                        placeholder="Ex: https://discord.com/abc123"
                                        onChange={onChange}
                                        name="discordLink"
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                xs={24}
                                sm={24}
                                lg={24}
                                md={24}
                                xxl={24}
                            >
                                <Form.Item
                                    name="twitterLink"
                                    label={
                                        <span className="!font-forza text-base">
                                            {t('POOL_TWITTER')}
                                        </span>
                                    }
                                    className="mb-0 "
                                    rules={[
                                        {
                                            pattern: REGEX_TWITTER,
                                            message: t(
                                                'INVALID_LINK_ERROR_MESSAGE'
                                            )
                                        }
                                    ]}
                                    initialValue={data.twitterLink}
                                >
                                    <Input
                                        className="!font-forza text-base"
                                        size="large"
                                        placeholder="Ex: https://twitter.com/username"
                                        onChange={onChange}
                                        name="twitterLink"
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                xs={24}
                                sm={24}
                                lg={24}
                                md={24}
                                xxl={24}
                            >
                                <Form.Item
                                    name="telegramLink"
                                    label={
                                        <span className="!font-forza text-base">
                                            {t('POOL_TELEGRAM')}
                                        </span>
                                    }
                                    className="mb-0"
                                    rules={[
                                        {
                                            pattern: REGEX_TELEGRAM,
                                            message: t(
                                                'INVALID_LINK_ERROR_MESSAGE'
                                            )
                                        }
                                    ]}
                                    initialValue={data.telegramLink}
                                >
                                    <Input
                                        size="large"
                                        className="!font-forza text-base"
                                        name="telegramLink"
                                        placeholder="Ex: https://t.me/joinchat"
                                        onChange={onChange}
                                    />
                                </Form.Item>
                            </Col>

                            {/* <Col
                                xs={24}
                                sm={24}
                                lg={24}
                                md={24}
                                xxl={24}
                            >
                                <Form.Item
                                    name="advanceNumberOfBond"
                                    label={
                                        <span className="w-fit !flex-1 text-nowrap !font-forza text-base">
                                            {t('NUMBER_OF_BOND_CURRENT')}
                                            {': '}{' '}
                                            {`${Number(data.totalBatch)}`}
                                        </span>
                                    }
                                    className="mb-2"
                                    initialValue={Number(data.totalBatch)}
                                >
                                    <Slider
                                        min={1000}
                                        max={10000}
                                        defaultValue={0}
                                        step={1000}
                                        marks={markCreatePoolSlider}
                                        onChange={onChangebBond}
                                        value={Number(data.totalBatch)}
                                    />
                                </Form.Item>
                            </Col> */}
                        </Row>
                    }
                </div>
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

export default SocialMedia;
