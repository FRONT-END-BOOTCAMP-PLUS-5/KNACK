'use client';

import Flex from '@/components/common/Flex';
import styles from './addressPage.module.scss';
import Text from '@/components/common/Text';
import { useCallback, useEffect, useState } from 'react';
import AddressModal from '@/components/my/address/AddressModal';
import { myService } from '@/services/my';
import { IAddress, IAddressInput } from '@/types/address';
import { ADDRESS_INITIAL_VALUE } from '@/constraint/address';
import { useUserStore } from '@/store/userStore';

const AddressPage = () => {
  const { getAddress, addAddress } = myService;

  const [open, setOpen] = useState(false);
  const [addressList, setAddressList] = useState<IAddress[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<IAddressInput>(ADDRESS_INITIAL_VALUE);
  const [addressInfo, setAddressInfo] = useState<IAddressInput>(ADDRESS_INITIAL_VALUE);

  const { user } = useUserStore();

  const initAddress = useCallback(() => {
    getAddress()
      .then((res) => {
        if (res.result) {
          setAddressList(res.result);
          setDefaultAddress(res?.result.filter((item: IAddress) => item.isDefault === true)[0]);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getAddress]);

  const onClickAddressSave = () => {
    console.log('addressInfo', addressInfo);

    const data = {
      userId: user?.id ?? '',
      detail: addressInfo?.detail,
      isDefault: addressInfo?.isDefault,
      message: addressInfo?.message,
      name: addressInfo?.name,
      phone: addressInfo?.phone,
      main: addressInfo?.address?.main,
      zipCode: addressInfo?.address?.zipCode,
    };

    data.userId = user?.id ?? '';

    console.log('data', data);

    addAddress(data)
      .then((res) => {
        console.log('res', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const onChangeAddressInfo = (key: keyof IAddressInput, value: string | boolean | object) => {
    setAddressInfo({ ...addressInfo, [key]: value });
  };

  useEffect(() => {
    initAddress();
  }, [initAddress]);

  return (
    <section className={styles.container}>
      <button className={styles.address_add_button} onClick={() => setOpen(true)}>
        <Text size={1.6}>+ 새 주소 추가하기</Text>
      </button>
      {defaultAddress && defaultAddress?.id !== 0 && (
        <Flex className={styles.address_info} direction="column" paddingVertical={16}>
          <Flex align="center">
            <Text size={1.5} weight={700}>
              {defaultAddress?.name}
            </Text>
            <Text
              className={styles.address_badge}
              size={1.2}
              paddingLeft={6}
              paddingRight={6}
              paddingBottom={3}
              paddingTop={3}
              marginLeft={4}
            >
              기본 배송지
            </Text>
          </Flex>
          <Text size={1.5} paddingTop={6}>
            {defaultAddress?.phone}
          </Text>
          <Text size={1.4} paddingTop={6}>
            ({defaultAddress?.isDefault}) {defaultAddress?.address?.main} {defaultAddress?.detail}
          </Text>
          <div className={styles.button_wrap}>
            <button className={styles.text_button}>수정</button>
            <button className={`${styles.text_button} ${styles.border_before}`}>삭제</button>
          </div>
        </Flex>
      )}
      {addressList?.map((item) => (
        <Flex key={item?.id} direction="column" className={styles.address_list} marginVertical={16}>
          <Flex direction="column">
            <Text size={1.5} weight={700}>
              {item?.name}
            </Text>
            <Text paddingTop={6} size={1.5}>
              {item?.phone}
            </Text>
            <Text paddingTop={6} size={1.4}>
              ({item?.zipCode}) {item?.main} {item?.detail}
            </Text>
          </Flex>
          <div className={styles.border_button_wrap}>
            <button className={styles.border_button}>기본 배송지</button>
            <button className={`${styles.border_button} ${styles.border_left}`}>수정</button>
            <button className={`${styles.border_button} ${styles.border_left}`}>삭제</button>
          </div>
        </Flex>
      ))}

      {open && (
        <AddressModal
          addressInfo={addressInfo}
          onChangeAddressInfo={onChangeAddressInfo}
          setOpen={setOpen}
          onClickSave={onClickAddressSave}
        />
      )}
    </section>
  );
};

export default AddressPage;
