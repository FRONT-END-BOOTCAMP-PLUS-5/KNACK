'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import styles from './bottom_sheet.module.scss';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import Image from 'next/image';
import closeLarge from '@/public/icons/close_large.svg';
import Flex from '../Flex';
import Text from '../Text';

interface IProps {
  children: React.ReactNode;
  title?: string;
  height?: 'small' | 'medium' | 'large' | 'full';
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  showHandle?: boolean;
  style?: React.CSSProperties;
  isCloseButton?: boolean;
}

export default function BottomSheet({
  children,
  title,
  height = 'large',
  showOverlay = true,
  closeOnOverlayClick = true,
  showHandle = true,
  style,
  isCloseButton = true,
}: IProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { isOpen, onClose } = useBottomSheetStore();

  const getHeightValue = () => {
    switch (height) {
      case 'small':
        return '40vh';
      case 'medium':
        return '60vh';
      case 'large':
        return '80vh';
      case 'full':
        return '100vh';
      default:
        return '60vh';
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 20;
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    const shouldClose = offset > threshold || velocity > 20 || (velocity >= 0 && velocity > 45);

    if (shouldClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.bottom_sheet_container}>
          {showOverlay && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleOverlayClick}
            />
          )}

          <motion.div
            ref={sheetRef}
            className={styles.bottom_sheet}
            style={{ height: getHeightValue() }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 40,
              stiffness: 400,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
          >
            {showHandle && (
              <div className={styles.handle}>
                <div className={styles.handle_bar} />
              </div>
            )}

            {title && (
              <div className={styles.header}>
                <Flex justify="center" paddingVertical={16}>
                  <Text tag="h2" size={1.8} weight={600}>
                    {title}
                  </Text>
                </Flex>
                {isCloseButton && (
                  <button className={styles.close_button} onClick={onClose} aria-label="닫기">
                    <Image src={closeLarge} alt="닫기" width={24} height={24} />
                  </button>
                )}
              </div>
            )}

            <div className={styles.content} style={style}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
