/* eslint-disable */
'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from 'antd';
import { usePoolDetail } from '@/src/stores/pool/hooks';
const ModalSocialScore = () => {
  const t = useTranslations();
  const [{ poolStateDetail }, , , , , , , setOpenModalSocialScoreAction] =
    usePoolDetail();
  const { socialScoreInfo } = poolStateDetail;

  const handleClose = () => {
    setOpenModalSocialScoreAction(false);
  };

  return (
    <div>
      <Modal
        title={
          <span className="!font-forza text-base font-bold">
            {t('SOCIAL_SCORE')}
          </span>
        }
        open={poolStateDetail.openModalSocialScore}
        footer={null}
        onCancel={handleClose}
        maskClosable={true}
        centered
        width={320}
        className="social-score-modal"
      >
        <div className="space-y-3 !font-forza text-base">
          <div className="flex justify-between">
            <span>Posts:</span>
            <span className="font-bold">{socialScoreInfo?.post ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Reactions:</span>
            <span className="font-bold">{socialScoreInfo?.react ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Comments:</span>
            <span className="font-bold">{socialScoreInfo?.comment ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Shares:</span>
            <span className="font-bold">{socialScoreInfo?.share ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Views:</span>
            <span className="font-bold">{socialScoreInfo?.view ?? 0}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ModalSocialScore;
