'use client';

import Flex from '@/components/common/Flex';
import styles from './addressPage.module.scss';
import Text from '@/components/common/Text';
import { useCallback, useEffect, useState } from 'react';
import AddressModal from '@/components/my/address/AddressModal';
import { myService } from '@/services/my';
import { IAddress } from '@/types/address';
import { ADDRESS_INITIAL_VALUE } from '@/constraint/address';
import { useUserStore } from '@/store/userStore';
import { addAddressConversion, addressListMapper, updateAddressConversion } from '@/utils/address';
import MaterialToast, { IToastState } from '@/components/common/MaterialToast';

const AddressPage = () => {
  const { getAddress, addAddress, updateAddress, deleteAddress } = myService;

  const [open, setOpen] = useState(false);
  const [addressList, setAddressList] = useState<IAddress[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<IAddress>(ADDRESS_INITIAL_VALUE);
  const [addressInfo, setAddressInfo] = useState<IAddress>(ADDRESS_INITIAL_VALUE);
  const [modalType, setModalType] = useState<'default' | 'change' | 'add'>('add');
  const [toastOpen, setToastOpen] = useState<IToastState>({
    open: false,
    message: '',
  });

  const { user } = useUserStore();

  const initAddress = useCallback(() => {
    getAddress()
      .then(async (res) => {
        if (res.result) {
          const mapper = await addressListMapper(res.result);

          setAddressList(mapper);
          setDefaultAddress(mapper.filter((item: IAddress) => item.isDefault === true)[0]);
          setOpen(false);
          setAddressInfo(ADDRESS_INITIAL_VALUE);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getAddress]);

  const onClickAddressSave = (selectAddress: IAddress) => {
    if (modalType === 'add') {
      const data = addAddressConversion(addressInfo, user?.id);

      data.userId = user?.id ?? '';

      addAddress(data)
        .then((res) => {
          if (res?.result?.id) {
            setToastOpen({ open: true, message: '주소록 등록이 완료 되었어요!' });
            initAddress();
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    }

    if (modalType === 'change') {
      actionUpdateAddress(selectAddress);
    }
  };

  const onChangeAddressInfo = <K extends keyof IAddress>(key: K, value: IAddress[K]) => {
    setAddressInfo({ ...addressInfo, [key]: value });
  };

  const handleUpdateAddress = (type: 'default' | 'change', addressInfo: IAddress) => {
    setModalType(type);

    if (type === 'default') {
      addressInfo['isDefault'] = true;
      actionUpdateAddress(addressInfo);
    }

    if (type === 'change') {
      setOpen(true);
      setAddressInfo(addressInfo);
    }
  };

  const actionUpdateAddress = (selectAddress: IAddress) => {
    const data = updateAddressConversion(selectAddress, user?.id);

    updateAddress(data)
      .then((res) => {
        if (res) {
          initAddress();
          setToastOpen({ open: true, message: '변경이 완료 되었어요!' });
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const handleDeleteAddress = (id: number) => {
    deleteAddress(id)
      .then((res) => {
        if (res?.result?.message) {
          setToastOpen({ open: true, message: res?.result?.message });
        }

        initAddress();
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  useEffect(() => {
    initAddress();
  }, [initAddress]);

  return (
    <section className={styles.container}>
      <button
        className={styles.address_add_button}
        onClick={() => {
          setOpen(true);
          setModalType('add');
          setAddressInfo(ADDRESS_INITIAL_VALUE);
        }}
      >
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
            ({defaultAddress?.address?.zipCode}) {defaultAddress?.address?.main} {defaultAddress?.detail}
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
              ({item?.address?.zipCode}) {item?.address?.main} {item?.detail}
            </Text>
          </Flex>
          <div className={styles.border_button_wrap}>
            <button className={styles.border_button} onClick={() => handleUpdateAddress('default', item)}>
              기본 배송지
            </button>
            <button
              className={`${styles.border_button} ${styles.border_left}`}
              onClick={() => handleUpdateAddress('change', item)}
            >
              수정
            </button>
            <button
              className={`${styles.border_button} ${styles.border_left}`}
              onClick={() => handleDeleteAddress(item?.id)}
            >
              삭제
            </button>
          </div>
        </Flex>
      ))}

      {open && (
        <AddressModal
          addressInfo={addressInfo}
          modalType={modalType}
          onChangeAddressInfo={onChangeAddressInfo}
          setOpen={setOpen}
          onClickSave={onClickAddressSave}
        />
      )}

      <MaterialToast
        open={toastOpen?.open}
        setOpen={() => setToastOpen({ open: false, message: '' })}
        message={toastOpen?.message}
      />
    </section>
  );
};

export default AddressPage;
