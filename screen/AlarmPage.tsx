/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';

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

function AlarmPage({navigation}: any) {
  const [allAlarms, setAllAlarms] = useState<Array<alarmType>>([]);
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  useEffect(() => {
    getAllAlarms();
  }, []);

  const getAllAlarms = async () => {
    try {
      const response = await axios.get(
        `http://146.56.188.32:8002/alarms?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setAllAlarms(response.data);
      console.log(response.data);
    } catch (err: AxiosError | any) {
      console.log(err.response);
    }
  };

  return (
    <SafeAreaView style={styles.alarmPage}>
      <ScrollView>
        {allAlarms.length > 0 ? (
          allAlarms.slice(0, -2).map((alarm: alarmType) => {
            if (alarm.alarm_type === '초대') {
              return (
                <TouchableOpacity
                  style={styles.alarmWrapper}
                  // onPress={removeToGroupMember(user)}
                  key={alarm.id}>
                  <Image
                    source={require('../resources/icons/Invitation.png')}
                    style={styles.alarmIcon}
                  />
                  <Text style={styles.alarmText} key={alarm.id}>
                    {alarm.message}
                  </Text>
                </TouchableOpacity>
              );
            } else if (alarm.alarm_type === '영수증 업로드') {
              return (
                <TouchableOpacity
                  style={styles.alarmWrapper}
                  // onPress={removeToGroupMember(user)}
                  key={alarm.id}>
                  <Image
                    source={require('../resources/icons/AlarmReceipt.png')}
                    style={styles.alarmIcon}
                  />
                  {/* <Ionicons name="receipt-outline" color="black" size={40} /> */}
                  <Text style={styles.alarmText} key={alarm.id}>
                    {alarm.message}
                  </Text>
                </TouchableOpacity>
              );
            } else if (alarm.alarm_type === '일정 시작') {
              return (
                <TouchableOpacity
                  style={styles.alarmWrapper}
                  // onPress={removeToGroupMember(user)}
                  key={alarm.id}>
                  <Image
                    source={require('../resources/icons/DateStart.png')}
                    style={styles.alarmIcon}
                  />
                  <Text style={styles.alarmText} key={alarm.id}>
                    {alarm.message}
                  </Text>
                </TouchableOpacity>
              );
            } else if (alarm.alarm_type === '일정 종료') {
              return (
                <TouchableOpacity
                  style={styles.alarmWrapper}
                  // onPress={removeToGroupMember(user)}
                  key={alarm.id}>
                  <Image
                    source={require('../resources/icons/DateEnd.png')}
                    style={styles.alarmIcon}
                  />
                  <Text style={styles.alarmText} key={alarm.id}>
                    {alarm.message}
                  </Text>
                </TouchableOpacity>
              );
            } else if (alarm.alarm_type === '정산 확인 요청') {
              return (
                <TouchableOpacity
                  style={styles.alarmWrapper}
                  // onPress={removeToGroupMember(user)}
                  key={alarm.id}>
                  <Image
                    source={require('../resources/icons/CalculateRequestCheck.png')}
                    style={styles.alarmIcon}
                  />
                  <Text style={styles.alarmText} key={alarm.id}>
                    {alarm.message}
                  </Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  style={styles.alarmWrapper}
                  // onPress={removeToGroupMember(user)}
                  key={alarm.id}>
                  <Image
                    source={require('../resources/icons/CalculateCheck.png')}
                    style={styles.alarmIcon}
                  />
                  <Text style={styles.alarmText} key={alarm.id}>
                    {alarm.message}.
                  </Text>
                </TouchableOpacity>
              );
            }
          })
        ) : (
          <View style={styles.emptyImg}>
            <Image source={require('../resources/icons/alarmImg.png')} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  alarmPage: {
    padding: 20,
    paddingTop: 30,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
  },
  alarmWrapper: {
    paddingTop: 8,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 0.5,
    // borderColor: '#21B8CD',
  },
  alarmImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  alarmText: {
    width: '100%',
    paddingLeft: 20,
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    flexShrink: 1,
    fontFamily: 'Roboto',
  },
  alarmIcon: {
    width: 55,
    height: 55,
  },
  emptyImg: {
    marginTop: Dimensions.get('window').height / 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AlarmPage;
