import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  RefreshControl,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {Theme} from '../../constant/theme';
import AntDesign from 'react-native-vector-icons/EvilIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StyleSheet} from 'react-native';
import CustomHeader from '../../Component/Header';
import {Base_Uri} from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ToastAndroid} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import upcomingClassContext from '../../context/upcomingClassContext';
import moment from 'moment';
import scheduleContext from '../../context/scheduleContext';
import AntDesig from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';

// import { ScrollView } from "react-native-gesture-handler"

function Schedule({navigation, route}: any) {
  // type ISchedule = {
  //   imageUrl: any;
  //   name: String;
  //   Subject: String;
  //   date: any;
  //   startTime: any;
  //   endTime: any;
  //   status: String;
  //   selected?: Boolean;
  // }[];

  // let upComingCont = useContext(upcomingClassContext)
  // const { upcomingClass, setUpcomingClass } = upComingCont
  // let data = upcomingClass

  let data = route.params;

  let focus = useIsFocused();

  let context = useContext(scheduleContext);
  let bannerCont = useContext(bannerContext);
  const tutorDetailsContext = useContext(TutorDetailsContext);

  let {tutorDetails} = tutorDetailsContext;

  let {schedulePageBannner, setSchedulePageBanner} = bannerCont;

  let {scheduleData, setScheduleData} = context;
  let {upcomingClass, setUpcomingClass} = context;

  const [loading, setLoading] = useState(false);
  // const [scheduleData, setScheduleData] = useState<any>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState({});

  const [mode, setMode] = useState<any>('date');
  const [confirm, setConfirm] = useState(false);
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setOpenPPModal(true);
      setRefresh(!refresh);
    }, 2000);
  }, [refresh]);

  // console.log(data, 'routeeee');

  useEffect(() => {
    if (!focus) {
      setUpcomingClass([]);
    }

    if (focus) {
      let now = new Date();

      let date = now.getDate();
      let month = now.getMonth();
      let year = now.getFullYear();

      let selectday = selectedDate.getDate();
      let selectMonth = selectedDate.getMonth();
      let selectYear = selectedDate.getFullYear();

      if (date !== selectday || selectMonth !== month || selectYear !== year) {
        setSelectedDate(new Date());
      }
    }
  }, [focus]);

  useEffect(() => {
    let now = new Date();

    let date = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();

    let selectday = selectedDate.getDate();
    let selectMonth = selectedDate.getMonth();
    let selectYear = selectedDate.getFullYear();

    if (date !== selectday || selectMonth !== month || selectYear !== year) {
      setUpcomingClass([]);
    }
  }, [selectedDate]);

  // console.log(upcomingClass, "upcomingClass")
  // console.log(scheduleData, "scheduleData")

  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({data}) => {
        console.log('res', data.bannerAds);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const getScheduledData = async () => {
    setLoading(true);
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let {tutorID} = loginData;

    if (upcomingClass && Object.keys(upcomingClass).length > 0) {
      axios
        .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
        .then(res => {
          let scheduledClasses = res.data;

          let {classSchedulesTime} = scheduledClasses;
          let checkRouteClass =
            classSchedulesTime &&
            classSchedulesTime.length > 0 &&
            classSchedulesTime.filter((e: any, i: number) => {
              return e?.id == data?.id;
            });
          checkRouteClass =
            checkRouteClass &&
            checkRouteClass.length > 0 &&
            checkRouteClass.map((e: any, i: number) => {
              return {
                ...e,
                imageUrl: require('../../Assets/Images/student.png'),
              };
            });
          setUpcomingClass(
            checkRouteClass && checkRouteClass.length > 0
              ? checkRouteClass
              : [],
          );
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });
      return;
    }
    axios
      .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
      .then(({data}) => {
        let {classSchedulesTime} = data;

        let Date = selectedDate.getDate();
        let month = selectedDate.getMonth();
        let year = selectedDate.getFullYear();

        classSchedulesTime =
          classSchedulesTime && classSchedulesTime.length > 0
            ? classSchedulesTime
                .map((e: any, i: number) => {
                  let getDate: any = moment(e.date);

                  let convertDate = getDate.toDate();
                  let scheduleDate = convertDate.getDate();
                  let scheduleMonth = convertDate.getMonth();
                  let scheduleYear = convertDate.getFullYear();

                  if (
                    Date == scheduleDate &&
                    month == scheduleMonth &&
                    year == scheduleYear
                  ) {
                    return {
                      ...e,
                      imageUrl: require('../../Assets/Images/student.png'),
                    };
                  } else {
                    return false;
                  }
                })
                .filter(Boolean)
            : [];

        axios
          .get(`${Base_Uri}getClassAttendedTime/${tutorID}`)
          .then(({data}) => {
            let {classAttendedTime} = data;

            let Date = selectedDate.getDate();
            let month = selectedDate.getMonth();
            let year = selectedDate.getFullYear();

            classAttendedTime =
              classAttendedTime && classAttendedTime.length > 0
                ? classAttendedTime
                    .map((e: any, i: number) => {
                      let getDate: any = moment(e.date);

                      let convertDate = getDate.toDate();

                      let scheduleDate = convertDate.getDate();
                      let scheduleMonth = convertDate.getMonth();
                      let scheduleYear = convertDate.getFullYear();

                      if (
                        Date == scheduleDate &&
                        month == scheduleMonth &&
                        year == scheduleYear
                      ) {
                        return {
                          ...e,
                          imageUrl: require('../../Assets/Images/student.png'),
                        };
                      } else {
                        return false;
                      }
                    })
                    .filter(Boolean)
                : [];
            setLoading(false);
            let dataToSend = [...classSchedulesTime, ...classAttendedTime];
            setScheduleData(dataToSend);
          });
      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    if (refresh || selectedDate || data || scheduleData.length == 0) {
      getScheduledData();
    }
  }, [refresh, data, selectedDate]);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate: any = selectedDate;
    setSelectedDate(currentDate);
    setShow(false);
  };

  const showMode = (currentMode: any) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const handleSelectPress = (index: Number, item: any) => {
    if (upcomingClass && upcomingClass.length > 0) {
      let myData = upcomingClass.map((e: any, i: Number) => {
        if (i == index) {
          return {
            ...e,
            selected: e?.selected ? false : true,
          };
        } else {
          return {
            ...e,
            selected: false,
          };
        }
      });
      setUpcomingClass(myData);
    }

    let data = scheduleData.map((e: any, i: Number) => {
      if (i == index) {
        return {
          ...e,
          selected: e?.selected ? false : true,
        };
      } else {
        return {
          ...e,
          selected: false,
        };
      }
    });

    setScheduleData(data);
  };

  const navigateToEditScreen = (status: any) => {
    if (status == 'schedule') {
      navigation.navigate('EditScheduleClass', {
        data: selectedData,
        schedule: true,
      });
      setConfirm(false);
    } else if (status == 'postponed') {
      navigation.navigate('EditPostpondClass', {
        data: selectedData,
        postpond: true,
      });
      setConfirm(false);
    } else if (status == 'cancelled') {
      navigation.navigate('EditCancelledClass', {
        data: selectedData,
        cancelled: true,
      });
      setConfirm(false);
    } else {
      navigation.navigate('EditAttendedClass', {
        data: selectedData,
        attended: true,
      });
      setConfirm(false);
    }
  };

  const closeBannerModal = async () => {
    if (schedulePageBannner.displayOnce == 'on') {
      let bannerData = {...schedulePageBannner};

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('scheduleBanners', stringData);
      setSchedulePageBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  const confirmModal = useCallback(() => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirm}
          // style={{backgroundColor:'rgb(0,0,0,0.5)'}}
          onRequestClose={() => {
            setConfirm(false);
          }}>
          <TouchableWithoutFeedback onPress={() => setConfirm(false)}>
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  {
                    backgroundColor: Theme.white,
                    alignItems: 'flex-start',
                    padding: 25,
                    paddingVertical: 10,
                  },
                ]}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      marginTop: 20,
                      fontSize: 16,
                      textAlign: 'left',
                      fontWeight: '600',
                    },
                  ]}>
                  Select Status
                </Text>
                {/* <TouchableOpacity
                onPress={() => navigateToEditScreen('schedule')}
                style={{width: '100%'}}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: Theme.black,
                      paddingVertical: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: Theme.lightGray,
                      width: '100%',
                    },
                  ]}>
                  Schedule
                </Text>
              </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => navigateToEditScreen('postponed')}
                  style={{width: '100%'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: Theme.black,
                        paddingVertical: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: Theme.lightGray,
                        width: '100%',
                      },
                    ]}>
                    Postponed
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigateToEditScreen('cancelled')}
                  style={{width: '100%'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: Theme.black,
                        paddingVertical: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: Theme.lightGray,
                        width: '100%',
                      },
                    ]}>
                    Cancelled
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigateToEditScreen('attended')}
                  style={{width: '100%'}}>
                  <Text
                    style={[
                      styles.text,
                      {color: Theme.black, paddingTop: 20, width: '100%'},
                    ]}>
                    Attended
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }, [confirm, selectedData]);

  const handleEditPress = (item: any): any => {
    setConfirm(true);
    setSelectedData(item);
  };

  const routeToClockIn = async (item: any) => {
    const currentTime: any = new Date();

    const startTimeStr = item.startTime;
    const startTimeParts = startTimeStr.split(':');
    const startTime: any = new Date();
    startTime.setHours(parseInt(startTimeParts[0], 10));
    startTime.setMinutes(parseInt(startTimeParts[1], 10));
    startTime.setSeconds(parseInt(startTimeParts[2], 10));

    const timeDifferenceMs = startTime - currentTime;
    const hours = Math.floor(
      (timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (hours > 1) {
      ToastAndroid.show(
        `There is ${hours} hours remaining in class`,
        ToastAndroid.SHORT,
      );
      return;
    }

    let data: any = await AsyncStorage.getItem('classInProcess');
    data = JSON.parse(data);

    if (data && Object.keys(data).length > 0) {
      ToastAndroid.show(
        'Cannot attend another class your class is already in process',
        ToastAndroid.SHORT,
      );
    } else {
      navigation.navigate('ClockIn', item);
    }
  };

  const linkToOtherPage = () => {
    if (schedulePageBannner.callToActionType == 'Open URL') {
      Linking.openURL(schedulePageBannner.urlToOpen);
    } else if (schedulePageBannner.callToActionType == 'Open Page')
      if (schedulePageBannner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (schedulePageBannner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (schedulePageBannner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (schedulePageBannner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (schedulePageBannner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (schedulePageBannner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (schedulePageBannner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (schedulePageBannner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (schedulePageBannner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  function convertTo12HourFormat(time24: string | null): string {
    if (!time24) {
      return ''; // Return an empty string or some default value when time24 is null
    }
    const [hourStr, minuteStr] = time24.split(':');
    const hour = parseInt(hourStr);
    let period = 'AM';
    let twelveHour = hour;

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) {
        twelveHour = hour - 12;
      }
    }

    if (twelveHour === 0) {
      twelveHour = 12;
    }

    return `${twelveHour}:${minuteStr} ${period}`;
  }

  const renderScheduleData = ({item, index}: any): any => {
    let nowDate: Date = new Date();
    let date = nowDate.getDate();
    let month = nowDate.getMonth();
    let year = nowDate.getFullYear();

    let getDate: any = moment(item?.date);
    let classDate = getDate.toDate();

    let schdeuledDate = classDate.getDate();
    let scheduledMonth = classDate.getMonth();
    let scheduledYear = classDate.getFullYear();

    let flag =
      date == schdeuledDate && month == scheduledMonth && year == scheduledYear;

    const startTime12Hour = convertTo12HourFormat(item.startTime);
    const endTime12Hour = convertTo12HourFormat(item.endTime);

    return (
      <TouchableOpacity
        onPress={() => handleSelectPress(index, item)}
        style={{
          borderWidth: 1,
          borderColor: item.selected ? Theme.darkGray : 'silver',
          // borderColor:  'silver',
          padding: 20,
          // backgroundColor: item.selected ? 'silver' : 'silver',
          marginTop: 20,
          borderRadius: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              borderWidth: 1,
              borderColor: Theme.lightGray,
              borderRadius: 100,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Theme.darkGray,
            }}>
            <Image source={item.imageUrl} style={{width: 35, height: 35}} />
          </View>
          <Text style={{fontSize: 16, color: Theme.gray, marginLeft: 10}}>
            {item?.studentName}
          </Text>
        </View>

        <View style={{marginTop: 10, flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 14,
              color: Theme.black,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
            {item.subjectName ?? item?.subject_name}
          </Text>
        </View>

        <Text style={{color: Theme.gray, marginTop: 10}}>
          {convertDateDayFormat(item.date)}
        </Text>
        <Text style={{color: Theme.gray}}>
          {startTime12Hour} to {endTime12Hour}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: Theme.gray, marginTop: 10}}>{item.status}</Text>
          {item.status == 'Attended' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AttendedDetails')}>
              <Text style={{color: Theme.gray, marginTop: 10}}>
                View Details
              </Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
        </View>
        {item.selected && item?.status?.toLowerCase() == 'scheduled' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: !flag ? 'center' : 'space-between',
              width: '100%',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => handleEditPress(item)}
              style={{
                backgroundColor: Theme.gray,
                width: '48%',
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{textAlign: 'center', fontSize: 14, color: 'white'}}>
                Edit
              </Text>
            </TouchableOpacity>
            {flag && (
              <TouchableOpacity
                onPress={() => routeToClockIn(item)}
                style={{
                  backgroundColor: Theme.darkGray,
                  width: '48%',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 14, color: 'white'}}>
                  Attend
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {/* {item.selected && item.status == 'attended' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AttendedDetails', item)}
              style={{
                backgroundColor: Theme.darkGray,
                width: '48%',
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{textAlign: 'center', fontSize: 14, color: 'white'}}>
                View
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
      </TouchableOpacity>
    );
  };

  function convertDateFormat(date: any): any {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  function convertDateDayFormat(date: string): string {
    const dateObj = new Date(date);
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayName = daysOfWeek[dateObj.getDay()];
    const day = dateObj.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'August',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${dayName}, ${day} ${monthNames[monthIndex]} ${year}`;
  }

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={Theme.black} />
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <CustomHeader
        title="Schedule"
        plus={scheduleData.length !== 0}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        nestedScrollEnabled={true}>
        <View style={{padding: 20}}>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 5,
            }}>
            <Text style={{fontSize: 18, color: Theme.black, fontWeight: '700'}}>
              {/* {selectedDate.toString().slice(4, 15)} */}
              {convertDateFormat(selectedDate)}
            </Text>
            <AntDesig name="caretdown" color={Theme.black} size={12} />
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          {scheduleData.length == 0 &&
          Object.keys(upcomingClass).length == 0 ? (
            <View
              style={{
                height: Dimensions.get('window').height - 180,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', color: Theme.black}}>
                No class, Yet
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Theme.gray,
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                Look like you haven't{'\n'} added any class
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Theme.white,
                  marginVertical: 20,
                  width: '94%',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('AddClass')}
                  style={{
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: Theme.darkGray,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    Add Class
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              nestedScrollEnabled={true}
              data={upcomingClass.length > 0 ? upcomingClass : scheduleData}
              renderItem={renderScheduleData}
            />
          )}
        </View>

        {confirm && confirmModal()}
        {/* {confirmModal()} */}
      </ScrollView>
      {Object.keys(schedulePageBannner).length > 0 &&
        (schedulePageBannner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{flex: 1}}>
            <Modal
              visible={openPPModal}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={() => linkToOtherPage()}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    marginHorizontal: 20,
                  }}>
                  <TouchableOpacity onPress={() => closeBannerModal()}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        paddingVertical: 10,
                        paddingRight: 15,
                      }}>
                      <AntDesig name="closecircleo" size={20} color={'black'} />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{uri: schedulePageBannner.bannerImage}}
                    style={{
                      width: Dimensions.get('screen').width / 1.1,
                      height: '80%',
                    }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
    </View>
  );
}

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.primary,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerText: {
    color: '#959595',
    fontSize: 14,
    backgroundColor: Theme.white,
    borderRadius: 20,
    borderColor: Theme.secondary,
    padding: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  innerContainer: {
    width: '85%',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 26,
    color: Theme.black,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: Theme.black,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: 320,
    bottom: 0,
  },
  modalView: {
    backgroundColor: '#151c15',
    borderRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: Theme.black,
  },
});
