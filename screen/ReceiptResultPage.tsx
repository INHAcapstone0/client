/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import ParsingItem from '../components/ParsingItem';
import KakaoMap from '../components/KakaoMap';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import axios, {AxiosError} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';

function ReceiptResultPage({navigation, route}: any) {
  const [accessToken, setAccessToken] = useState<string | null>('');
  //유저이름
  const userName = useSelector((state: RootState) => state.persist.user.name);
  const userId = useSelector((state: RootState) => state.persist.user.id);

  //카테고리 모달 visible변수
  const [modalVisible, setModalVisible] = useState(false);

  //추가한 빈칸의 수(아이디로 사용)
  const [emptyInputNumber, setEmptyInputNumber] = useState(0);

  //카테고리 변수
  const [category, setCategory] = useState('선택하기 버튼을 눌러주세요.');

  //선택한 카테고리 변수(확인 누르면 이걸 카테고리에 set)
  const [selectedCategory, setSelectedCategory] = useState('');

  //결제 항목 생략할지에 관한 변수 true:결제항목입력 false:결제항목생략
  const [itemFlag, setItemFlag] = useState(true);

  //결제항목과 결제금액 유효성 변수
  const [totalPriceValidationFlag, setTotalPriceValidationFlag] =
    useState(true);

  //더미데이터
  const [data, setData] = useState(route.params.data.items);

  //결제항목의 이름, 수량, 가격 유효성 변수 / 빈칸이거나 (수량, 가격의 경우)숫자가 아니면 false
  const [itemValidation, setItemValidation] = useState(true);

  //사용자가 입력한 결제한 금액
  const [totalPrice, setTotalPrice] = useState('');

  const [showToast, setShowToast] = useState(false);

  //메모
  const [memo, setMemo] = useState('');

  useEffect(() => {
    loadAccessToken();
  }, []);

  const loadAccessToken = async () => {
    const accessTokenData = await EncryptedStorage.getItem('accessToken');
    setAccessToken(accessTokenData);
  };

  useEffect(() => {
    if (data.length === 0 && itemFlag) {
      addEmptyInput();
    }

    let total = 0;
    route.params.data.items.forEach(
      (item: {price: number}): any => (total += item.price),
    );

    setTotalPrice(total.toString());

    console.log('route.params.data', route.params.data);
    console.log('route.params.data', route.params.data.items);
  }, [data]);

  const uploadReceipt = async () => {
    try {
      const response = await axiosInstance.post(
        `http://146.56.190.78/receipts`,
        {
          schedule_id: route.params.scheduleId,
          poster_id: userId,
          payDate:
            route.params.data.payDate.year +
            route.params.data.payDate.month +
            route.params.data.payDate.day +
            route.params.data.payDate.hour +
            route.params.data.payDate.minute,
          total_price: route.params.data.totalPrice,
          memo: memo,
          place: route.params.data.store.name,
          address: route.params.data.store.addresses,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: '지출정보 등록이 완료되었습니다',
      });
      moveToHomePage();
    } catch (err: AxiosError | any) {
      console.log(err.response);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '지출정보 등록이 실패하였습니다',
      });
    }
  };

  const moveToHomePage = () => {
    setTimeout(() => {
      navigation.navigate('HomePage');
    }, 3000);
  };

  //결제항목과 결제금액 유효성 검사 함수
  const checkValidation = () => {
    //결제항목을 입력한 경우에만 검사
    if (itemFlag) {
      data.map((item: any) => {
        if (!item.name || !item.name.trim()) {
          setItemValidation(false);
        }
        if (!item.quantity || !item.quantity.trim() || isNaN(item.quantity)) {
          setItemValidation(false);
        }
        if (!item.price || !item.price.trim() || isNaN(item.price)) {
          setItemValidation(false);
        }
      });

      if (itemValidation) {
        var calculatedTotalPrice = 0;
        data.map((item: any) => {
          calculatedTotalPrice += Number(item.price) * Number(item.quantity);
        });
        if (calculatedTotalPrice.toString() === totalPrice) {
          setTotalPriceValidationFlag(true);
        } else {
          setTotalPriceValidationFlag(false);
        }
      } else {
        setTotalPriceValidationFlag(false);
      }
    } else {
      setTotalPriceValidationFlag(true);
    }
  };

  //결제항목 추가 함수
  const addEmptyInput = () => {
    setEmptyInputNumber(emptyInputNumber + 1);
    setItemFlag(true);

    setTotalPriceValidationFlag(false);
    setData([
      {
        id: emptyInputNumber.toString(),
        name: '',
        quantity: '',
        price: '',
      },
      ...data,
    ]);
  };

  //결제항목 삭제 함수
  const deleteItem = (name: string) => {
    setData(data.filter((item: any) => item.name !== name));
  };

  //결제항목 생략 함수
  const passFillingItem = () => {
    setData([]);
    setItemFlag(false);
    setTotalPriceValidationFlag(true);
  };

  return (
    <SafeAreaView style={styles.window}>
      <View style={styles.window}>
        <AlertNotificationRoot
          colors={[
            {
              label: '',
              card: '#e5e8e8',
              overlay: '',
              success: '',
              danger: '',
              warning: '',
            },
            {
              label: 'gray',
              card: 'gray',
              overlay: 'gray',
              success: 'gray',
              danger: 'gray',
              warning: 'gray',
            },
          ]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>지출정보 등록</Text>
          </View>
          <ScrollView>
            <View style={styles.itemSection}>
              <Text style={styles.itemTitle}>
                결제한 사람<Text style={styles.redStar}> *</Text>
              </Text>
              <View style={styles.itemContainer}>
                <Text style={styles.itemContent}>{userName}</Text>
              </View>
            </View>
            <View style={styles.borderLine} />
            <View>
              <View style={styles.itemSectionWithButton}>
                <Text style={styles.itemTitle}>결제 항목</Text>
                <Pressable
                  onPress={() => {
                    addEmptyInput();
                  }}
                  style={styles.addButton}>
                  <Text style={styles.addButtonText}>추가하기</Text>
                </Pressable>
              </View>
              {data.map((item: any) => {
                return (
                  <ParsingItem
                    key={item.name}
                    item={item}
                    deleteItem={deleteItem}
                  />
                );
              })}
              {!itemFlag && (
                <View style={styles.passFillingItemSection}>
                  {/* <Text style={styles.passFillingItemText}>
                결제 항목 입력을 생략하고 있어요!
              </Text> */}
                  <Text style={styles.passFillingItemText}>
                    우측 상단의{' '}
                    <Text style={styles.passFillingItemButtonText}>
                      추가하기
                    </Text>{' '}
                    버튼으로
                  </Text>
                  <Text style={styles.passFillingItemText}>
                    언제든지 항목을 추가할 수 있어요!
                  </Text>
                </View>
              )}
              <Pressable
                onPress={() => {
                  passFillingItem();
                }}>
                {/* <Text style={styles.passFillingItemButtonText}>
              결제 항목 입력을 생략하고 싶어요!
            </Text> */}
              </Pressable>
              <View style={styles.itemSection}>
                <Text style={styles.itemTitle}>
                  결제한 금액<Text style={styles.redStar}> *</Text>
                </Text>
                <View style={styles.itemContainer}>
                  <TextInput
                    onChangeText={text => {
                      setTotalPrice(text);
                    }}
                    onBlur={() => {
                      checkValidation();
                    }}
                    placeholder="숫자만 입력해주세요."
                    style={styles.itemContent}
                    value={totalPrice}
                  />
                </View>
                {!totalPriceValidationFlag && (
                  <View>
                    <Text style={styles.totalPriceValidationError}>
                      결제한 금액과 결제 항목들이 일치하지 않습니다.
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.borderLine} />
            <View style={styles.itemSectionWithButton}>
              <Text style={styles.itemTitle}>
                결제처<Text style={styles.redStar}> *</Text>
              </Text>
              {/* <Pressable onPress={() => {}} style={styles.addButton}>
            <Text style={styles.addButtonText}>찾아보기</Text>
          </Pressable> */}
            </View>
            <View style={styles.itemContainer2}>
              <Text style={styles.itemContent}>
                {route.params.data.store.name}
              </Text>
            </View>
            <View style={styles.itemSectionWithButton}>
              <Text style={styles.itemTitle}>
                결제처 구분<Text style={styles.redStar}> *</Text>
              </Text>
              {/* <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>선택하기</Text>
          </Pressable> */}
            </View>
            <View style={styles.itemContainer3}>
              <Text style={styles.itemContent}>
                {route.params.data.store.category}
              </Text>
            </View>
            <View style={styles.borderLine} />
            <View style={styles.itemSection}>
              <Text style={styles.itemTitle}>메모</Text>
              <KeyboardAvoidingView style={styles.memoContainer}>
                <TextInput
                  onChangeText={text => {
                    setMemo(text);
                  }}
                  placeholder="50자 내로 입력해주세요."
                  style={styles.itemContent}
                  value={memo}
                  maxLength={50}
                  multiline={true}
                />
              </KeyboardAvoidingView>
            </View>
            <View style={styles.itemSection}>
              <TouchableOpacity activeOpacity={0.8} onPress={uploadReceipt}>
                <Text style={styles.uploadButtonText}>등록하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </AlertNotificationRoot>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webview: {
    height: 300,
    width: 300,
  },
  window: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21B8CD',
    height: 60,
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  borderLine: {
    height: 1,
    backgroundColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.9,
    marginLeft: 17,
    marginRight: 17,
  },
  itemSection: {
    marginTop: 30,
    marginBottom: 30,
    marginRight: 17,
    marginLeft: 17,
  },
  itemSectionWithButton: {
    marginTop: 20,
    marginBottom: 20,
    marginRight: 17,
    marginLeft: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  itemContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: 44,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
  },
  itemContainer2: {
    width: Dimensions.get('window').width * 0.9,
    height: 44,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
    marginLeft: 17,
    marginBottom: 20,
  },
  itemContainer3: {
    width: Dimensions.get('window').width * 0.9,
    height: 44,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
    marginLeft: 17,
    marginBottom: 30,
  },
  memoContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: 60,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
  },
  itemContent: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: 'black',
    marginLeft: 10,
  },
  addButton: {
    borderRadius: 8,
    backgroundColor: '#21B8CD',
    width: 70,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: 'white',
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
  modalHeader: {
    width: Dimensions.get('window').width * 0.7,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderText: {
    color: '#21B8CD',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBody: {
    marginTop: 5,
    marginBottom: 20,
  },
  modalCloseButton: {
    height: 45,
    backgroundColor: '#21B8CD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  categorySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedCategoryButton: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21B8CD',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  unselectedCategoryButton: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#21B8CD',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  selectedCategoryText: {color: 'white'},
  unselectedCategoryText: {color: '#21B8CD'},
  passFillingItemSection: {
    height: 150,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  passFillingItemText: {
    color: 'black',
  },
  passFillingItemButtonText: {
    color: '#21B8CD',
  },
  redStar: {
    color: 'red',
  },
  totalPriceValidationError: {
    marginTop: 8,
    color: 'red',
    fontSize: 11,
  },
  uploadButton: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21B8CD',
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default ReceiptResultPage;
