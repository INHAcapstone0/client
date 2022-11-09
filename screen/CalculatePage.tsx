/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import axiosInstance from '../utils/interceptor';
import EncryptedStorage from 'react-native-encrypted-storage';

const dummyData1 = [
  {
    name: '독서 정모',
    date: '2022.12.21 ~ 2022.12.30',
    calculate: [
      {
        giver: '김연주',
        money: '15.400',
        send: false,
        src: require('../resources/icons/1.png'),
        giver_id: 1,
      },
      {
        giver: '이창현',
        money: '421.200',
        send: true,
        src: require('../resources/icons/2.png'),
        giver_id: 2,
      },
      {
        giver: '이지은',
        money: '400',
        send: false,
        src: require('../resources/icons/3.png'),
        giver_id: 3,
      },
    ],
    id: 1,
  },
  {
    name: '제주도 여행',
    date: '2022.02.13 ~ 2022.02.15',
    calculate: [
      {
        giver: '이지은',
        money: '123.400',
        send: false,
        src: require('../resources/icons/3.png'),
        giver_id: 6,
      },
      {
        giver: '김연주',
        money: '131.400',
        send: true,
        src: require('../resources/icons/1.png'),
        giver_id: 4,
      },
      {
        giver: '이창현',
        money: '2.200',
        send: true,
        src: require('../resources/icons/2.png'),
        giver_id: 5,
      },
    ],
    id: 2,
  },
];

const dummyData2 = [
  {
    name: '등산 모임',
    date: '2023.01.21 ~ 2022.02.30',
    calculate: [
      {
        giver: '이창현',
        money: '421.200',
        send: false,
        src: require('../resources/icons/2.png'),
        giver_id: 2,
      },
      {
        giver: '김연주',
        money: '15.400',
        send: false,
        src: require('../resources/icons/1.png'),
        giver_id: 1,
      },
      {
        giver: '이지은',
        money: '400',
        send: false,
        src: require('../resources/icons/3.png'),
        giver_id: 3,
      },
    ],
    id: 1,
  },
  {
    name: '자전거 동호회',
    date: '2022.12.13 ~ 2022.12.15',
    calculate: [
      {
        giver: '이지은',
        money: '999.123.400',
        send: true,
        src: require('../resources/icons/3.png'),
        giver_id: 6,
      },
      {
        giver: '이창현',
        money: '423.200',
        send: false,
        src: require('../resources/icons/2.png'),
        giver_id: 5,
      },
      {
        giver: '김연주',
        money: '312.131.400',
        send: false,
        src: require('../resources/icons/1.png'),
        giver_id: 4,
      },
    ],
    id: 2,
  },
];
interface alarmType {
  alarm_type: string;
  checked: false;
  createdAt: string;
  deletedAt: null;
  id: string;
  message: string;
  updatedAt: string;
  user_id: string;
}

function CalculatePage({navigation}: any) {
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const [allSettlements, setAllSettlements] = useState<Array<any>>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [accessToken, setAccessToken] = useState<string | null>('');

  useEffect(() => {
    getSettlements();
  }, [accessToken]);

  useEffect(() => {
    console.log(444);
    loadAccessToken();
  }, []);

  const loadAccessToken = async () => {
    const accessTokenData = await EncryptedStorage.getItem('accessToken');
    setAccessToken(accessTokenData);
  };

  const getSettlements = async () => {
    try {
      console.log(33);
      const response = await axiosInstance.get(
        `http://146.56.190.78/settlements/custom/mine`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setAllSettlements(response.data);
      console.log('response.data', response.data);
      console.log('response.data.Settlements', response.data.Settlements);
    } catch (err: AxiosError | any) {
      // console.log(err.response);
    }
  };

  const updateSettlement = (calculate: any) => async (event: any) => {
    try {
      const response = await axiosInstance.patch(
        `http://146.56.190.78:8002/settlements/${calculate.giver_id}`,
        {is_paid: true},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      getSettlements();
      console.log(response);
    } catch (err: AxiosError | any) {
      console.log(err.response);
    }
  };

  const changeCurrentTab = () => {
    if (currentTab === 0) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  };
  return (
    <View style={styles.calculatePage}>
      <View style={styles.calculateTab}>
        <Pressable
          style={
            currentTab === 0
              ? styles.calculateActiveTabLabel
              : styles.calculateTabLabel
          }
          onPress={changeCurrentTab}>
          <Text
            style={
              currentTab === 0
                ? styles.calculateActiveTabText
                : styles.calculateTabText
            }>
            받아야 할 내역
          </Text>
        </Pressable>
        <Pressable
          style={
            currentTab === 1
              ? styles.calculateActiveTabLabel
              : styles.calculateTabLabel
          }
          onPress={changeCurrentTab}>
          <Text
            style={
              currentTab === 1
                ? styles.calculateActiveTabText
                : styles.calculateTabText
            }>
            보내야 할 내역
          </Text>
        </Pressable>
      </View>
      <ScrollView>
        {currentTab === 0 ? (
          dummyData1.length > 0 ? (
            dummyData1.map((data: any) => (
              <View style={styles.calculateWrapper} key={data.id}>
                <Text style={styles.calculateText} key={data.id}>
                  {data.name}
                </Text>
                <View>
                  {data.calculate.map((calculate: any) => (
                    <View
                      style={styles.calculateAlarm}
                      key={calculate.giver_id}>
                      <Image
                        key={calculate.giver_id}
                        style={styles.calculateImage}
                        source={calculate.src}
                      />
                      <View style={styles.calculateAlarmMessage}>
                        <Text style={styles.calculateGiver}>
                          {calculate.giver}{' '}
                          <Text style={styles.calculateMoneyText}>님께</Text>
                        </Text>
                        <Text style={styles.calculateMoney}>
                          {calculate.money}원
                          <Text style={styles.calculateMoneyText}>
                            &nbsp;입금 받으세요
                          </Text>
                        </Text>
                      </View>
                      {calculate.send === true ? (
                        <TouchableOpacity style={styles.calculateButtonActive}>
                          <Text style={styles.calculateButtonText}>
                            정산 완료
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.calculateButton}
                          onPress={updateSettlement(calculate)}>
                          <Text style={styles.calculateButtonText}>
                            입금 확인
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyImg}>
              <Image
                source={require('../resources/icons/calculateReceive.png')}
              />
            </View>
          )
        ) : dummyData2.length > 0 ? (
          dummyData2.map((data: any) => (
            <View style={styles.calculateWrapper} key={data.id}>
              <Text style={styles.calculateText} key={data.id}>
                {data.name}
              </Text>
              <View>
                {data.calculate.map((calculate: any) => (
                  <View style={styles.calculateAlarm} key={calculate.giver_id}>
                    <Image
                      key={calculate.giver_id}
                      style={styles.calculateImage}
                      source={calculate.src}
                    />
                    <View style={styles.calculateAlarmMessage}>
                      <Text style={styles.calculateGiver}>
                        {calculate.giver}{' '}
                        <Text style={styles.calculateMoneyText}>님께</Text>
                      </Text>
                      <Text style={styles.calculateSendMoney}>
                        {calculate.money}원
                        <Text style={styles.calculateMoneyText}>
                          &nbsp;입금 하세요
                        </Text>
                      </Text>
                    </View>
                    {calculate.send === true ? (
                      <TouchableOpacity style={styles.calculateButtonActive}>
                        <Text style={styles.calculateButtonText}>
                          정산 완료
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.calculateButton}>
                        <Text style={styles.calculateButtonText}>
                          입금 완료
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyImg}>
            <Image source={require('../resources/icons/calculateSend.png')} />
          </View>
        )}
      </ScrollView>
      <View style={styles.calculateBorder} />
    </View>
  );
}
const styles = StyleSheet.create({
  calculatePage: {
    // paddingLeft: 20,
    // paddingRight: 20,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  calculateTab: {
    paddingTop: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  calculateActiveTabLabel: {
    backgroundColor: '#21B8CD',
    height: 48,
    width: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
  },
  calculateActiveTabText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  calculateTabLabel: {
    backgroundColor: 'white',
    height: 48,
    width: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
  },
  calculateTabText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#21B8CD',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  calculateContainer: {
    paddingBottom: 20,
  },
  calculateLabel: {
    fontSize: 20,
    color: '#3E382F',
    fontFamily: 'Jalnan',
    fontWeight: '400',
    paddingTop: 20,
    paddingBottom: 10,
  },
  calculateBorder: {
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  calculateWrapper: {
    // paddingTop: 8,
    // paddingBottom: 8,
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  calculateImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  calculateText: {
    width: '100%',
    // marginLeft: 15,
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
    flexShrink: 1,
    fontFamily: 'Roboto',
    borderBottomColor: '#21B8CD',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  calculateAlarm: {
    paddingTop: 15,
    paddingBottom: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  calculateGiver: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },
  calculateMoney: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4980EC',
  },
  calculateSendMoney: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EC4949',
  },
  calculateMoneyText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'gray',
  },
  calculateAlarmMessage: {
    paddingLeft: 20,
  },
  calculateButton: {
    backgroundColor: '#21B8CD',
    width: 75,
    height: 26,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 25,
  },
  calculateButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 64,
    height: 26,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 25,
  },
  calculateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  emptyImg: {
    marginTop: Dimensions.get('window').height / 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CalculatePage;
