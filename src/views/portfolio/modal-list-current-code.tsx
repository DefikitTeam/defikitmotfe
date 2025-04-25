// /* eslint-disable */

// import { useGetInviteCode } from '@/src/stores/invite-code/hook';
// import { IGetInviteCodeResponseItem } from '@/src/stores/invite-code/type';
// import { CopyOutlined } from '@ant-design/icons';
// import { Modal, notification, Table, Tooltip } from 'antd';
// import { ColumnsType } from 'antd/es/table';
// import { useTranslations } from 'next-intl';
// import { useAccount } from 'wagmi';

// const ModalListCurrentCode = () => {
//     const [
//         { inviteCode },
//         fetchGetInviteCode,
//         resetGetInviteCode,
//         setIsOpenModalGetListCurrentCodeAction
//     ] = useGetInviteCode();

//     const { data, status, isOpenModalGetListCurrentCode } = inviteCode;

//     const t = useTranslations();

//     const { address, chain, chainId, isConnected } = useAccount();

//     const handleClose = () => {
//         setIsOpenModalGetListCurrentCodeAction(false);
//     };

//     const handleCopy = (showCode: string | undefined) => {
//         if (!isConnected || !address) {
//             notification.error({
//                 message: 'Error',
//                 description: 'Please connect to your wallet',
//                 duration: 3,
//                 showProgress: true
//             });
//             return;
//         }

//         if (showCode) {
//             navigator.clipboard.writeText(showCode).then(() => {
//                 notification.success({
//                     message: t('SHOW_CODE_COPIED_TO_CLIPBOARD'),
//                     placement: 'top',
//                     duration: 1.2,
//                     showProgress: true
//                 });
//             });
//         }
//     };

//     const columns: ColumnsType<IGetInviteCodeResponseItem> = [
//         {
//             title: t('CODE_REFER'),
//             dataIndex: 'code',
//             width: '5%',
//             className: '!font-forza',
//             align: 'center',
//             render: (_, record) => (
//                 <span className="text-black">
//                     {record.code || ''}

//                     <Tooltip title={t('SHOW_CODE_COPIED_TO_CLIPBOARD')}>
//                         <CopyOutlined
//                             className="ml-2 cursor-pointer text-lg"
//                             onClick={() => handleCopy(record.code as string)}
//                         />
//                     </Tooltip>
//                 </span>
//             )
//         },
//         {
//             title: t('STATUS_CODE_REFER'),
//             dataIndex: 'status',
//             width: '5%',
//             className: '!font-forza',
//             align: 'center',
//             render: (_, record) => (
//                 <span className="text-black">{record.status || ''}</span>
//             )
//         }
//     ];

//     return (
//         <Modal
//             title={
//                 <span className="!font-forza text-lg font-bold">
//                     {t('CURRENT_CODE_INVITE')}
//                 </span>
//             }
//             open={isOpenModalGetListCurrentCode}
//             footer={null}
//             onCancel={handleClose}
//             maskClosable={true}
//             centered
//         >
//             <div className="w-full">
//                 <Table
//                     rowKey="wallet"
//                     dataSource={data}
//                     // @ts-ignore
//                     columns={columns}
//                     className="!font-forza"
//                     pagination={{ pageSize: 1000 }}
//                     scroll={{ x: 200, y: 300 }}
//                     bordered
//                     sortDirections={['descend']}
//                 />
//             </div>
//         </Modal>
//     );
// };

// export default ModalListCurrentCode;
