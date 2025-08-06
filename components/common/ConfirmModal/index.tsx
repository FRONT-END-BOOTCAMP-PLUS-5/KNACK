'use client';

import Button from '../Button';
import Flex from '../Flex';
import styles from './confirmModal.module.scss';

interface IProps {
  children: React.ReactNode;
  open: boolean;
  approveText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({ children, open, approveText = '확인', cancelText = '취소', onConfirm, onClose }: IProps) => {
  if (!open) return;

  return (
    <section className={styles.modal_wrap}>
      <div className={styles.modal_dim} onClick={onClose} />
      <div className={styles.modal_container}>
        <section className={styles.content}>{children}</section>
        <Flex gap={8} paddingVertical={24}>
          <Button size="large" text={cancelText} onClick={onClose} />
          <Button size="large" style="black" text={approveText} onClick={onConfirm} />
        </Flex>
      </div>
    </section>
  );
};

export default ConfirmModal;
