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
} from 'react-native';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';

interface alarmType {
  createdAt: string;
  deletedAt: null;
  email: string;
  id: string;
  img_url: null;
  is_locked: false;
  login_failed_cnt: number;
  name: string;
  updatedAt: string;
}

function AlarmPage({navigation}: any) {
  const [allAlarms, setAllAlarms] = useState<Array<any>>([]);
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
    } catch (err: any) {
      console.log(err.response);
    }
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>알람</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default AlarmPage;
