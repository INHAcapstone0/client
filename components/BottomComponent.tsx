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
}
function BottomComponent({
  selectedScheduleId,
  bottomModalType,
}: BottomComponentProps) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const [approvedAllMembersInfo, setApprovedAllMembersInfo] = useState([]);
  const [allReceiptsInfo, setAllReceiptsInfo] = useState([]);
  const [errFlag, setErrFlag] = useState(false);

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

  const getAllApprovedMembers = async () => {
    try {
      const params = {
        schedule_id: selectedScheduleId,
        status: '승인',
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

  if (bottomModalType === '지출요약') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      getAllReceipts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      getAllApprovedMembers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
});

export default BottomComponent;
