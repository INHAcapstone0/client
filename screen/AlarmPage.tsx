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
        `http://10.0.2.2:8002/alarms?user_id=${userId}`,
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
    <View style={styles.alarmPageWrapper}>
      <Text style={styles.alarmLabel}>알람</Text>
      <ScrollView>
        {allAlarms.map((alarm: any) => {
          if (alarm.alarm_type === 'invite') {
            return (
              <TouchableOpacity
                style={styles.alarmWrapper}
                // onPress={removeToGroupMember(user)}
                key={alarm.id}>
                <Image
                  key={alarm.id}
                  style={styles.alarmImage}
                  source={{
                    uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
                  }}
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
                  key={alarm.id}
                  style={styles.alarmImage}
                  source={{
                    uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
                  }}
                />
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
                  key={alarm.id}
                  style={styles.alarmImage}
                  source={{
                    uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
                  }}
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
                  key={alarm.id}
                  style={styles.alarmImage}
                  source={{
                    uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
                  }}
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
                  key={alarm.id}
                  style={styles.alarmImage}
                  source={{
                    uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
                  }}
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
                  key={alarm.id}
                  style={styles.alarmImage}
                  source={{
                    uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
                  }}
                />
                <Text style={styles.alarmText} key={alarm.id}>
                  {alarm.message}.
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  alarmPageWrapper: {
    margin: 20,
  },
  alarmLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  alarmWrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  alarmImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  alarmText: {
    width: '100%',
    paddingLeft: 10,
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
    flexShrink: 1,
  },
});
export default AlarmPage;
