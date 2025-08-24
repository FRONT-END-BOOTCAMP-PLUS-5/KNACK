'use client';

import Snackbar from '@mui/material/Snackbar';
import styles from './likeToast.module.scss';
import SnackbarContent from '@mui/material/SnackbarContent';
import Link from 'next/link';
import Slide from '@mui/material/Slide';

interface IProps {
  open: boolean;
  setOpen: () => void;
  message: string;
  link?: string;
}

const LikeToast = ({ open, setOpen, message, link }: IProps) => {
  return (
    <Snackbar
      className={styles.toast_container}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      onClose={setOpen}
      slots={{ transition: Slide }}
      autoHideDuration={3000}
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

export default LikeToast;
