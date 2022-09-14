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
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const [approvedAllMembersInfo, setApprovedAllMembersInfo] = useState([]);
  const [allReceiptsInfo, setAllReceiptsInfo] = useState([]);
  const [errFlag, setErrFlag] = useState(false);
  const [allUsers, setAllUsers] = useState<Array<userType>>([]);
  const [searchName, setSearchName] = useState('');
  const [selectedUsers, setSelectedUseres] = useState<Array<userType>>([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const onChangeSearchName = useCallback((text: string) => {
    setSearchName(text.trim());
  }, []);

  const addToGroupMember = (user: userType) => (event: any) => {
    console.log(user);
    console.log(selectedUsers.includes(user));
    if (selectedUsers.includes(user)) {
      return;
    }
    setSelectedUseres([...selectedUsers, user]);
  };

  const removeToGroupMember = (user: userType) => (event: any) => {
    const newSelectedUsers = selectedUsers.filter(
      selectedUser => selectedUser.id !== user.id,
    );
    setSelectedUseres(newSelectedUsers);
  };

  const InviteAdditionalMember = async () => {
    try {
      console.log(selectedUsers);
      console.log(selectedScheduleId);

      const selectedUsersId: string[] = [];

      selectedUsers.filter(user => selectedUsersId.push(user.id));

      console.log(selectedUsersId);

      await axios.post(
        'http://10.0.2.2:8002/participants',
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
      Alert.alert('알림', '그룹원 초대를 완료되었습니다', [
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
      const params = {
        schedule_id: selectedScheduleId,
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get('http://10.0.2.2:8002/receipts', {
        params,
        headers,
      });
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
      const params = {
        schedule_id: selectedScheduleId,
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get('http://10.0.2.2:8002/participants', {
        params,
        headers,
      });
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
      const response = await axios.get(
        `http://10.0.2.2:8002/users/rest?exceptScheduleId=${selectedScheduleId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      setAllUsers(response.data);
    } catch (err: any) {
      console.log(err.response.data.msg);
    }
  };

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
  } else if (bottomModalType === '멤버목록_멤버') {
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
    return (
      <ScrollView style={styles.memberInvitation}>
        <Text style={styles.elementLabel}>그룹원 초대</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.selectedUserContainer}>
            {selectedUsers.map((user: userType) => (
              <TouchableOpacity
                style={styles.selectedUserWrapper}
                onPress={removeToGroupMember(user)}
                key={user.id}>
                <Image
                  style={styles.selectedUserImage}
                  source={{
                    uri: user.img_url,
                  }}
                />
                <Text style={styles.selectedUserName}>{user.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TextInput
          style={styles.serchTextInput}
          placeholder="그룹원 검색"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          onChangeText={onChangeSearchName}
          value={searchName}
          autoComplete="name"
          textContentType="name"
          returnKeyType="send"
          clearButtonMode="while-editing"
        />
        {allUsers.map((user: userType) => {
          if (user.name.includes(searchName)) {
            return (
              <TouchableHighlight
                key={user.id}
                underlayColor="#d9d4d4"
                onPress={addToGroupMember(user)}>
                <View style={styles.userWrapper} key={user.id}>
                  <Image
                    style={styles.userImage}
                    key={user.id}
                    source={{
                      uri: user.img_url,
                    }}
                  />
                  <Text style={styles.userName} key={user.id}>
                    {user.name}
                  </Text>
                </View>
              </TouchableHighlight>
            );
          }
        })}
        <Pressable
          onPress={InviteAdditionalMember}
          style={styles.groupCreateButton}>
          <Text style={styles.groupCreateButtonText}>초대하기</Text>
        </Pressable>
      </ScrollView>
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
    fontFamily: 'Jalnan',
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
    fontFamily: 'Jalnan',
    color: '#4D483D',
  },
  textInput: {
    padding: 5,
    borderBottomWidth: 0.3,
    borderColor: '#4D483D',
  },
  memberInvitation: {
    minHeight: 500,
    borderWidth: 1,
    borderColor: '#4D483D',
    paddingLeft: 20,
    paddingRight: 20,
  },
  serchTextInput: {
    marginBottom: 20,
    paddingLeft: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4D483D',
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
});

export default BottomComponent;
