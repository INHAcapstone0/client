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
import {RootState} from '../store/Store';
import FormButton from '../components/FormButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';
import {scheduleAction} from '../slices/Schedule';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
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

function CreateGroupFinalPage({navigation}: any) {
  const [searchName, setSearchName] = useState('');
  const [selectedUsers, setSelectedUseres] = useState<Array<userType>>([]);
  const [allUsers, setAllUsers] = useState<Array<userType>>([]);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);

  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const ownerId = useSelector((state: RootState) => state.persist.user.id);
  const {groupName, startAt, endAt} = useSelector(
    (state: RootState) => state.persist.schedule,
  );

  const toggleMemberModal = () => {
    setIsMemberModalVisible(!isMemberModalVisible);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        'http://146.56.188.32:8002/users?exceptMe=true',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setAllUsers(response.data);
    } catch (err: any) {
      console.log(err.response);
    }
  };

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

  const createGroup = async () => {
    try {
      const selectedUsersId: string[] = [];

      selectedUsers.filter(user => selectedUsersId.push(user.id));

      console.log(groupName);
      console.log(ownerId);
      console.log(startAt);
      console.log(endAt);
      console.log(selectedUsersId);
      console.log(accessToken);

      const result = await axios.post(
        'http://146.56.188.32:8002/schedules',
        {
          name: groupName,
          owner_id: ownerId,
          startAt: startAt,
          endAt: endAt,
          participants: selectedUsersId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: '그룹생성이 완료되었습니다',
      });

      setTimeout(() => {
        navigation.reset({
          routes: [
            {
              name: 'HomePage',
            },
          ],
        });
      }, 1000);

      // Alert.alert('알림', '그룹생성이 완료되었습니다', [
      //   {
      //     text: '확인',
      //     onPress: () => {
      //       navigation.reset({
      //         routes: [
      //           {
      //             name: 'HomePage',
      //           },
      //         ],
      //       });
      //     },
      //   },
      // ]);
    } catch (err: any) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: err.response.data.msg,
      });
      console.log(err.response.data.msg);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.groupCreateWrapper}>
        <AlertNotificationRoot>
          <View style={styles.stepWrapper}>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/check.png')} />
              <Text style={styles.stepActiveText}>그룹 이름</Text>
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/check.png')} />
              <Text style={styles.stepText}>일정/시간 설정</Text>
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/thirdCheck.png')} />
              <Text style={styles.stepText}>그룹원 초대</Text>
            </View>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.elementLabel}>그룹원 초대</Text>
            <Text style={styles.elementSubLabel}>
              스케줄을 함께 할 그룹원을 초대하세요
            </Text>
            <Button
              color="#21B8CD"
              title="그룹원 초대"
              onPress={toggleMemberModal}
            />
            <Modal
              animationType="slide"
              transparent={false}
              visible={isMemberModalVisible}
              onRequestClose={() => {
                setIsMemberModalVisible(!isMemberModalVisible);
              }}>
              <ScrollView style={styles.memberInvitation}>
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
                <>
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
                                uri: 'https://firebasestorage.googleapis.com/v0/b/instagram-aaebd.appspot.com/o/profile_image.jpg?alt=media&token=5bebe0eb-6552-40f6-9aef-cd11d816b619',
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
                </>
                <Pressable style={styles.button} onPress={toggleMemberModal}>
                  <Text style={styles.textStyle}>초대 하기</Text>
                </Pressable>
              </ScrollView>
            </Modal>
          </View>
          <View style={styles.nextButton}>
            <Button
              color="#21B8CD"
              title="스케줄 생성하기"
              onPress={createGroup}
            />
          </View>
        </AlertNotificationRoot>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  stepText: {
    marginTop: 5,
    fontSize: 11,
  },
  groupCreateWrapper: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 250,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
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
  },
  elementSubLabel: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 20,
  },
  memberInvitation: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#4D483D',
  },
  serchTextInput: {
    marginBottom: 40,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#4D483D',
    fontFamily: 'Roboto',
  },
  userWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    // paddingLeft: 20,
  },
  userImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  selectedUserWrapper: {
    paddingRight: 10,
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
  },
  selectedUserContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  selectedUserName: {
    fontSize: 10,
    fontWeight: '400',
    color: '#000000',
  },
  selectedUserImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  groupCreateButton: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 50,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    color: '#4D483D',
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#21B8CD',
  },
  buttonClose: {
    backgroundColor: '#4D483D',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  nextButton: {
    borderRadius: 10,
    marginTop: Dimensions.get('window').height / 2,
  },
});
export default CreateGroupFinalPage;
