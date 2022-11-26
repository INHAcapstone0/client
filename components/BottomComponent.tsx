/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Button,
  Dimensions,
  TouchableHighlight,
  Pressable,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import ParticipantCard from './ParticipantCard';
import ReceiptCard from './ReceiptCard';
import {faReceipt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';

interface BottomComponentProps {
  selectedScheduleId: any;
  bottomModalType: any;
  closeBottomModal: () => void;
}
interface userType {
  createdAt: string;
  deletedAt: null;
  email: string;
  id: string;
  img_url: string;
  is_locked: false;
  login_failed_cnt: number;
  name: string;
  updatedAt: string;
}

function BottomComponent({
  selectedScheduleId,
  bottomModalType,
  closeBottomModal,
}: BottomComponentProps) {
  const [approvedAllMembersInfo, setApprovedAllMembersInfo] = useState([]);
  const [allReceiptsInfo, setAllReceiptsInfo] = useState([]);
  const [errFlag, setErrFlag] = useState(false);
  const [allUsers, setAllUsers] = useState<Array<userType>>([]);
  const [searchName, setSearchName] = useState('');
  const [selectedUsers, setSelectedUseres] = useState<Array<userType>>([]);

  // useEffect(() => {
  //   getAllUsers();
  // }, []);

  const onChangeSearchName = useCallback((text: string) => {
    setSearchName(text.trim());
  }, []);

  const addToGroupMember = (user: userType) => (event: any) => {
    if (selectedUsers.includes(user)) {
      const newSelectedUsers = selectedUsers.filter(
        selectedUser => selectedUser.id !== user.id,
      );
      setSelectedUseres([...newSelectedUsers]);
    } else {
      setSelectedUseres([...selectedUsers, user]);
    }
  };

  const InviteAdditionalMember = async () => {
    try {
      console.log(selectedUsers);
      console.log(selectedScheduleId);

      const selectedUsersId: string[] = [];

      selectedUsers.filter(user => selectedUsersId.push(user.id));

      console.log(selectedUsersId);
      const accessToken = await EncryptedStorage.getItem('accessToken');

      await axiosInstance.post(
        'http://146.56.190.78/participants',
        {
          participant_ids: selectedUsersId,
          schedule_id: selectedScheduleId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '그룹원 초대가 완료되었습니다', [
        {
          text: '확인',
          onPress: () => {
            closeBottomModal();
          },
        },
      ]);
    } catch (err: any) {
      console.log(err.response.data);
    }
  };

  const getAllReceipts = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const params = {
        schedule_id: selectedScheduleId,
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get(
        'http://146.56.190.78/receipts',
        {
          params,
          headers,
        },
      );
      setAllReceiptsInfo(response.data);
    } catch (err: AxiosError | any) {
      console.log(err);
      if (err.response.status === 404) {
        setErrFlag(true);
      }
    }
  };

  const getApprovedAllMembersInfo = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const params = {
        schedule_id: selectedScheduleId,
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get(
        'http://146.56.190.78/participants',
        {
          params,
          headers,
        },
      );
      setApprovedAllMembersInfo(response.data);
    } catch (err: AxiosError | any) {
      console.log(err);
      if (err.response.status === 404) {
        setErrFlag(true);
      }
    }
  };

  const getAllUsers = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await axiosInstance.get(
        `http://146.56.190.78/users/rest?exceptScheduleId=${selectedScheduleId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
      setAllUsers(response.data);
    } catch (err: any) {
      console.log(err.response.data.msg);
    }
  };

  /*
  if (bottomModalType === '지출요약') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      getAllReceipts();
    }, []);

    if (errFlag) {
      //등록된 영수증이 0개일 경우
      return (
        <View style={styles.errScreen}>
          <FontAwesomeIcon style={styles.errIcon} icon={faReceipt} size={80} />
          <Text style={styles.errMsg}>{'\n'}지출 내역이 없으시네요</Text>
          <Text style={styles.errMsg}>영수증을 등록해 보세요!</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.modalTitle}>지출 요약 확인하기</Text>
          {allReceiptsInfo.map((item: any) => {
            if (item != null) {
             return <ReceiptCard key={item.id} item={item} />;
            }
          })}
        </View>
      );
    }
  } else
  */
  if (bottomModalType === '멤버목록_멤버') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      getApprovedAllMembersInfo();
    }, []);

    return (
      <View>
        <Text style={styles.modalTitle}>멤버 확인하기</Text>
        {approvedAllMembersInfo.map((item: any) => {
          if (item != null) {
            return <ParticipantCard key={item.participant_id} item={item} />;
          }
        })}
      </View>
    );
  } else if (bottomModalType === '멤버목록_호스트') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      getAllUsers();
    }, []);
    return (
      <View style={styles.memberInvitation}>
        <Text style={styles.modalTitle}>그룹원 초대</Text>
        <TextInput
          style={styles.serchTextInput}
          placeholder="그룹원 검색"
          placeholderTextColor="rgba(0, 0, 0, 0.25)"
          importantForAutofill="yes"
          onChangeText={onChangeSearchName}
          value={searchName}
          autoComplete="name"
          textContentType="name"
          returnKeyType="send"
          clearButtonMode="while-editing"
        />
        <Image
          style={styles.magnifyingGlass}
          source={require('../resources/icons/MagnifyingGlass.png')}
        />
        <ScrollView style={styles.userContainer}>
          {allUsers.map(user => {
            if (user.name.includes(searchName)) {
              return (
                <TouchableHighlight
                  key={user.id}
                  underlayColor="#d9d4d4"
                  onPress={addToGroupMember(user)}>
                  <View style={styles.userWrapper}>
                    <Image
                      style={styles.userImage}
                      source={{
                        uri: user.img_url,
                      }}
                    />
                    <Text style={styles.userName}>{user.name}</Text>
                    {selectedUsers.includes(user) ? (
                      <Image
                        style={styles.checkButton}
                        source={require('../resources/icons/buttonCheck.png')}
                      />
                    ) : (
                      <Image
                        style={styles.checkButton}
                        source={require('../resources/icons/buttonNoCheck.png')}
                      />
                    )}
                  </View>
                </TouchableHighlight>
              );
            }
          })}
        </ScrollView>
        <Pressable style={styles.button} onPress={closeBottomModal}>
          <Text style={styles.textStyle}>초대 하기</Text>
        </Pressable>
      </View>
    );
  } else {
    return <View />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Roboto',
    fontSize: 24,
    marginLeft: 20,
    marginBottom: 10,
    color: '#4D483D',
  },
  errIcon: {
    color: '#4D483D',
  },
  errScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.6,
  },
  errMsg: {
    fontSize: 20,
    fontFamily: 'Roboto',
    color: '#4D483D',
  },
  textInput: {
    padding: 5,
    borderBottomWidth: 0.3,
    borderColor: '#4D483D',
  },
  memberInvitation: {
    minHeight: 500,
    paddingLeft: 20,
    paddingRight: 20,
  },
  serchTextInput: {
    marginBottom: 40,
    fontSize: 17,
    borderBottomWidth: 1.5,
    borderColor: 'gray',
    fontFamily: 'Roboto',
    fontWeight: '900',
  },
  userWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  userImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
  },
  elementLabel: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  selectedUserContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  selectedUserWrapper: {
    paddingRight: 10,
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
  },
  selectedUserImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  selectedUserName: {
    fontSize: 10,
    fontWeight: '400',
    color: '#000000',
  },
  groupCreateButton: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 100,
    textAlign: 'center',
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  groupCreateButtonText: {
    color: 'white',
  },
  checkButton: {
    position: 'absolute',
    right: 17,
  },
  magnifyingGlass: {
    position: 'absolute',
    top: 15,
    right: 30,
  },
  userContainer: {
    height: 300,
  },
  button: {
    marginTop: 40,
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#21B8CD',
  },
  bottomSheetView: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BottomComponent;
