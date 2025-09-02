'use client';

import Snackbar from '@mui/material/Snackbar';
import styles from './materialToast.module.scss';
import SnackbarContent from '@mui/material/SnackbarContent';
import Link from 'next/link';
import Slide from '@mui/material/Slide';

export interface IToastState {
  open: boolean;
  message: string;
  link?: string;
}

interface IProps {
  open: boolean;
  setOpen: () => void;
  message: string;
  link?: string;
  autoHideDuration?: number;
  vertical?: 'bottom' | 'top';
  horizontal?: 'center' | 'left' | 'right';
}

const MaterialToast = ({
  open,
  setOpen,
  message,
  link,
  autoHideDuration = 3000,
  vertical = 'bottom',
  horizontal = 'center',
}: IProps) => {
  return (
    <Snackbar
      className={styles.toast_container}
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={setOpen}
      slots={{ transition: Slide }}
      autoHideDuration={autoHideDuration}
    >
      <SnackbarContent
        className={styles.toast_content}
        message={message}
        action={
          link && (
            <Link className={styles.toast_move_button} href={link}>
              보러가기
            </Link>
          )
        }
      />
    </Snackbar>
  );
};

export default MaterialToast;
