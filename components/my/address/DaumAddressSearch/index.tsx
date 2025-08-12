'use client';

import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import styles from './daumAddressSearch.module.scss';

interface IProps {
  handleComplete: (address: Address) => void;
}

const DaumAddressSearch = ({ handleComplete }: IProps) => {
  return (
    <div className={styles.container}>
      <DaumPostcodeEmbed onComplete={handleComplete} />
    </div>
  );
};

export default DaumAddressSearch;
