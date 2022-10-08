/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Dimensions,
  Image,
  Touchable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import ScheduleCard from '../components/ScheduleCard';
import BottomComponent from '../components/BottomComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlaneDeparture, faSuitcase} from '@fortawesome/free-solid-svg-icons';
import ReceiptCard from '../components/ReceiptCard';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {configureStore} from '@reduxjs/toolkit';
import AutoHeightImage from 'react-native-auto-height-image';
import Modal from 'react-native-modal';

function ReceiptInfoPage(route: any) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptId, setReceiptId] = useState(route.route.params.receiptId);
  const [receiptInfo, setReceiptInfo] = useState<{
    category: string;
    place_of_payment: string;
    total_price: number;
    memo: string;
    payDate: string;
    img_url: string;
  }>({
    category: '',
    place_of_payment: '',
    total_price: 0,
    memo: '',
    payDate: '2022-03-04T00:09:09.000Z',
    img_url: '', //대체 이미지 추가
  });

  const getReceiptInfo = async () => {
    console.log('receiptId : ', receiptId);
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(
        `http://146.56.188.32:8002/receipts/${receiptId}`,
        {
          headers,
        },
      );
      setReceiptInfo(response.data);
      console.log(receiptInfo);
    } catch (err: AxiosError | any) {
      console.log('receipt error');
      console.log(err);
    }
  };

  useEffect(() => {
    getReceiptInfo();
  }, []);

  return (
    <View style={styles.window}>
      <View style={styles.titleSection}>
        <View style={styles.titleTextSection}>
          <Text style={styles.itemTitle}>{receiptInfo.place_of_payment}</Text>
          <Text style={styles.itemText}>
            {'\n'}
            {receiptInfo.memo}
          </Text>
        </View>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            style={styles.receiptImage}
            source={{uri: receiptInfo.img_url}}
          />
        </Pressable>
      </View>
      <Modal isVisible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text> </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <FontAwesomeIcon
                  style={styles.modalCloseButton}
                  icon={faXmark}
                  size={30}
                />
              </Pressable>
            </View>
            <AutoHeightImage
              width={Dimensions.get('window').width * 0.7}
              source={{uri: receiptInfo.img_url}}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.borderLine} />
      <View style={styles.itemSection}>
        <View style={styles.itemAlign}>
          <Text style={styles.itemText}>결제 시각</Text>
          <Text style={styles.itemText}>
            {receiptInfo.payDate.substring(0, 10)}{' '}
            {receiptInfo.payDate.substring(11, 19)}
          </Text>
        </View>
        <View style={styles.itemAlign}>
          <Text style={styles.itemText}>결제 금액</Text>
          <Text style={styles.itemText}>{receiptInfo.total_price}원</Text>
        </View>
      </View>
      <View style={styles.borderLine} />
      <View style={styles.itemSection}>
        <View style={styles.itemAlign}>
          <Text style={styles.itemText}>결제처</Text>
          <Text style={styles.itemText}>{receiptInfo.place_of_payment}</Text>
        </View>
        <View style={styles.itemAlign}>
          <Text style={styles.itemText}>결제처 구분</Text>
          <Text style={styles.itemText}>{receiptInfo.category}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
  },
  titleSection: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleTextSection: {
    width: Dimensions.get('window').width * 0.55,
    marginLeft: 30,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  receiptImage: {
    width: 95,
    height: 95,
    marginLeft: 10,
    marginRight: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  borderLine: {
    borderWidth: 0.5,
    borderColor: '#A8A8A8',
    width: Dimensions.get('window').width * 0.85,
  },
  itemSection: {
    width: Dimensions.get('window').width,
  },
  itemAlign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  itemTitle: {
    fontFamily: 'Jalnan',
    fontSize: 24,
    color: '#4D483D',
  },
  itemText: {
    fontFamily: 'Jalnan',
    fontSize: 15,
    color: '#4D483D',
  },
  bigReceipt: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: Dimensions.get('window').width * 0.8,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  modalCloseButton: {
    color: '#ACACAC',
  },
});
export default ReceiptInfoPage;
