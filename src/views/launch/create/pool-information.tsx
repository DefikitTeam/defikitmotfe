/* eslint-disable */
import {
    REGEX_DISCORD,
    REGEX_TELEGRAM,
    REGEX_TWITTER,
    REGEX_WEBSITE
} from '@/src/common/constant/constance';
import {
    ACCEPT_AVATAR_TYPES,
    AccountFileType,
    MAX_AVATAR_FILE_SIZE
} from '@/src/common/constant/pool';
import {
    getDateTimeInFormat,
    nextDayFrom,
    nextMinuteFrom
} from '@/src/common/utils/utils';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import { useCreatePoolLaunchInformation } from '@/src/stores/pool/hook';
import { useListTokenOwner } from '@/src/stores/token/hook';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    Modal,
    notification,
    Row,
    Spin,
    Tooltip,
    Typography,
    Upload,
    UploadFile
} from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { RcFile } from 'antd/es/upload';
import { UploadProps } from 'antd/lib';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { IPoolCreatForm } from '.';
import AdvanceConfiguration from './advance-configuration';
import serviceAiGenerate from '@/src/services/external-services/backend-server/ai-generate';
import { base64ToFile } from '@/src/common/lib/utils';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface PoolInforProps {
    form: FormInstance<IPoolCreatForm>;
    getFileAvatar: (a: { file: string | Blob | RcFile; flag: boolean }) => void;
}

const { Text } = Typography;
const PoolInformation = ({ form, getFileAvatar }: PoolInforProps) => {
    const { TextArea } = Input;
    const t = useTranslations();
    const { chainData } = useCurrentChainInformation();
    const startTime = getDateTimeInFormat(nextMinuteFrom(new Date(), 30));
    const endTime = getDateTimeInFormat(
        nextDayFrom(nextMinuteFrom(new Date(), 30), 2)
    );
    const [defaultStartTime, setDefaultStartTime] = useState(startTime);
    const [defaultEndTime, setDefaultEndTime] = useState(endTime);
    const [isStartTime, setIsStartTime] = useState(false);

    const [image, setImage] = useState<string>('');
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingDescription, setLoadingDescription] = useState(false);

    const [checkFileData, setCheckFileData] = useState<{
        fileList: UploadFile[];
        errorWrongFileType?: boolean;
        errorFileSize: boolean;
        errorNoValue: boolean;
    }>({
        fileList: [],
        errorWrongFileType: false,
        errorFileSize: false,
        errorNoValue: false
    });

    const { settingTokenState } = useListTokenOwner();

    const [data, setData] = useCreatePoolLaunchInformation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [promptGenerateImage, setPromptGenerateImage] = useState('');
    const [loadingPromptGenerateImage, setLoadingPromptGenerateImage] =
        useState(false);

    const onChangePromptGenerateImage = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { value } = event.target;
        setPromptGenerateImage(value);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        generateImages(promptGenerateImage);
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (!isStartTime) {
            setIsStartTime(true);
            setData({
                ...data,

                startTime: new Date(startTime).valueOf() / 1000,
                endTime: new Date(endTime).valueOf() / 1000
            });
        }
    }, [isStartTime]);

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

    // upload image
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const beforeUpload = (file: RcFile) => {
        const extension = file?.name.split('.').slice(-1)[0];

        if (!ACCEPT_AVATAR_TYPES.split(',').includes(`.${extension}`)) {
            setCheckFileData({
                ...checkFileData,
                errorWrongFileType: true
            });
            return false;
        }
        if (file.size > Number(MAX_AVATAR_FILE_SIZE) * (1024 * 1024)) {
            setCheckFileData({
                ...checkFileData,
                errorFileSize: true
            });
            return false;
        }
        return true;
    };

    const onUpload =
        (name: 'avatarAccount', fileType: AccountFileType) =>
        async ({ file }: RcCustomRequestOptions) => {
            setCheckFileData({
                ...checkFileData,
                errorNoValue: false
            });
            getFileAvatar({ file: file, flag: true });
        };

    const handleFileChange: UploadProps['onChange'] = (info) => {
        const { fileList: newFileList } = info;
        if (newFileList.length === 0) {
            setCheckFileData({
                ...checkFileData,
                errorNoValue: true
            });
            setFileList(newFileList);
        } else {
            if (newFileList[0].status !== 'error') {
                setFileList([
                    {
                        ...newFileList[0],
                        status: 'done'
                    }
                ]);
                setCheckFileData({
                    ...checkFileData,
                    errorNoValue: false
                });
            } else {
                setFileList([]);
                setCheckFileData({
                    ...checkFileData,
                    errorNoValue: true
                });
            }
        }

        if (info.file.status === 'removed') {
            setCheckFileData({
                ...checkFileData,

                errorFileSize: false,
                errorWrongFileType: false
            });
        }
    };

    useEffect(() => {
        if (fileList.length == 0) {
            setCheckFileData({
                ...checkFileData,
                errorNoValue: true
            });
            getFileAvatar({ file: '', flag: false });
        }
    }, [JSON.stringify(fileList)]);
    const handleKeyPress = (event: any) => {
        const pattern = /^[0-9.]*$/;
        if (!pattern.test(event.key)) {
            event.preventDefault();
        }
    };
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
        );
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{ marginTop: 8 }}
                className="!font-forza text-base"
            >
                {t('UPLOAD')}
            </div>
        </div>
    );

    const onOkDateTime = (value: DatePickerProps['value']) => {};

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs(defaultStartTime);
    };

    const disabledDateLessThanCurrent = (current: any) => {
        const now = dayjs();
        return current && current < now.startOf('day');
    };

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    const disabledDateTime = (current: any) => {
        const now = dayjs();
        if (current && current.isSame(now, 'day')) {
            return {
                disabledHours: () => {
                    return range(0, now.hour());
                },
                disabledMinutes: () => {
                    return current.hour() === now.hour()
                        ? range(0, now.minute() + 1)
                        : [];
                }
            };
        }
        return {
            disabledHours: () => [],
            disabledMinutes: () => []
        };
    };

    const handleOnChangeStartTime = (value: any) => {
        const date = new Date(value);

        setDefaultStartTime(getDateTimeInFormat(date));
        const newStartTime = date.valueOf() / 1000;
        const newEndTime = getDateTimeInFormat(nextDayFrom(date, 2));
        setDefaultEndTime(newEndTime);
        const endTimeDate = new Date(newEndTime);

        setData({
            ...data,
            startTime: newStartTime,
            endTime: endTimeDate.valueOf() / 1000
        });
    };
    const handleOnChangeEndTime = (value: any) => {
        const date = new Date(value);
        const startTime = new Date(defaultStartTime);
        //handle case use pick endTime less than startTime, but i has disiable days that  day less than startTime
        if (date < startTime) {
            notification.error({
                message: t('END_TIME_MUST_GREATER_THAN_START_TIME'),
                duration: 1.3,
                showProgress: true
            });
            return;
        }
        setDefaultEndTime(getDateTimeInFormat(date));
        setData({
            ...data,
            endTime: date.valueOf() / 1000
        });
    };

    const handleImageClick = async (image: string) => {
        const newFile: UploadFile = {
            uid: `rc-upload-${new Date().getTime()}`,
            type: 'image/jpeg',
            status: 'done',
            percent: 0,
            url: `data:image/jpeg;base64,${image}`,
            name: `${new Date().getTime()}.jpeg`,
            lastModified: Date.now(),
            preview: `data:image/jpeg;base64,${image}`,
            lastModifiedDate: new Date(),
            originFileObj: {
                uid: `rc-upload-${new Date().getTime()}`,
                lastModified: Date.now(),
                lastModifiedDate: new Date(),
                name: `${new Date().getTime()}.jpeg`,
                type: 'image/jpeg',
                webkitRelativePath: ''
            } as RcFile
        };

        setFileList([newFile]);
        setPreviewImage(image);
        setPreviewTitle('image.jpeg');

        setCheckFileData({
            ...checkFileData,
            errorNoValue: false,
            errorFileSize: false,
            errorWrongFileType: false
        });

        getFileAvatar({
            file: base64ToFile(
                image,
                `${new Date().getTime()}.jpeg`,
                'image/jpeg'
            ),
            flag: true
        });
    };

    const generateDescription = async (tokenName: string) => {
        try {
            setLoadingDescription(true);
            const promptDescription = `I am creating a blockchain token, give me a short description for this token of about 30 words. The name of the token is ${tokenName}`;
            const response =
                await serviceAiGenerate.generateContent(promptDescription);
            const match = response.data.match(/"([^"]*)"/);
            setData({
                ...data,
                description: match ? match[1] : data.description
            });
        } catch (error) {
            console.log(error);
            notification.error({
                message: 'Error when generate description',
                description: 'Please try again after 30 seconds',
                duration: 3,
                showProgress: true
            });
        } finally {
            setLoadingDescription(false);
        }
    };

    const generateImages = async (prompt: string) => {
        try {
            setLoadingImage(true);
            const image = await serviceAiGenerate.generateImage(prompt);
            setImage(image);
        } catch (error) {
            notification.error({
                message: 'Error when generate image',
                description: 'Please try again after 30 seconds',
                duration: 3,
                showProgress: true
            });
        } finally {
            setLoadingImage(false);
        }
    };

    const generatePromptGenerateImage = async (name: string) => {
        const prompt = `Analyze the token name ${name} and create a complete, unique image prompt for a blockchain token inspired by this name. The image prompt should describe the token's visual essence (e.g., themes of nature, strength, energy) based on the meaning or symbolism of ${name}. Specify colors, textures, and symbolic elements that capture the essence of ${name}. Each element should relate clearly to the theme or characteristics implied by the name, making the token visually distinct and memorable. Focus on conveying the design in a futuristic, high-tech style with detailed descriptions that leave no placeholders. The image prompt should be in a single line.`;

        try {
            setLoadingPromptGenerateImage(true);
            const response = await serviceAiGenerate.generateContent(prompt);
            const match = response.data.match(/"([^"]*)"/);
            setPromptGenerateImage(match ? match[1] : '');
        } catch (error) {
            notification.error({
                message: 'Error when generate prompt',
                description: 'Please try again after 30 seconds',
                duration: 3,
                showProgress: true
            });
        } finally {
            setLoadingPromptGenerateImage(false);
        }
    };

    return (
        <div className="">
            <Row gutter={[8, 10]}>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="mb-0">
                        <span className="!font-forza text-base">
                            {t('POOL_NAME')}
                        </span>

                        <Input
                            size="large"
                            disabled={true}
                            className="!font-forza text-base"
                            style={{
                                color: '#999999',
                                width: '100%',
                                backgroundColor: '#CCCCCC'
                            }}
                            name="name"
                            value={settingTokenState.choicedToken?.name}
                        />
                    </div>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="mb-0">
                        <span className="!font-forza text-base">
                            {t('POOL_SYMBOL')}
                        </span>
                        <Input
                            size="large"
                            disabled={true}
                            name="symbol"
                            className="!font-forza text-base"
                            style={{
                                color: '#999999',
                                width: '100%',
                                backgroundColor: '#CCCCCC'
                            }}
                            value={settingTokenState.choicedToken?.symbol}
                        />
                    </div>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="relative flex items-center gap-2">
                        <TextArea
                            rows={4}
                            size="large"
                            onChange={onChange}
                            value={data.description}
                            name="description"
                            className="!font-forza text-base"
                        />
                        {loadingDescription ? (
                            <Spin className="absolute bottom-2 right-2" />
                        ) : (
                            settingTokenState.choicedToken?.name && (
                                <Button
                                    type="primary"
                                    size="small"
                                    className="absolute bottom-2 right-2 cursor-pointer"
                                    onClick={() =>
                                        generateDescription(
                                            settingTokenState.choicedToken?.name
                                        )
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-wand-sparkles"
                                    >
                                        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
                                        <path d="m14 7 3 3" />
                                        <path d="M5 6v4" />
                                        <path d="M19 14v4" />
                                        <path d="M10 2v2" />
                                        <path d="M7 8H3" />
                                        <path d="M21 16h-4" />
                                        <path d="M11 3H9" />
                                    </svg>
                                </Button>
                            )
                        )}
                    </div>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="mb-0">
                        <span className="!font-forza text-base">
                            <Text className="text-lg text-red-500">* </Text>
                            {t('POOL_UPLOAD_IMAGE')}
                        </span>
                        <div className="flex w-fit items-center justify-between gap-5">
                            <Upload
                                onChange={handleFileChange}
                                fileList={fileList}
                                beforeUpload={beforeUpload}
                                multiple={true}
                                // method="PUT"
                                listType="picture-card"
                                maxCount={1}
                                accept={ACCEPT_AVATAR_TYPES}
                                onPreview={handlePreview}
                                customRequest={onUpload(
                                    'avatarAccount',
                                    AccountFileType.AVATAR
                                )}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            {loadingImage ? (
                                <Spin />
                            ) : image ? (
                                <img
                                    className="size-[100px] rounded-lg border border-solid border-gray-300 shadow-md"
                                    src={`data:image/jpeg;base64,${image}`}
                                    alt="Generated image"
                                    onClick={() => handleImageClick(image)}
                                />
                            ) : null}

                            {!loadingImage &&
                                settingTokenState.choicedToken?.name && (
                                    <>
                                        <Button
                                            className="bg-[#297fd6] !font-forza text-sm text-white"
                                            onClick={showModal}
                                        >
                                            {t('GENERATE_IMAGE')}
                                        </Button>

                                        <Modal
                                            title="Generate Image"
                                            centered
                                            width={1000}
                                            open={isModalOpen}
                                            onOk={handleOk}
                                            onCancel={handleCancelModal}
                                        >
                                            <div className="relative flex items-center gap-2">
                                                <TextArea
                                                    rows={8}
                                                    onChange={
                                                        onChangePromptGenerateImage
                                                    }
                                                    value={promptGenerateImage}
                                                    name="promptGenerateImage"
                                                    className="!font-forza text-base"
                                                    placeholder="Please enter the prompt for generating image"
                                                />
                                                {loadingPromptGenerateImage ? (
                                                    <Spin className="absolute bottom-2 right-2" />
                                                ) : (
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        className="absolute bottom-2 right-2 cursor-pointer"
                                                        onClick={() =>
                                                            generatePromptGenerateImage(
                                                                settingTokenState
                                                                    .choicedToken
                                                                    ?.name
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-wand-sparkles"
                                                        >
                                                            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
                                                            <path d="m14 7 3 3" />
                                                            <path d="M5 6v4" />
                                                            <path d="M19 14v4" />
                                                            <path d="M10 2v2" />
                                                            <path d="M7 8H3" />
                                                            <path d="M21 16h-4" />
                                                            <path d="M11 3H9" />
                                                        </svg>
                                                    </Button>
                                                )}
                                            </div>
                                        </Modal>
                                    </>
                                )}
                        </div>
                        <Modal
                            open={previewOpen}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img
                                alt="example"
                                style={{ width: '100%' }}
                                src={previewImage}
                            />
                        </Modal>
                        <div className="flex flex-col items-start">
                            <Text className="text-black-45">
                                {t('INVITATION_AVATAR_UPLOAD_NOTICE')}
                            </Text>
                            {checkFileData.errorWrongFileType && (
                                <Text className="text-red-500">
                                    {t('WRONG_FILE_TYPE_ERROR_MESSAGE')}
                                </Text>
                            )}
                            {checkFileData.errorFileSize && (
                                <Text className="text-red-500">
                                    {t('FILE_THROUGH_THE_CAPACITY_FOR_UPLOAD')}
                                </Text>
                            )}
                            {checkFileData.errorNoValue && (
                                <Text className="text-red-500">
                                    {t('FIELD_REQUIRED_ERROR_MESSAGE')}
                                </Text>
                            )}
                        </div>
                    </div>
                </Col>
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
                                message: t('INVALID_LINK_ERROR_MESSAGE')
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
                                message: t('INVALID_LINK_ERROR_MESSAGE')
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
                                message: t('INVALID_LINK_ERROR_MESSAGE')
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
                                message: t('INVALID_LINK_ERROR_MESSAGE')
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
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <Form.Item
                        name="fixedCapETH"
                        required
                        label={
                            <span className="!font-forza text-base">
                                {t('POOL_HARDCAP_FOR_BONDING_POOL')}
                                {' ('}
                                {chainData.currency}
                                {' )'}
                                <Tooltip title={t('HARDCAP_HELP')}>
                                    <QuestionCircleOutlined
                                        style={{ marginLeft: '8px' }}
                                    />
                                </Tooltip>
                            </span>
                        }
                        rules={[
                            {
                                validator: async (_, value) => {
                                    if (Number(value) < 0.5) {
                                        return Promise.reject(
                                            new Error(t('INVALID_MIN_VALUE'))
                                        );
                                    }
                                }
                            },
                            {
                                pattern: /^\d+(\.\d+)?$/,
                                message: t('INVALID_NUMBER_FORMAT')
                            }
                        ]}
                        className="mb-0"
                        initialValue={data.fixedCapETH}
                    >
                        <Input
                            onKeyPress={handleKeyPress}
                            size="large"
                            className="!font-forza text-base"
                            name="fixedCapETH"
                            onChange={onChange}
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
                        name="advanceConfig"
                        label={
                            <span className="!font-forza text-base">
                                {t('POOL_ADVANCE_CONFIG')}
                            </span>
                        }
                        className="mb-0"
                    >
                        <AdvanceConfiguration form={form} />
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
                        name="minDurationSell"
                        required
                        label={
                            <span className="!font-forza text-base">
                                {t('MINTING_RELEASE_TIME_(HOURS)')}
                                <Tooltip title={t('MINTING_TIME')}>
                                    <QuestionCircleOutlined
                                        style={{ marginLeft: '8px' }}
                                    />
                                </Tooltip>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: t('FIELD_REQUIRED_ERROR_MESSAGE')
                            },
                            {
                                pattern: /^\d+(\.\d+)?$/,
                                message: t('INVALID_NUMBER_FORMAT')
                            }
                        ]}
                        className="mb-0"
                        initialValue={data.minDurationSell}
                    >
                        <Input
                            className="!font-forza text-base"
                            size="large"
                            name="minDurationSell"
                            onChange={onChange}
                            onKeyPress={handleKeyPress}
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
                    <div className="mb-0">
                        <span className="!font-forza text-base">
                            <Text className="text-lg text-red-500">* </Text>
                            {t('POOL_START_TIME')}
                            <Tooltip title={t('POOL_TIME')}>
                                <QuestionCircleOutlined
                                    style={{ marginLeft: '8px' }}
                                />
                            </Tooltip>
                        </span>
                        <DatePicker
                            name={'START_TIME'}
                            size="large"
                            className="!font-forza text-base"
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: '100%' }}
                            onChange={handleOnChangeStartTime}
                            value={dayjs(defaultStartTime)}
                            allowClear={false}
                            disabledDate={disabledDateLessThanCurrent}
                            disabledTime={disabledDateTime}
                        />
                    </div>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="mb-0">
                        <span className="!font-forza text-base">
                            <Text className="text-lg text-red-500">* </Text>
                            {t('POOL_END_TIME')}
                            <Tooltip title={t('POOL_TIME')}>
                                <QuestionCircleOutlined
                                    style={{ marginLeft: '8px' }}
                                />
                            </Tooltip>
                        </span>

                        <DatePicker
                            name={'END_TIME'}
                            size="large"
                            className="!font-forza text-base"
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: '100%' }}
                            onChange={handleOnChangeEndTime}
                            value={dayjs(defaultEndTime)}
                            disabledDate={disabledDate}
                            allowClear={false}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PoolInformation;
