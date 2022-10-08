/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  Modal,
  Dimensions,
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store/Store';
import FormButton from '../components/FormButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';
import {scheduleAction} from '../slices/Schedule';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
  IConfigDialog,
  IConfigToast,
} from 'react-native-alert-notification';

interface selectDateType {
  [key: string]: {[key: string]: boolean};
}

interface userType {
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

type IProps = {
  dialogConfig?: Pick<IConfigDialog, 'closeOnOverlayTap' | 'autoClose'>;
  toastConfig?: Pick<
    IConfigToast,
    'autoClose' | 'titleStyle' | 'textBodyStyle'
  >;
  theme?: 'light' | 'dark';
  colors?: [IColors, IColors] /** ['light_colors' , 'dark_colors'] */;
};
type IColors = {
  label: string;
  card: string;
  overlay: string;
  success: string;
  danger: string;
  warning: string;
};

function CreateGroupPage({navigation}: any) {
  const [groupName, setGroupName] = useState('');
  const groupNameRef = useRef<TextInput | null>(null);

  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const dispatch = useAppDispatch();

  useEffect(() => {
    groupNameRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(String(selectedStartTime.getHours()).padStart(2, '0'));
    console.log(selectedStartTime.getMinutes());
    console.log(String(selectedEndTime.getHours()).padStart(2, '0'));
    console.log(selectedEndTime.getMinutes());
  }, [selectedStartTime, selectedEndTime]);

  const onChangeGroupName = useCallback((text: string) => {
    setGroupName(text.trim());
  }, []);

  const moveToNextStep = () => {
    if (groupName === '') {
      console.log(1);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '일정명을 입력해주세요',
      });
      return;
    } else {
      dispatch(
        scheduleAction.setGroupName({
          groupName: groupName,
        }),
      );
      navigation.navigate('CreateGroupSecondPage');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.groupCreateWrapper}>
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
          <View style={styles.stepWrapper}>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/first.png')} />
              <Text style={styles.stepActiveText}>일정 이름</Text>
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/Cell.png')} />
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/Cell.png')} />
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/second.png')} />
              <Text style={styles.stepText}>일정/시간 설정</Text>
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/Cell.png')} />
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/Cell.png')} />
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/third.png')} />
              <Text style={styles.stepText}>그룹원 초대</Text>
            </View>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.elementLabel}>일정 이름</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeGroupName}
              placeholder="일정명을 입력해주세요"
              // placeholderTextColor="#21B8CD"
              importantForAutofill="yes"
              textContentType="familyName"
              value={groupName}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={groupNameRef}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.nextButton}>
            <Button color="#21B8CD" title="다음" onPress={moveToNextStep} />
          </View>
        </AlertNotificationRoot>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  groupCreateWrapper: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    padding: 20,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    fontFamily: 'Jalnan',
  },
  stepWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    margin: 5,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  stepImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActiveText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  stepText: {
    marginTop: 5,
    fontSize: 12,
  },
  elementWrapper: {
    paddingBottom: 25,
  },
  elementLabel: {
    color: 'black',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  nextButton: {
    marginTop: Dimensions.get('window').height / 2,
  },
});
export default CreateGroupPage;
