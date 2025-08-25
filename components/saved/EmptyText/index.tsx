'use client';

import Flex from '@/components/common/Flex';
import styles from './emptyText.module.scss';
import Text from '@/components/common/Text';
import Link from 'next/link';

interface IProps {
  mainText?: string;
  subText?: string;
  buttonText?: string;
  url?: string;
}

const EmptyText = ({ mainText, subText, buttonText, url }: IProps) => {
  return (
    <Flex direction="column" align="center" justify="center" paddingVertical={56}>
      <Text size={1.4} weight={600} marginBottom={4}>
        {mainText}
      </Text>
      <Text size={1.3} color="gray3">
        {subText}
      </Text>
      {buttonText && (
        <Link className={styles.link_button} href={'/' + url}>
          {buttonText}
        </Link>
      )}
    </Flex>
  );
};

export default EmptyText;
