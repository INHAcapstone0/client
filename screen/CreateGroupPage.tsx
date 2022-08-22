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
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {format} from 'date-fns';

interface selectDateType {
  [key: string]: {[key: string]: boolean};
}

function CreateGroupPage({navigation}: any) {
  const [groupName, setGroupName] = useState('');
  const groupNameRef = useRef<TextInput | null>(null);
  const calendarRef = useRef<TextInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<selectDateType>({});
  const [selectedDayes, setSelectedDayes] = useState<Array<string>>([]);

  useEffect(() => {
    groupNameRef.current?.focus();
  }, []);

  const onChangeGroupName = useCallback((text: string) => {
    setGroupName(text.trim());
  }, []);

  const addSelectedDate = (date: string) => {
    if (selectedDate[date] !== undefined) {
      setSelectedDate({});
      setSelectedDayes([]);
    } else {
      const newlyAddedDate: any = {};
      if (Object.keys(selectedDate).length > 0) {
        const newDate = new Date(date);
        const minDate = new Date(selectedDayes[0]);
        const maxDate = new Date(selectedDayes[selectedDayes.length - 1]);
        while (newDate < minDate) {
          newlyAddedDate[newDate.toISOString().split('T')[0]] = {
            selected: true,
          };
          setSelectedDate({...selectedDate, ...newlyAddedDate});
          setSelectedDayes([
            ...selectedDayes,
            newDate.toISOString().split('T')[0],
          ]);
          newDate.setDate(newDate.getDate() + 1);
        }
        while (newDate > maxDate) {
          newlyAddedDate[newDate.toISOString().split('T')[0]] = {
            selected: true,
          };
          setSelectedDate({...selectedDate, ...newlyAddedDate});
          setSelectedDayes([
            ...selectedDayes,
            newDate.toISOString().split('T')[0],
          ]);
          newDate.setDate(newDate.getDate() - 1);
        }
      } else {
        const newDate: any = {};
        newDate[date] = {selected: true};
        setSelectedDate({...selectedDate, ...newDate});
        setSelectedDayes([...selectedDayes, date]);
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.groupCreateWrapper}>
        <Text style={styles.headerLabel}>새그룹 생성하기</Text>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>그룹 이름</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeGroupName}
            placeholder="그룹명을 입력해주세요"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            textContentType="familyName"
            value={groupName}
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={groupNameRef}
            onSubmitEditing={() => calendarRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>일정 선택</Text>
          <Calendar
            style={styles.calendar}
            markedDates={selectedDate}
            ref={calendarRef}
            theme={{
              selectedDayBackgroundColor: '#4D483D',
              arrowColor: '#4D483D',
              dotColor: '#4D483D',
              todayTextColor: '#4D483D',
            }}
            onDayPress={day => {
              addSelectedDate(day.dateString);
            }}
          />
        </View>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>그룹원 선택</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: 0.3,
    borderColor: '#4D483D',
  },
  groupCreateWrapper: {
    padding: 20,
  },
  elementWrapper: {
    paddingBottom: 15,
  },
  headerLabel: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 10,
    marginBottom: 20,
  },
  elementLabel: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  calendar: {
    // borderWidth: 0.5,
    borderColor: '#4D483D',
  },
  buttonZone: {
    alignItems: 'center',
  },
});
export default CreateGroupPage;
