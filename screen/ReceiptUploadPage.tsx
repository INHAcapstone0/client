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
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import PurchaseItem from '../components/PurchaseItem';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

function ReceiptUploadPage() {
  //액세스토큰
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );

  //유저이름
  const userName = useSelector((state: RootState) => state.persist.user.name);

  //장소 찾기 모달 visible
  const [placeModalVisible, setPlaceModalVisible] = useState(false);

  //장소 변수
  const [place, setPlace] = useState('찾아보기 버튼을 눌러주세요.');

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

  //더미데이터

  /*
  const [data, setData] = useState([
    {
      id: '1',
      name: '',
      quantity: '',
      price: '',
    },
  ]);
  */
  const [data, setData] = useState([
    {
      id: '1-1',
      name: '아메리카노',
      quantity: '3',
      price: '4000',
    },
    {
      id: '2-1',
      name: '카페라떼',
      quantity: '3',
      price: '4500',
    },
    {
      id: '3-1',
      name: '플랫화이트',
      quantity: '3',
      price: '6000',
    },
  ]);

  const [searchedPlaces, setSearchedPlaces] = useState([
    {
      place_name: '스타벅스 인하대점',
      road_address_name: '인천 미추홀구 인하로 59',
      address_name: '용현동 199-18',
      phone: '1522-3232',
    },
    {
      place_name: '스타벅스 인하대역점',
      road_address_name: '인천 미추홀구 독배로 309',
      address_name: '용현동 665-15',
      phone: '',
    },
    {
      place_name: '스타벅스 인천학익DT점',
      road_address_name: '인천 미추홀구 매소홀로 368',
      address_name: '학익동 690-2',
      phone: '1522-3232',
    },
    {
      place_name: '스타벅스 인천용일사거리DT점',
      road_address_name: '인천 미추홀구 한나루로 525',
      address_name: '주안동 684-3',
      phone: '1522-3232',
    },
    {
      place_name: '스타벅스 인천용현DT점',
      road_address_name: '인천 미추홀구 아암대로 107',
      address_name: '용현동 630-9',
      phone: '1522-3232',
    },
    {
      place_name: '스타벅스 제물포역DT점',
      road_address_name: '인천 미추홀구 경인로 103',
      address_name: '숭의동 78-2',
      phone: '1522-3232',
    },
    {
      place_name: '스타벅스 인천도화DT점',
      road_address_name: '인천 미추홀구 장고개로 28',
      address_name: '도화동 116-2',
      phone: '1522-3232',
    },
  ]);

  //결제항목의 이름, 수량, 가격 유효성 변수 / 빈칸이거나 (수량, 가격의 경우)숫자가 아니면 false
  const [itemValidation, setItemValidation] = useState(true);

  //사용자가 입력한 결제한 금액
  const [totalPrice, setTotalPrice] = useState('');

  //메모
  const [memo, setMemo] = useState('');

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
  const deleteItem = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  //결제항목 생략 함수
  const passFillingItem = () => {
    setData([]);
    setItemFlag(false);
    setTotalPriceValidationFlag(true);
  };
  useEffect(() => {
    if (data.length === 0 && itemFlag) {
      addEmptyInput();
    }
  }, [data]);
  return (
    <View style={styles.window}>
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
        <View style={styles.itemSection}>
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
          {data.map((item: any) => {
            return (
              <PurchaseItem key={item.id} item={item} deleteItem={deleteItem} />
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
            <Text style={styles.passFillingItemButtonText}>
              결제 항목 입력을 생략하고 싶어요!
            </Text>
          </Pressable>
        </View>
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
            <Text style={styles.totalPriceValidationError}>
              결제한 금액과 결제 항목들이 일치하지 않습니다.
            </Text>
          )}
        </View>
        <View style={styles.borderLine} />
        <View style={styles.itemSection}>
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
          <View style={styles.itemContainer}>
            <Text style={styles.itemContent}>{place}</Text>
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
                      console.log('검색1');
                    }}
                    placeholder="가게 이름을 입력해주세요"
                    value={placeKeyword}
                  />
                  <Pressable
                    onPress={() => {
                      console.log('검색2');
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
                      <View key={item.road_address_name}>
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
        <View style={styles.borderLine} />
        <View style={styles.itemSection}>
          <Text style={styles.itemTitle}>메모</Text>
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
            onPress={() => console.log('등록하기')}>
            <Text style={styles.uploadButtonText}>등록하기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    height: 300,
    width: 300,
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
});
export default ReceiptUploadPage;
