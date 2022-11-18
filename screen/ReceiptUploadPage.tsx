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
  Button,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import PurchaseItem from '../components/PurchaseItem';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import KakaoMap from '../components/KakaoMap';
import axios, {AxiosError} from 'axios';
import DatePicker from 'react-native-date-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';
import {Calendar} from 'react-native-calendars';
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Toast,
} from 'react-native-alert-notification';

interface selectDateType {
  [key: string]: {[key: string]: boolean};
}
interface itemData {
  receipt_id: string;
  quantity: string;
  price: string;
  name: string;
}

function ReceiptUploadPage({route, navigation}: any) {
  const userName = useSelector((state: RootState) => state.persist.user.name);

  const userId = useSelector((state: RootState) => state.persist.user.id);

  const [scheduleId, setScheduleId] = useState(route.params.scheduleId);

  //장소 찾기 모달 visible
  const [placeModalVisible, setPlaceModalVisible] = useState(false);

  //장소 변수
  const [place, setPlace] = useState('찾아보기 버튼을 눌러주세요.');

  const [placeAddress, setPlaceAddress] = useState('');

  const [placeTel, setPlaceTel] = useState('');

  //장소 검색어
  const [placeKeyword, setPlaceKeyword] = useState('');

  //카테고리 선택 모달 visible
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  //카테고리 변수
  const [category, setCategory] = useState('선택하기 버튼을 눌러주세요.');

  //선택한 카테고리 변수(확인 누르면 이걸 카테고리에 set)
  const [selectedCategory, setSelectedCategory] = useState('');

  //추가한 빈칸의 수(아이디로 사용)
  const [emptyInputNumber, setEmptyInputNumber] = useState(1);

  //결제 항목 생략할지에 관한 변수 true:결제항목입력 false:결제항목생략
  const [itemFlag, setItemFlag] = useState(true);

  //결제항목과 결제금액 유효성 변수
  const [totalPriceValidationFlag, setTotalPriceValidationFlag] =
    useState(true);

  const [itemData, setItemData] = useState([
    {
      receipt_id: '',
      name: '',
      quantity: '',
      price: '',
    },
  ]);

  //아이템데이터
  const [data, setData] = useState([
    {
      id: '1',
      name: '',
      quantity: '',
      price: '',
    },
  ]);
  const [searchedPlaces, setSearchedPlaces] = useState([]);
  //결제항목의 이름, 수량, 가격 유효성 변수 / 빈칸이거나 (수량, 가격의 경우)숫자가 아니면 false
  const [itemValidation, setItemValidation] = useState(true);

  //사용자가 입력한 결제한 금액
  const [totalPrice, setTotalPrice] = useState('');

  //메모
  const [memo, setMemo] = useState('');

  const [payDate, setPayDate] = useState('');

  const [isPayDateModalVisible, setIsPayDateModalVisible] = useState(false);

  const togglePayDateModal = () => {
    setIsPayDateModalVisible(!isPayDateModalVisible);
  };

  const [payTime, setPayTime] = useState(new Date());

  const [payDateForRequest, setPayDateForRequest] = useState('');

  const [isPayTimeModalVisible, setIsPayTimeModalVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState<selectDateType>({});

  const togglePayTimeModal = (state: boolean) => {
    setIsPayTimeModalVisible(state);
  };

  const checkValidation = () => {
    if (placeAddress === '') {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '결제처를 입력해주세요',
      });
    } else if (totalPrice === '') {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '결제한 금액을 입력해주세요',
      });
    } else if (!totalPriceValidationFlag) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '결제 항목과 결제 금액이 일치하지 않습니다',
      });
    } else if (payDate === '') {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '결제 날짜를 선택해주세요',
      });
    } else if (category.length > 10) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '결제처 구분을 선택해주세요',
      });
    } else {
      uploadReceipt(
        payDate.substring(0, payDate.indexOf('-')) +
          payDate.substring(
            payDate.indexOf('-') + 1,
            payDate.indexOf('-') + 3,
          ) +
          payDate.substring(
            payDate.lastIndexOf('-') + 1,
            payDate.lastIndexOf('-') + 3,
          ) +
          payTime
            .toISOString()
            .substring(
              payTime.toISOString().indexOf('T') + 1,
              payTime.toISOString().indexOf('T') + 3,
            ) +
          payTime
            .toISOString()
            .substring(
              payTime.toISOString().indexOf(':') + 1,
              payTime.toISOString().indexOf(':') + 3,
            ),
      );
    }
    //주소 날짜시간 가격
  };

  //결제항목과 결제금액 유효성 검사 함수
  const checkPriceValidation = () => {
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
        id: (emptyInputNumber + 1).toString(),
        name: '',
        quantity: '',
        price: '',
      },
      ...data,
    ]);
    setItemData([]);
  };

  //결제항목 삭제 함수
  const deleteItem = (id: string) => {
    setData(data.filter(item => item.id !== id));
    setItemData([]);
  };

  //결제항목 생략 함수
  const passFillingItem = () => {
    setData([]);
    setItemData([]);
    setItemFlag(false);
    setTotalPriceValidationFlag(true);
  };

  const searchPlace = async (keyword: string) => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get(
        `http://146.56.190.78/extra/kakao?query=${keyword}`,
        {
          headers,
        },
      );
      setSearchedPlaces(response.data.documents);
    } catch (err: AxiosError | any) {
      console.log(err);
    }
  };

  const mapViewRef = useRef<WebView>(null);
  const drawMap = (address: string) => {
    mapViewRef.current?.postMessage(address);
  };

  const addSelectedDate = (date: string) => {
    const newDate: any = {};
    newDate[date] = {selected: true};
    setSelectedDate({...newDate});

    setPayDate(date);
  };

  const moveToHomePage = () => {
    setTimeout(() => {
      navigation.navigate('HomePage');
    }, 3000);
  };

  const uploadReceipt = async (payDateParam: string) => {
    const accessToken = await EncryptedStorage.getItem('accessToken');
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const body = {
        schedule_id: scheduleId,
        poster_id: userId,
        payDate: payDateParam,
        total_price: totalPrice,
        memo: memo,
        place: place,
        address: placeAddress,
        category: category,
        tel: placeTel,
      };
      const response = await axiosInstance.post(
        `http://146.56.190.78/receipts`,
        body,
        {
          headers,
        },
      );

      if (itemFlag) {
        uploadItems(response.data.id);
      } else {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: '지출정보 등록이 완료되었습니다',
        });
        moveToHomePage();
      }
    } catch (err: AxiosError | any) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '지출정보 등록에 실패하였습니다',
      });
    }
  };

  const uploadItems = async (receiptId: string) => {
    const accessToken = await EncryptedStorage.getItem('accessToken');
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const items: itemData[] = [];

      data.filter(item =>
        itemData.push({
          receipt_id: receiptId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        }),
      );

      const response = await axiosInstance.post(
        `http://146.56.190.78/items/many`,
        itemData,
        {
          headers,
        },
      );
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: '지출정보 등록이 완료되었습니다',
      });
      moveToHomePage();
    } catch (err: AxiosError | any) {
      console.log(err);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '지출정보 등록에 실패하였습니다',
      });
    }
  };

  useEffect(() => {
    if (data.length === 0 && itemFlag) {
      addEmptyInput();
    }
  }, [data]);

  return (
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
            <View style={styles.itemComponent}>
              <Text style={styles.itemTitle}>
                결제한 사람<Text style={styles.redStar}> *</Text>
              </Text>
              <View style={styles.itemContainer}>
                <Text style={styles.itemContent}>{userName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.borderContainer}>
            <View style={styles.borderLine} />
          </View>
          <View style={styles.itemSection}>
            <View style={styles.itemComponent}>
              <View style={styles.itemTitleWithButton}>
                <Text style={styles.itemTitle}>결제 항목</Text>
                <Pressable
                  onPress={() => {
                    addEmptyInput();
                  }}
                  style={styles.addButton}>
                  <Text style={styles.addButtonText}>추가하기</Text>
                </Pressable>
              </View>
            </View>
            {data.map((item: any) => {
              return (
                <PurchaseItem
                  key={item.id}
                  item={item}
                  deleteItem={deleteItem}
                />
              );
            })}
            {!itemFlag && (
              <View style={styles.passFillingItemSection}>
                <Text style={styles.passFillingItemText}>
                  결제 항목 입력을 생략하고 있어요!
                </Text>
                <Text style={styles.passFillingItemText}>
                  우측 상단의{' '}
                  <Text style={styles.passFillingItemButtonText}>추가하기</Text>{' '}
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
              <View style={styles.itemComponent}>
                <Text style={styles.passFillingItemButtonText}>
                  결제 항목 입력을 생략하고 싶어요!
                </Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.itemSection}>
            <View style={styles.itemComponent}>
              <Text style={styles.itemTitle}>
                결제한 금액<Text style={styles.redStar}> *</Text>
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <TextInput
                onChangeText={text => {
                  setTotalPrice(text);
                }}
                onBlur={() => {
                  checkPriceValidation();
                }}
                placeholder="숫자만 입력해주세요."
                style={styles.itemContent}
                value={totalPrice}
              />
            </View>
            {!totalPriceValidationFlag && (
              <Text style={styles.totalPriceValidationError}>
                결제한 금액과 결제 항목들이 일치하지 않습니다.
              </Text>
            )}
          </View>
          <View style={styles.borderContainer}>
            <View style={styles.borderLine} />
          </View>
          <Calendar
            style={styles.calendar}
            markedDates={selectedDate}
            theme={{
              selectedDayBackgroundColor: '#21B8CD',
              arrowColor: '#21B8CD',
              dotColor: '#21B8CD',
              todayTextColor: 'black',
            }}
            onDayPress={day => {
              addSelectedDate(day.dateString);
            }}
          />
          <View style={{margin: 10}}>
            <Button
              color="#21B8CD"
              title="결제시각 선택하기"
              onPress={() => togglePayTimeModal(true)}
            />
            <DatePicker
              modal
              title={null}
              mode={'time'}
              open={isPayTimeModalVisible}
              date={payTime}
              confirmText={'선택'}
              cancelText={'취소'}
              onConfirm={date => {
                togglePayTimeModal(false);
                setPayTime(date);
              }}
              onCancel={() => {
                togglePayTimeModal(false);
              }}
            />
          </View>
          <View style={styles.borderContainer}>
            <View style={styles.borderLine} />
          </View>
          <View style={styles.itemSection}>
            <View style={styles.itemComponent}>
              <View style={styles.itemTitleWithButton}>
                <Text style={styles.itemTitle}>
                  결제처<Text style={styles.redStar}> *</Text>
                </Text>
                <Pressable
                  onPress={() => setPlaceModalVisible(true)}
                  style={styles.addButton}>
                  <Text style={styles.addButtonText}>찾아보기</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemContent}>{place}</Text>
            </View>
            <View style={styles.webviewContainer}>
              <WebView
                ref={mapViewRef}
                source={{uri: 'http://146.56.190.78/webview/'}}
                style={styles.webview}
              />
            </View>
          </View>
          <Modal isVisible={placeModalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.placeModalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>결제처 찾기</Text>
                </View>
                <View style={styles.placeModalBody}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        width: Dimensions.get('window').width * 0.7,
                        height: 40,
                      }}
                      onChangeText={text => {
                        setPlaceKeyword(text);
                      }}
                      onSubmitEditing={() => {
                        searchPlace(placeKeyword);
                      }}
                      placeholder="가게 이름을 입력해주세요"
                      value={placeKeyword}
                    />
                    <Pressable
                      onPress={() => {
                        searchPlace(placeKeyword);
                      }}>
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        size={30}
                        style={{
                          color: '#21B8CD',
                        }}
                      />
                    </Pressable>
                  </View>
                  <ScrollView style={{}}>
                    {searchedPlaces.map((item: any) => {
                      return (
                        <View key={item.id}>
                          <View style={{marginTop: 20, marginBottom: 20}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text style={styles.placeName}>
                                {item.place_name}
                              </Text>
                              <Pressable
                                style={styles.placeSelectButton}
                                onPress={() => {
                                  setPlace(item.place_name);
                                  setPlaceAddress(item.road_address_name);
                                  setCategory(item.category_group_name.trim());
                                  setPlaceTel(item.phone);
                                  drawMap(item.road_address_name);
                                  setPlaceModalVisible(false);
                                }}>
                                <Text style={styles.placeSelectButtonText}>
                                  선택하기
                                </Text>
                              </Pressable>
                            </View>
                            <Text style={styles.roadAddressName}>
                              {item.road_address_name}
                            </Text>
                            <Text style={styles.addressName}>
                              (지번) {item.address_name}
                            </Text>
                            <Text style={styles.phone}>{item.phone}</Text>
                          </View>
                          <View style={styles.borderLineInModal} />
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.itemSection}>
            <View style={styles.itemComponent}>
              <View style={styles.itemTitleWithButton}>
                <Text style={styles.itemTitle}>
                  결제처 구분<Text style={styles.redStar}> *</Text>
                </Text>
                <Pressable
                  onPress={() => setCategoryModalVisible(true)}
                  style={styles.addButton}>
                  <Text style={styles.addButtonText}>선택하기</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemContent}>{category}</Text>
            </View>
          </View>
          <Modal isVisible={categoryModalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.categoryModalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>결제처 구분</Text>
                </View>
                <View style={styles.categoryModalBody}>
                  <View style={styles.categorySection}>
                    <Pressable
                      style={
                        selectedCategory === '대형마트'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('대형마트')}>
                      <Text
                        style={
                          selectedCategory === '대형마트'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        대형마트
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '편의점'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('편의점')}>
                      <Text
                        style={
                          selectedCategory === '편의점'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        편의점
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '어린이집, 유치원'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('어린이집, 유치원')}>
                      <Text
                        style={
                          selectedCategory === '어린이집, 유치원'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        어린이집, 유치원
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.categorySection}>
                    <Pressable
                      style={
                        selectedCategory === '학교'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('학교')}>
                      <Text
                        style={
                          selectedCategory === '학교'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        학교
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '지하철역'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('지하철역')}>
                      <Text
                        style={
                          selectedCategory === '지하철역'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        지하철역
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '문화시설'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('문화시설')}>
                      <Text
                        style={
                          selectedCategory === '문화시설'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        문화시설
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '음식점'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('음식점')}>
                      <Text
                        style={
                          selectedCategory === '음식점'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        음식점
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.categorySection}>
                    <Pressable
                      style={
                        selectedCategory === '주유소, 충전소'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('주유소, 충전소')}>
                      <Text
                        style={
                          selectedCategory === '주유소, 충전소'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        주유소, 충전소
                      </Text>
                    </Pressable>

                    <Pressable
                      style={
                        selectedCategory === '중개업소'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('중개업소')}>
                      <Text
                        style={
                          selectedCategory === '중개업소'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        중개업소
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '공공기관'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('공공기관')}>
                      <Text
                        style={
                          selectedCategory === '공공기관'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        공공기관
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.categorySection}>
                    <Pressable
                      style={
                        selectedCategory === '학원'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('학원')}>
                      <Text
                        style={
                          selectedCategory === '학원'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        학원
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '관광명소'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('관광명소')}>
                      <Text
                        style={
                          selectedCategory === '관광명소'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        관광명소
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '숙박'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('숙박')}>
                      <Text
                        style={
                          selectedCategory === '숙박'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        숙박
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '약국'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('약국')}>
                      <Text
                        style={
                          selectedCategory === '약국'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        약국
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        selectedCategory === '병원'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('병원')}>
                      <Text
                        style={
                          selectedCategory === '병원'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        병원
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.categorySection}>
                    <Pressable
                      style={
                        selectedCategory === '카페'
                          ? styles.selectedCategoryButton
                          : styles.unselectedCategoryButton
                      }
                      onPress={() => setSelectedCategory('카페')}>
                      <Text
                        style={
                          selectedCategory === '카페'
                            ? styles.selectedCategoryText
                            : styles.unselectedCategoryText
                        }>
                        카페
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  style={styles.categorySelectButton}
                  onPress={() => {
                    if (selectedCategory !== '') {
                      setCategory(selectedCategory);
                    }
                    setCategoryModalVisible(false);
                  }}>
                  <Text style={styles.categorySelectButtonText}>확인</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={styles.borderContainer}>
            <View style={styles.borderLine} />
          </View>
          <View style={styles.itemSection}>
            <View style={styles.itemComponent}>
              <Text style={styles.itemTitle}>메모</Text>
            </View>
            <View style={styles.memoContainer}>
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
            </View>
          </View>
          <View style={styles.itemSection}>
            <Pressable
              style={styles.uploadButton}
              onPress={() => {
                checkValidation();
              }}>
              <Text style={styles.uploadButtonText}>등록하기</Text>
            </Pressable>
          </View>
        </ScrollView>
      </AlertNotificationRoot>
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    width: Dimensions.get('window').width * 0.9,
    height: 195,
    opacity: 0.99,
  },
  window: {
    backgroundColor: 'white',
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
  borderContainer: {justifyContent: 'center', alignItems: 'center'},
  borderLine: {
    height: 1,
    backgroundColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.9,
  },
  borderLineInModal: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: Dimensions.get('window').width * 0.8,
  },
  itemSection: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitleWithButton: {
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
  itemComponent: {
    width: Dimensions.get('window').width * 0.9,
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
  placeModalView: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
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
  categoryModalView: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.7,
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
  categoryModalBody: {
    marginTop: 5,
    marginBottom: 20,
  },
  placeModalBody: {
    height: Dimensions.get('window').height * 0.55,
    marginTop: 5,
    marginBottom: 20,
  },
  placeName: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  roadAddressName: {
    color: '#808080',
    fontSize: 9,
    fontFamily: 'Roboto',
  },
  addressName: {color: '#808080', fontSize: 9, fontFamily: 'Roboto'},
  phone: {color: '#808080', fontSize: 9, fontFamily: 'Roboto'},
  placeSelectButton: {
    width: 55,
    height: 23,
    backgroundColor: '#21B8CD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  placeSelectButtonText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 10,
  },
  categorySelectButton: {
    height: 45,
    backgroundColor: '#21B8CD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  categorySelectButtonText: {
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
  webviewContainer: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.9,
    height: 195,
    marginTop: 30,
  },
  calendar: {
    width: '100%',
    borderColor: 'white',
  },
});
export default ReceiptUploadPage;
