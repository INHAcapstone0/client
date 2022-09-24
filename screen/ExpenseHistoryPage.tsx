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
import {faReceipt} from '@fortawesome/free-solid-svg-icons';
import {configureStore} from '@reduxjs/toolkit';

function ExpenseHistoryPage(route: any) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const userId = useSelector((state: RootState) => state.persist.user.id);

  const [scheduleId, setScheduleId] = useState(route.route.params.schedule.id);
  const [scheduleInfo, setScheduleInfo] = useState<{
    name: string;
    startAt: string;
    endAt: string;
    owner_id: string;
    total_pay: number;
  }>({
    name: '',
    startAt: '',
    endAt: '',
    owner_id: '',
    total_pay: 0,
  });
  const [receiptsInfo, setReceiptsInfo] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [bottomModalType, setBottomModalType] = useState('');
  const [errFlag, setErrFlag] = useState(false);
  const [ownerFlag, setOwnerFlag] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const getScheduleInfo = async () => {
    try {
      console.log('schedule id : ', scheduleId);
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(
        `http://146.56.188.32:8002/schedules/${scheduleId}`,
        {headers},
      );
      setScheduleInfo(response.data);
      if (userId === scheduleInfo.owner_id) {
        setOwnerFlag(true);
      }

      if (totalPrice == null) {
        setTotalPrice(0);
      }
      setStartDate(scheduleInfo.startAt.substring(0, 10));
      setEndDate(scheduleInfo.endAt.substring(0, 10));
    } catch (err: AxiosError | any) {
      console.log(err);
    }
  };

  const getReceiptsInfo = async () => {
    try {
      const params = {
        schedule_id: scheduleId,
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get('http://146.56.188.32:8002/receipts', {
        params,
        headers,
      });
      setReceiptsInfo(response.data);
    } catch (err: AxiosError | any) {
      console.log(err);
      if (err.response.status === 404) {
        setErrFlag(true);
      }
    }
  };

  console.log();
  useEffect(() => {
    getScheduleInfo();
    getReceiptsInfo();
  }, []);

  if (errFlag) {
    //등록된 영수증이 0개일 경우
    return (
      <View style={styles.errScreen}>
        <View style={styles.schedule}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleName}>{scheduleInfo.name}</Text>
            <Text style={styles.scheduleDate}>
              {startDate} ~ {endDate}
            </Text>
          </View>
          <View style={styles.scheduleBody}>
            <Text style={styles.scheduleTotalPrice}>
              지출 금액 : {scheduleInfo.total_pay} 원
            </Text>
          </View>
        </View>
        <FontAwesomeIcon style={styles.errIcon} icon={faReceipt} size={80} />
        <Text style={styles.errMsg}>{'\n'}지출 내역이 없으시네요</Text>
        <Text style={styles.errMsg}>영수증을 등록해 보세요!</Text>
      </View>
    );
  } else {
    return (
      <View>
        <View style={styles.schedule}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleName}>{scheduleInfo.name}</Text>
            <Text style={styles.scheduleDate}>
              {startDate} ~ {endDate}
            </Text>
          </View>
          <View style={styles.scheduleBody}>
            <Text style={styles.scheduleTotalPrice}>
              지출 금액 : {scheduleInfo.total_pay} 원
            </Text>
          </View>
        </View>
        <ScrollView>
          {receiptsInfo.map((item: any) => {
            if (item != null) {
              return <ReceiptCard key={item.id} item={item} />;
            }
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  schedule: {
    backgroundColor: '#4D483D',
    height: 100,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errIcon: {
    color: '#4D483D',
  },
  scheduleName: {
    fontSize: 17,
    fontFamily: 'Jalnan',
    color: '#FFFFFF',
    marginTop: 10,
    marginLeft: 10,
  },
  scheduleDate: {
    fontSize: 15,
    fontFamily: 'Jalnan',
    color: '#FFFFFF',
    marginTop: 10,
    marginRight: 10,
  },
  scheduleTotalPrice: {
    fontSize: 25,
    fontFamily: 'Jalnan',
    color: '#FFFFFF',
  },
  errScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.6,
  },
  errMsg: {
    fontSize: 20,
    fontFamily: 'Jalnan',
    color: '#4D483D',
  },
});
export default ExpenseHistoryPage;
