import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
  Modal,
  Linking,
} from 'react-native';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import { useIsFocused } from '@react-navigation/native';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import StudentContext from '../../context/studentContext';
import filterContext from '../../context/filterContext';
import upcomingClassContext from '../../context/upcomingClassContext';
import paymentContext from '../../context/paymentHistoryContext';
import scheduleContext from '../../context/scheduleContext';
import reportSubmissionContext from '../../context/reportSubmissionContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import notificationContext from '../../context/notificationContext';
import bannerContext from '../../context/bannerContext';
import messaging from '@react-native-firebase/messaging';
import scheduleNotificationContext from '../../context/scheduleNotificationContext';
import DropDownModalView from '../../Component/DropDownModalView';
import CustomDropDown from '../../Component/CustomDropDown';
function Home({ navigation, route }: any) {
  const [teacherData, setTeacherData] = useState<any>()
  const [teachersData, setTeachersData] = useState<any>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<any>()
  const [searchTeacher, setSearchTeacher] = useState<any>()
  const [classInProcess, setClassInProcess] = useState({});
  const date: Date = new Date();
  const currentDate: string = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const currentMonth: string = date.toLocaleDateString('en-US', {
    month: 'long',
  });

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('teacherData');
      // console.log("jsonValue", jsonValue);
   
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // Error retrieving data
      console.error('Error retrieving data:', e);
    }
  };


  const getTeachers = async () => {
    try {
      const teachersValue = await AsyncStorage.getItem('teachers');
      if (teachersValue !== null) {
        let teachers = JSON.parse(teachersValue);
        teachers = teachers && teachers?.length > 0 && teachers?.map((e: any, i: number) => {
          return {
            ...e,
            subject: e?.first_name
          }
        })

        setTeachersData(teachers);
      }
    } catch (error) {
      console.error('Error retrieving teachers:', error);
    }
  };
  const focus = useIsFocused()
  const getClassInProcess = async () => {
    let data: any = await AsyncStorage.getItem('classInProcess');
    data = JSON.parse(data);

    setClassInProcess(data);
  };

  useEffect(() => {
    getClassInProcess()
    getTeachers();
    getData().then(data => {
      if (data) {
        setTeacherData(data)
        setSelectedTeacher(data)
        
      } else {
        console.log('No data found');
        AsyncStorage.removeItem('teacherData')
        AsyncStorage.removeItem('teachers')
        navigation.replace('Login')
      }
    });
  }, [classInProcess,focus])
  // console.log("teachersData", teachersData);
  // console.log("selectedTeacher", selectedTeacher);
  const handleSearchData = (text: string, type: string) => {
    let myData = teachersData && teachersData.length > 0 && teachersData.filter((e: any, i: number) => {

      if (e?.first_name?.toLowerCase()?.includes(text?.toLowerCase())) {
        return e
      }
    })
    setSearchTeacher(myData)
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, {}]}
        showsVerticalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 15 }}>
            <Text style={[styles.text, { fontSize: 20 }]}>Assalam o Alaykum,</Text>
            <Text style={[styles.heading, { fontSize: 22 }]}>
              {teacherData?.first_name} {teacherData?.last_name}
            </Text>
          </View>

          <View style={styles.firstBox}>
            <Text style={[styles.text, { color: Theme.white, fontSize: 12 }]}>
              {currentDate}
            </Text>
            <Text
              style={[styles.heading, { color: Theme.white, fontWeight: '400' }]}>
              {teacherData?.department} Teacher
            </Text>
            <Text style={[styles.text, {color: Theme.white, fontSize: 12}]}>
              {teacherData?.mobileno}
            </Text>
          </View>


          <View style={{ marginTop: 25 }}>
            <Text style={[styles.heading, { fontSize: 16 }]}>
              Summary
            </Text>
            <Text
              style={[
                styles.text,
                { fontSize: 14, color: Theme.gray, fontWeight: '500' },
              ]}>
              {currentMonth}
            </Text>
          </View>
          {/* attended hours */}
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                alignItems: 'center',
              }}>
              <View
                style={{ backgroundColor: 'pink', padding: 10, borderRadius: 8 }}>
                <Image
                  source={require('../../Assets/Images/timer-or-chronometer-tool.png')}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                <Text style={[styles.text, { fontSize: 12 }]}>
                  Clock In
                </Text>
                <Text style={[styles.text, { fontSize: 16, fontWeight: '700' }]}>
                  {teacherData?.clockin}
                </Text>
              </View>
            </View>
            {/* Active student */}
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#c1a7b0',
                  padding: 10,
                  borderRadius: 8,
                }}>
                <Image
                  // source={require('../../Assets/Images/student.png')}
                  source={require('../../Assets/Images/clock.png')}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                <Text style={[styles.text, { fontSize: 12 }]}>
                  Clock Out
                </Text>
                <Text style={[styles.text, { fontSize: 16, fontWeight: '700' }]}>
                  {teacherData?.clockout}
                </Text>
              </View>
            </View>
          </View>
          {/*Schedule hours & cancel hours  */}
          {/* <View style={{flexDirection: 'row', marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#e9ccb1',
                  padding: 10,
                  borderRadius: 8,
                }}>
                <Image
                  source={require('../../Assets/Images/scheduled.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 10}}>
                <Text style={[styles.text, {fontSize: 12}]}>
                  Schedule hours
                </Text>
                <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
                  34
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#e8e6b9',
                  padding: 10,
                  borderRadius: 8,
                }}>
                <Image
                  source={require('../../Assets/Images/clock.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 10}}>
                <Text style={[styles.text, {fontSize: 12}]}>
                  Cancelled hours
                </Text>
                <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
                  23
                </Text>
              </View>
            </View>
          </View> */}


          {/* <CustomDropDown
            dataShow={5}
            search={"first_name"}
            searchData={searchTeacher}
            searchFunc={handleSearchData}
            setSelectedSubject={setSelectedTeacher}
            selectedSubject={selectedTeacher}
            ddTitle="Select Teacher"
            headingStyle={{ color: Theme.black, fontWeight: "700" }}
            dropdownPlace={"Select Teachers"}
            dropdownContainerStyle={{
              paddingVertical: 15,
            }}
            subject={teachersData}
            categoryShow={"first_name"}
          /> */}
          
          {classInProcess && Object.keys(classInProcess).length > 0 ? (
            <TouchableOpacity
            activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ClassTimerCount', classInProcess)
              }
              style={[
                styles.firstBox,
                {
                  backgroundColor: Theme.lightGray,
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  flexDirection: 'row',
                  marginTop: 10,
                },
              ]}>
              <Text style={[styles.text, {color: Theme.black, fontSize: 12}]}>
                You have ongoing class
              </Text>
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: 'white',
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={[styles.text, {fontSize: 10, color: Theme.white}]}>
                  <ActivityIndicator color={'blue'} size="small" />
                </Text>
              </View>
            </TouchableOpacity>
          ):(
          <TouchableOpacity  onPress={() => navigation.navigate('ClockIn',selectedTeacher)} style={{ backgroundColor: Theme.darkGray, width: "100%", padding: 10, borderRadius: 10, marginTop: 50 }} >
            <Text style={{ textAlign: "center", fontSize: 16, color: 'white',  }} >
              Start Class
            </Text>
          </TouchableOpacity>
        )}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
    padding: 15,
  },
  text: {
    color: Theme.black,
    fontSize: 22,
  },
  heading: {
    color: Theme.black,
    fontSize: 22,
    fontWeight: '500',
  },
  firstBox: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: Theme.darkGray,
    borderRadius: 6,
    marginTop: 15,
  },
});
