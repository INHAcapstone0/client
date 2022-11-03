/* eslint-disable @typescript-eslint/no-shadow */
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
  useWindowDimensions,
  Animated,
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
import {TouchableOpacity} from 'react-native-gesture-handler';
import Presenter from 'react-native-calendars/src/expandableCalendar/Context/Presenter';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {any, string} from 'prop-types';
function ExpenseHistoryPage({route, navigation}: any) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const saveRoute = useState(route);
  const [scheduleId, setScheduleId] = useState(route.params.scheduleId);
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

  const [errFlag, setErrFlag] = useState(false);
  const [ownerFlag, setOwnerFlag] = useState(false);

  const [categoryList, setCategoryList] = useState<string[]>(['전체']);

  const [routes, setRoutes] = useState<{key: string; title: string}[]>([]);

  const [totalPrice, setTotalPrice] = useState('0');

  const renderScene = ({route}: any) => {
    return (
      <View style={styles.receiptSection}>
        <ScrollView>
          {receiptsInfo.map((item: any) => {
            if (item != null) {
              return (
                <ReceiptCard
                  key={item.id}
                  item={item}
                  route={navigation}
                  category={route.key}
                  navigation={navigation}
                />
              );
            }
          })}
        </ScrollView>
      </View>
    );
  };
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const getScheduleInfo = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(
        `http://146.56.190.78:8002/schedules/${scheduleId}`,
        {headers},
      );
      setScheduleInfo(response.data);
      if (userId === scheduleInfo.owner_id) {
        setOwnerFlag(true);
      }

      if (response.data.total_pay != null) {
        setTotalPrice(
          response.data.total_pay
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        );
      }
    } catch (err: AxiosError | any) {
      console.log(err.response.data.msg);
      console.log(err);
    }
  };

  const getReceiptsInfo = async (category: string) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    if (category === '전체') {
      const params = {
        schedule_id: scheduleId,
      };

      try {
        const response = await axios.get('http://146.56.190.78:8002/receipts', {
          params,
          headers,
        });
        setReceiptsInfo(response.data);
        return response.data;
      } catch (err: AxiosError | any) {
        console.log(err);
        if (err.response.status === 404) {
          setErrFlag(true);
        }
        return Promise.reject;
      }
    } else {
      const params = {
        schedule_id: scheduleId,
        category: category,
      };

      try {
        const response = await axios.get('http://146.56.190.78:8002/receipts', {
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
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#21B8CD'}}
      pressColor={'#21B8CD'}
      scrollEnabled={true}
      style={{backgroundColor: 'white'}}
      //tabStyle={route.title.length > 4 ? {width: 90} : {width: 140}}
      tabStyle={{width: 90}}
      renderLabel={({route, focused, color}) => (
        <Text style={[focused ? {color: '#21B8CD'} : {color: '#7C7C7C'}]}>
          {route.title}
        </Text>
      )}
    />
  );

  useEffect(() => {
    getScheduleInfo();
    getReceiptsInfo('전체')
      .then(receipts => {
        var stores: string[] = [];
        receipts.map((item: {category: string}) => {
          if (!categoryList.includes(item.category)) {
            categoryList.push(item.category);
          }
        });
        categoryList.map((item: string) => {
          routes.push({key: item, title: item});
        });
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  if (errFlag) {
    //등록된 영수증이 0개일 경우
    return (
      <View style={styles.errScreen}>
        <View style={styles.header}>
          <Text style={styles.scheduleName}>{scheduleInfo.name}</Text>
        </View>
        <ScrollView>
          <View style={styles.errScreen2}>
            <Image
              style={styles.errImg}
              source={require('../resources/icons/noReceipt.png')}
            />
            <Text style={styles.errMsg}>지출 내역이 없습니다.</Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View>
            <Text style={styles.scheduleTotalPrice}>
              총 지출 금액 : {totalPrice} 원
            </Text>
            <Text style={styles.scheduleDate}>
              {scheduleInfo.startAt.substring(0, 10)} ~{' '}
              {scheduleInfo.endAt.substring(0, 10)}
            </Text>
          </View>
          <Image
            style={styles.footerImg}
            source={require('../resources/icons/ExpenseHistory.png')}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Text style={styles.scheduleName}>{scheduleInfo.name}</Text>
        </View>
        <TabView
          navigationState={{
            index: index,
            routes: routes,
          }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
        />
        <View style={styles.footer}>
          <View>
            <Text style={styles.scheduleTotalPrice}>
              총 지출 금액 : {totalPrice} 원
            </Text>
            <Text style={styles.scheduleDate}>
              {scheduleInfo.startAt.substring(0, 10)} ~{' '}
              {scheduleInfo.endAt.substring(0, 10)}
            </Text>
          </View>
          <Image
            style={styles.footerImg}
            source={require('../resources/icons/ExpenseHistory.png')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  schedule: {
    backgroundColor: '#4D483D',
    height: 100,
  },
  header: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21B8CD',
    height: 60,
  },
  footer: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#21B8CD',
    height: 57,
    paddingLeft: 15,
    paddingRight: 15,
  },
  footerImg: {
    width: 58,
    height: 47,
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
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scheduleDate: {
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  scheduleTotalPrice: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoryButton: {
    backgroundColor: '#E1E1E1',
    height: 40,
    borderColor: '#ACACAC',
    borderRadius: 120,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Jalnan',
    color: '#4D483D',
  },
  receiptSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errScreen: {
    flex: 1,
  },

  errScreen2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height * 0.7,
  },
  errImg: {
    height: 298,
    width: 304,
  },
  errMsg: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: '#B3B3B3',
    marginTop: 20,
  },
  tabbar: {
    backgroundColor: '#fff',
  },
  tab: {
    opacity: 1,
    width: 90,
  },
  indicator: {
    backgroundColor: 'yellow', //'#21B8CD',
  },
});
export default ExpenseHistoryPage;
