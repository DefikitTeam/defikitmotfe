/* eslint-disable */
'use client';
import {
  ACCEPT_AVATAR_TYPES,
  AccountFileType,
  MAX_AVATAR_FILE_SIZE
} from '@/src/common/constant/constance';

import { base64ToFile } from '@/src/common/lib/utils';
import {
  getDateTimeInFormat,
  nextDayFrom,
  nextMinuteFrom
} from '@/src/common/utils/utils';
import { useConfig } from '@/src/hooks/useConfig';
import serviceAiGenerate from '@/src/services/external-services/backend-server/ai-generate';
import { useCreatePoolLaunchInformation } from '@/src/stores/pool/hooks';
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
import AdditionalAgent from './additional-agent';
import AdvanceConfiguration from './advance-configuration';
import SocialMedia from './social_media';

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
  getFileAiAgentAvatar: (a: {
    file: string | Blob | RcFile;
    flag: boolean;
  }) => void;
}

const { Text } = Typography;
const PoolInformation = ({
  form,
  getFileAvatar,
  getFileAiAgentAvatar
}: PoolInforProps) => {
  const { TextArea } = Input;
  const t = useTranslations();

  const startTime = getDateTimeInFormat(nextMinuteFrom(new Date(), 30));
  const endTime = getDateTimeInFormat(
    nextDayFrom(nextMinuteFrom(new Date(), 30), 2)
  );
  const [defaultStartTime, setDefaultStartTime] = useState(startTime);
  const [defaultEndTime, setDefaultEndTime] = useState(endTime);

  const [image, setImage] = useState<string>('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [checkStartInit, setCheckStartInit] = useState(false);
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
  // const chainData = useSelector(
  //     (state: RootState) => state.chainData.chainData
  // );

  const { chainConfig, getHardCapInitial, getDexInfo, getMinHardcap } =
    useConfig();
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
    const startDate = new Date(startTime).valueOf() / 1000;
    const endDate = new Date(endTime).valueOf() / 1000;

    setData({
      ...data,
      startTime: startDate,
      endTime: endDate
    });
  }, [data.name]);

  useEffect(() => {
    setData({
      ...data,
      fixedCapETH: getHardCapInitial(chainConfig?.chainId || 0).toString()
    });

    form.setFieldValue(
      'fixedCapETH',
      getHardCapInitial(chainConfig?.chainId || 0).toString()
    );
  }, [chainConfig?.chainId]);

  const onChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value
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

  const handleKeyPressName = (event: any) => {
    const pattern = /^[a-zA-Z\s]*$/;
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

  const onOkDateTime = (value: DatePickerProps['value']) => { };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs(defaultStartTime);
  };

  const disabledDateLessThanCurrent = (current: any) => {
    const now = dayjs();
    return current && current < now.startOf('day');
  };

  const { isConnected, address } = useAccount();

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
    if (!isConnected || !address) {
      notification.error({
        message: 'Error',
        description: 'Please connect to your wallet',
        duration: 3,
        showProgress: true
      });
      return;
    }

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
      file: base64ToFile(image, `${new Date().getTime()}.jpeg`, 'image/jpeg'),
      flag: true
    });
  };

  const generateDescription = async (tokenName: string) => {
    if (!isConnected || !address) {
      notification.error({
        message: 'Error',
        description: 'Please connect to your wallet',
        duration: 3,
        showProgress: true
      });
      return;
    }

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
    if (!isConnected || !address) {
      notification.error({
        message: 'Error',
        description: 'Please connect to your wallet',
        duration: 3,
        showProgress: true
      });
      return;
    }

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

  const [validateInput, setValidateInput] = useState({
    totalSupply: {
      error: false,
      helperText: ''
    }
  });
  const handleValueChange = (value: any, name: any) => {
    let validateTotalSupply = false;
    let validateTotalSupplyHelperText = '';

    if (value !== undefined && parseInt(value) > 0) {
      validateTotalSupply = false;
      validateTotalSupplyHelperText = '';

      setData({
        ...data,
        [name]: value.trim()
      });
    } else if (value === undefined || parseInt(value) <= 0) {
      validateTotalSupply = true;
      validateTotalSupplyHelperText = t('PLEASE_INPUT_YOUR_TOKEN_TOTAL_SUPPLY');
    }
    setValidateInput({
      ...validateInput,
      totalSupply: {
        error: validateTotalSupply,
        helperText: validateTotalSupplyHelperText
      }
    });
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
          <Form.Item
            name="name"
            label={<span className="!font-forza text-base ">{t('NAME')}</span>}
            required
            rules={[
              {
                required: true,
                message: t('PLEASE_INPUT_YOUR_TOKEN_NAME')
              }
            ]}
            className="mb-1 !font-forza text-base"
            initialValue={data.name}
          >
            <Input
              name="name"
              size="large"
              value={data.name}
              placeholder={t('TOKEN_NAME')}
              onChange={onChange}
              className="!font-forza text-base"
              onKeyPress={handleKeyPressName}
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
            name="symbol"
            label={
              <span className="!font-forza text-base ">{t('SYMBOL')}</span>
            }
            required
            rules={[
              {
                required: true,
                message: t('PLEASE_INPUT_YOUR_TOKEN_SYMBOL')
              }
            ]}
            className="mb-0"
            initialValue={data.symbol}
          >
            <Input
              name="symbol"
              value={data.symbol}
              size="large"
              onChange={onChange}
              placeholder={t('SYMBOL')}
              onKeyPress={handleKeyPressName}
              className="!font-forza text-base"
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
                    <div className="mb-1 flex flex-col gap-1">
                        <span className="!font-forza text-base">
                            <Text className="text-lg text-red-500">* </Text>
                            {t('TOTAL_SUPPLY')}
                        </span>

                        <CurrencyInput
                            name="totalSupply"
                            placeholder={t('TOTAL_SUPPLY')}
                            defaultValue={data.totalSupply}
                            decimalsLimit={2}
                            // value={data.totalSupply}
                            onValueChange={(value, name) =>
                                handleValueChange(value, name)
                            }
                            groupSeparator=","
                            decimalSeparator="."
                            className="!font-forza text-base focus:border-[#1677FF] focus:outline-none"
                            style={{
                                width: '100%',
                                padding: '5px 12px',
                                height: '40px',
                                border: 'solid 1px #ccc',
                                borderRadius: '5px'
                            }}
                        />
                        {validateInput.totalSupply.error === true && (
                            <Text className="text-red-500">
                                {validateInput.totalSupply.helperText}
                            </Text>
                        )}
                    </div>
                </Col> */}

        <Col
          xs={24}
          sm={24}
          lg={24}
          md={24}
          xxl={24}
        >
          <div className="mb-1 flex flex-col gap-1">
            <span className="!font-forza text-base">
              {/* <Text className="text-lg text-red-500">* </Text> */}
              {t('DESCRIPTION')}
            </span>
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
                data.name && (
                  <Button
                    type="primary"
                    size="small"
                    className="absolute bottom-2 right-2 cursor-pointer"
                    onClick={() => generateDescription(data.name)}
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

              {!loadingImage && data.name && (
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
                        onChange={onChangePromptGenerateImage}
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
            name="socialMedia"
            label={
              <span className="!font-forza text-base">{t('SOCIAL_MEDIA')}</span>
            }
            className="mb-0"
          >
            <SocialMedia form={form} />
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
                {chainConfig?.currency}
                {' )'}
                <Tooltip
                  title={`${t('PREFIX_HARDCAP_HELP')} ${getDexInfo(chainConfig?.chainId || 0)?.name || ''} ${t('SUFFIX_HARDCAP_HELP')}`}
                >
                  <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
                </Tooltip>
              </span>
            }
            rules={[
              {
                validator: async (_, value) => {
                  const numValue = Number(value);
                  const chainId = Number(chainConfig?.chainId);
                  const config = getMinHardcap(chainId);

                  if (config && numValue < config.min) {
                    return Promise.reject(new Error(config.error));
                  }

                  return Promise.resolve();
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
                  <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
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
              // {
              //     validator: async (_, value) => {
              //         if (value && Number(value) < 0.01) {
              //             return Promise.reject(
              //                 new Error(
              //                     t(
              //                         'MINTING_RELEASE_TIME_MIN_ERROR',
              //                         {
              //                             min: '0.6' // 0.01 * 60 minutes
              //                         }
              //                     )
              //                 )
              //             );
              //         }
              //         return Promise.resolve();
              //     }
              // }
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
          <Form.Item
            name="bondBuyFirst"
            // required
            label={
              <span className="!font-forza text-base">
                {t('CREATOR_BUY_BOND')}
                <Tooltip
                  title={
                    <>
                      {t('BUY_BOND_FIRST_TOOLTIP_LINE1')}
                      <br />
                      {t('BUY_BOND_FIRST_TOOLTIP_LINE2')}
                    </>
                  }
                >
                  <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
                </Tooltip>
              </span>
            }
            rules={[
              // {
              //     required: true,
              //     message: t('FIELD_REQUIRED_ERROR_MESSAGE')
              // },
              {
                pattern: /^\d+(\.\d+)?$/,
                message: t('INVALID_NUMBER_FORMAT')
              },
              {
                validator: async (_, value) => {
                  const numValue = Number(value);
                  if (numValue > data.totalBatch) {
                    return Promise.reject(
                      new Error(
                        t('VALUE_MUST_BE_LESS_THAN_OR_EQUAL_TO_TOTAL_BATCH')
                      )
                    );
                  }
                  return Promise.resolve();
                }
              }
            ]}
            className="mb-0"
            initialValue={data.bondBuyFirst}
          >
            <Input
              className="!font-forza text-base"
              size="large"
              name="bondBuyFirst"
              onChange={(e) => {
                const value = e.target.value;
                // Chỉ cho phép nhập số
                if (!/^\d*$/.test(value)) {
                  return;
                }
                // Kiểm tra giá trị số
                const numValue = Number(value);
                if (numValue <= data.totalBatch) {
                  onChange(e);
                }
              }}
              onKeyPress={handleKeyPress}
              maxLength={String(data.totalBatch).length}
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
                <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
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
                <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
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

        <Col
          xs={24}
          sm={24}
          lg={24}
          md={24}
          xxl={24}
        >
          <Form.Item
            name="addtionAgent"
            label={
              <span className="!font-forza text-base">
                {t('AI_AGENT')}
                <Tooltip title={t('AI_AGENT_TOOLTIP')}>
                  <QuestionCircleOutlined
                    style={{
                      marginLeft: '8px'
                    }}
                  />
                </Tooltip>
              </span>
            }
            className="mb-0"
          >
            <AdditionalAgent
              form={form}
              getFileAiAgentAvatar={getFileAiAgentAvatar}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default PoolInformation;
