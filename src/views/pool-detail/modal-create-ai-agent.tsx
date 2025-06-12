/* eslint-disable */
'use client';
import {
  ACCEPT_AVATAR_TYPES,
  AccountFileType,
  KeyValueObj,
  MAX_AVATAR_FILE_SIZE,
  socialMediaOptions
} from '@/src/common/constant/constance';
import { base64ToFile } from '@/src/common/lib/utils';
import { mapMessageExamples } from '@/src/common/utils/map-example-message';
import MessageReplyByAgent from '@/src/components/common/message-reply-by-agent';
import StyleCommunication from '@/src/components/common/style-communication';
import { useConfig } from '@/src/hooks/useConfig';
import serviceAiAgent from '@/src/services/external-services/backend-server/ai-agent';
import serviceAiGenerate from '@/src/services/external-services/backend-server/ai-generate';
import serviceUpload from '@/src/services/external-services/backend-server/upload';
import { IGenerateDataAiAgentResponse } from '@/src/services/response.type';
import {
  useCreateAiAgentInformation,
  usePoolDetail
} from '@/src/stores/pool/hooks';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Spin,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  Collapse
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const { Text } = Typography;
const ModalCreateAiAgent = () => {
  const params = useParams();
  const poolAddress = params?.poolAddress as string;
  const [
    { poolStateDetail },
    fetchPoolDetail,
    ,
    ,
    ,
    ,
    ,
    setOpenModalSocialScoreAction
  ] = usePoolDetail();
  const { metaDataInfo, socialScoreInfo, dataDetailPoolFromServer } =
    poolStateDetail;

  const { chainConfig } = useConfig();
  const [form] = Form.useForm();
  const [
    data,
    setCreateAiAgentInformationAction,
    resetDataAction,
    setOpenModalCreateAiAgentAction
  ] = useCreateAiAgentInformation();

  const t = useTranslations();
  const { address, isConnected } = useAccount();
  const [technologyOptions, setTechnologyOptions] = useState<KeyValueObj[]>([]);
  const [loadingPromptGenerateImage, setLoadingPromptGenerateImage] =
    useState(false);

  const [loadingGenDataAiAgent, setLoadingGenDataAiAgent] =
    useState<boolean>(false);
  const handleClose = () => {
    setOpenModalCreateAiAgentAction(false);
  };

  const [isLoadingCreateAiAgent, setIsLoadingCreateAiAgent] =
    useState<boolean>(false);

  const [selectedItemsTech, setSelectedItemsTech] = useState<string[]>([]);
  const [selectedItemsSocial, setSelectedItemsSocial] = useState<string[]>([]);

  // upload image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [image, setImage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [promptGenerateImage, setPromptGenerateImage] = useState('');
  const [avatarAiGentInfo, setAvatarAiAgentInfo] = useState<{
    file: string | Blob | RcFile | File;
    flag: boolean;
  }>();

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

  const onChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setCreateAiAgentInformationAction({
      ...data,
      [name]: value
    });
  };

  const handleKeyPress = (event: any) => {
    const pattern = /^[a-zA-Z\s]*$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  };

  const onChangePromptGenerateImage = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setPromptGenerateImage(value);
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

  const generateDataAiAgent = async () => {
    if (!isConnected || !address) {
      notification.error({
        message: 'Error',
        description: 'Please connect to your wallet',
        duration: 3,
        showProgress: true
      });
      return;
    }

    setLoadingGenDataAiAgent(true);
    const response: IGenerateDataAiAgentResponse =
      await serviceAiGenerate.generateDataAiAgent(data?.name ?? '');

    const formattedData = {
      system: response.system?.[0]?.replace(/\"/g, '').trim() || '',
      bio: response.bio?.[0]?.replace(/\"/g, '').trim() || '',
      lore:
        response.lore?.map((item) =>
          item
            .replace(/^\d+\.\s*/, '')
            .replace(/\"/g, '')
            .trim()
        ) || [],

      messageExamples: mapMessageExamples(
        response.messageExamples ?? [],
        data?.name ?? ''
      ),

      postExamples:
        response.postExamples?.map((item) =>
          item
            .replace(/^\d+\.\s*/, '')
            .replace(/\"/g, '')
            .trim()
        ) || [],

      adjectives:
        response.adjectives?.map((item) =>
          item
            .replace(/^\d+\.\s*/, '')
            .replace(/\"/g, '')
            .trim()
        ) || [],
      topics:
        response.topics?.map((item) =>
          item
            .replace(/^\d+\.\s*/, '')
            .replace(/\"/g, '')
            .trim()
        ) || [],
      people:
        response.people?.map((item) =>
          item
            .replace(/^\d+\.\s*/, '')
            .replace(/\"/g, '')
            .trim()
        ) || [],
      plugins:
        response.plugins?.map((item) =>
          item
            .replace(/^\d+\.\s*/, '')
            .replace(/\"/g, '')
            .trim()
        ) || [],
      nameAgent: response.nameAgent?.replace(/\"/g, '').trim() || '',
      settings: {
        secrets: response.settings?.secrets || {},
        voice: {
          model:
            response.settings?.voice?.model?.replace(/\"/g, '').trim() || ''
        }
      }
    };

    try {
      setTechnologyOptions(
        formattedData.topics.map((item, index) => ({
          key: item.trim(),
          value: item.trim()
        }))
      );

      setCreateAiAgentInformationAction({
        ...data,
        system: formattedData.system,
        bio: formattedData.bio,
        lore: formattedData.lore,
        messageExamples: formattedData.messageExamples,
        postExamples: formattedData.postExamples,
        adjectives: formattedData.adjectives
      });
    } catch (error) {
      notification.error({
        message: 'Error when generate data AI Agent',
        description: 'Please try again after 15 seconds',
        duration: 3,
        showProgress: true
      });
      setLoadingGenDataAiAgent(false);
    } finally {
      setLoadingGenDataAiAgent(false);
    }
  };

  const handleCancel = () => setPreviewOpen(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    generateImages(promptGenerateImage);
  };

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
      setAvatarAiAgentInfo({ file: '', flag: false });
    }
  }, [JSON.stringify(fileList)]);

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
  const onUpload =
    (name: 'avatarAccount', fileType: AccountFileType) =>
    async ({ file }: RcCustomRequestOptions) => {
      setCheckFileData({
        ...checkFileData,
        errorNoValue: false
      });
      setAvatarAiAgentInfo({ file: file, flag: true });
    };
  const handleCancelModal = () => {
    setIsModalOpen(false);
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

    setAvatarAiAgentInfo({
      file: base64ToFile(image, `${new Date().getTime()}.jpeg`, 'image/jpeg'),
      flag: true
    });
  };

  useEffect(() => {
    if (!data?.name) {
      resetDataAction();
      setTechnologyOptions([]);
      setSelectedItemsTech([]);
      setSelectedItemsSocial([]);
      form.setFieldsValue({
        topics: [],
        bio: '',
        clients: [],
        name: ''
      });
    }
  }, [data.name]);

  useEffect(() => {
    if (data.bio) {
      form.setFieldsValue({
        bio: data.bio
      });
    }
  }, [data.bio]);

  useEffect(() => {
    if (selectedItemsTech && selectedItemsTech.length > 0) {
      setCreateAiAgentInformationAction({
        ...data,

        topics: selectedItemsTech
      });
    }
  }, [selectedItemsTech]);

  useEffect(() => {
    if (selectedItemsSocial && selectedItemsSocial.length > 0) {
      setCreateAiAgentInformationAction({
        ...data,

        clients: selectedItemsSocial
      });
    }
  }, [selectedItemsSocial]);

  // Effect to update form when data changes
  useEffect(() => {
    form.setFieldsValue({
      name: data.name,
      bio: data.bio,
      topics: selectedItemsTech,
      clientsAgent: selectedItemsSocial
    });
  }, [data, selectedItemsTech, selectedItemsSocial]);

  const onFinish = async () => {
    let urlAiGentAvatar: string = '';
    setIsLoadingCreateAiAgent(true);
    let createAiAgentRes: any;
    try {
      if (avatarAiGentInfo?.flag) {
        const res = await serviceUpload.getPresignedUrlAvatar(
          avatarAiGentInfo?.file as File,
          poolAddress,

          chainConfig?.chainId.toString()!
        );
        urlAiGentAvatar = res;
      }

      const metadata = {
        ...metaDataInfo,
        imageAiAgent: urlAiGentAvatar
      };

      // const metadataPayload = JSON.stringify(data);

      createAiAgentRes = await serviceAiAgent.createAiAgentAfterLaunchPool(
        data,
        poolAddress,
        address as `0x${string}`,
        chainConfig?.chainId.toString()!
      );

      //    @ts-ignore
      if (createAiAgentRes.status === 'success') {
        notification.success({
          message: 'Success',
          description: 'AI Agent created successfully',
          duration: 3,
          showProgress: true
        });
        resetDataAction();
        setOpenModalCreateAiAgentAction(false);
        setIsModalOpen(false);
        setTechnologyOptions([]);
        setSelectedItemsTech([]);
        setSelectedItemsSocial([]);
        form.setFieldsValue({
          topics: [],
          bio: '',
          clientsAgent: [],
          name: ''
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: createAiAgentRes.message,
        duration: 3,
        showProgress: true
      });
    }
  };

  return (
    <Modal
      title={
        <span className="!font-forza text-lg font-bold">{t('AI_AGENT')}</span>
      }
      open={data.isOpenModalCreateAiAgent}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={() => resetDataAction()}>{t('CANCEL')}</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isLoadingCreateAiAgent}
          >
            {t('SUBMIT')}
          </Button>
        </div>
      }
      onCancel={handleClose}
      maskClosable={true}
      centered
    >
      <div className="max-h-[70vh] w-full overflow-y-auto pr-4">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={[4, 8]}>
            <Col
              xs={24}
              sm={24}
              lg={24}
              md={24}
              xxl={24}
            >
              <Form.Item
                name="name"
                label={
                  <span className="!font-forza text-base">
                    {t('NAME_AGENT')}
                  </span>
                }
                className="mb-0"
                initialValue={data?.name}
              >
                <Input
                  name="name"
                  size="large"
                  value={data?.name}
                  placeholder={t('AI_AGENT_NAME')}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                  className="!font-forza text-base"
                />

                {loadingGenDataAiAgent ? (
                  <Spin className="absolute bottom-2 right-2" />
                ) : (
                  data?.name &&
                  address && (
                    <Tooltip title="Click to generate data AI Agent">
                      <Button
                        type="primary"
                        size="small"
                        className="absolute bottom-2 right-2 cursor-pointer"
                        onClick={() => generateDataAiAgent()}
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
                    </Tooltip>
                  )
                )}
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
                name="bio"
                label={
                  <span className="!font-forza text-base">
                    {t('BIO_AGENT')}
                  </span>
                }
                className="mb-0"
                initialValue={data.bio}
              >
                <Input
                  size="large"
                  className="!font-forza text-base"
                  name="bio"
                  value={data.bio}
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
                  {/* <Text className="text-lg text-red-500">
                                            *{' '}
                                        </Text> */}
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
                          {}
                          {loadingPromptGenerateImage ? (
                            <Spin className="absolute bottom-2 right-2" />
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              className="absolute bottom-2 right-2 cursor-pointer"
                              onClick={() =>
                                generatePromptGenerateImage(data?.name ?? '')
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
                  {/* {checkFileData.errorNoValue && (
                                            <Text className="text-red-500">
                                                {t(
                                                    'FIELD_REQUIRED_ERROR_MESSAGE'
                                                )}
                                            </Text>
                                        )} */}
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
                name="clientsAgent"
                label={
                  <span className="!font-forza text-base">
                    {t('CLIENTS_AGENT')}
                  </span>
                }
              >
                <Select
                  mode="multiple"
                  // placeholder={t('type')}
                  value={selectedItemsSocial}
                  onChange={setSelectedItemsSocial}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="label"
                  size="large"
                  options={socialMediaOptions.map((item) => ({
                    value: item.value,
                    label: item.label
                  }))}
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
                name="topics"
                label={
                  <span className="!font-forza text-base">
                    {t('SELECT_TOPIC_AGENT')}
                  </span>
                }
              >
                <Select
                  mode="multiple"
                  value={selectedItemsTech}
                  onChange={setSelectedItemsTech}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="label"
                  size="large"
                  options={technologyOptions.map((item) => ({
                    label: item.value,
                    value: item.key
                  }))}
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
                name="styleCommunication"
                label={
                  <span className="!font-forza text-base">
                    {t('STYLE_COMMUNICATION')}
                    <Tooltip title={t('STYLE_COMMUNICATION_TOOLTIP')}>
                      <QuestionCircleOutlined
                        style={{
                          marginLeft: '8px'
                        }}
                      />
                    </Tooltip>
                  </span>
                }
              >
                <StyleCommunication
                  mode={'create-ai-agent-after-launch-pool'}
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
                name="messageExamples"
                label={
                  <span className="!font-forza text-base">
                    {t('MESSAGE_EXAMPLES')}
                    <Tooltip title={t('MESSAGE_EXAMPLES_TOOLTIP')}>
                      <QuestionCircleOutlined
                        style={{
                          marginLeft: '8px'
                        }}
                      />
                    </Tooltip>
                  </span>
                }
              >
                <MessageReplyByAgent
                  mode={'create-ai-agent-after-launch-pool'}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalCreateAiAgent;
