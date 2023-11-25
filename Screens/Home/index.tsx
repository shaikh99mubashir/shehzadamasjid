import React, {useEffect, useState, useContext} from 'react';
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
import {Theme} from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import {useIsFocused} from '@react-navigation/native';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import StudentContext from '../../context/studentContext';
import filterContext from '../../context/filterContext';
import UpcomingClassState from '../../context/upccmomingClassState';
import upcomingClassContext from '../../context/upcomingClassContext';
import paymentContext from '../../context/paymentHistoryContext';
import scheduleContext from '../../context/scheduleContext';
import reportSubmissionContext from '../../context/reportSubmissionContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import notificationContext from '../../context/notificationContext';
import bannerContext from '../../context/bannerContext';
import messaging from '@react-native-firebase/messaging';
import scheduleNotificationContext from '../../context/scheduleNotificationContext';
function Home({navigation, route}: any) {
  let key = route.key;

  const scheduleNotCont = useContext(scheduleNotificationContext);

  let {scheduleNotification, setScheduleNotification} = scheduleNotCont;

  const context = useContext(TutorDetailsContext);
  const filter = useContext(filterContext);
  const studentAndSubjectContext = useContext(StudentContext);
  const notContext = useContext(notificationContext);
  let {notification, setNotification} = notContext;
  const {setCategory, setSubjects, setState, setCity} = filter;
  const [refreshing, setRefreshing] = useState(false);
  const upcomingClassCont = useContext(upcomingClassContext);
  const paymentHistory = useContext(paymentContext);
  const bannerCon = useContext(bannerContext);

  let {
    homePageBanner,
    setHomePageBanner,
    schedulePageBannner,
    setSchedulePageBanner,
    jobTicketBanner,
    setJobTicketBanner,
    profileBanner,
    setProfileBanner,
    paymentHistoryBanner,
    setPaymentHistoryBanner,
    reportSubmissionBanner,
    setReportSubmissionBanner,
    inboxBanner,
    setInboxBanner,
    faqBanner,
    setFaqBanner,
    studentBanner,
    setStudentBanner,
  } = bannerCon;

  const upcomingContext = useContext(scheduleContext);

  let {commissionData, setCommissionData} = paymentHistory;
  let {upcomingClass, setUpcomingClass, scheduleData, setScheduleData} =
    upcomingContext;

  const {tutorDetails, updateTutorDetails} = context;
  const {students, subjects, updateStudent, updateSubject} =
    studentAndSubjectContext;
  let reportContext = useContext(reportSubmissionContext);

  let {
    reportSubmission,
    setreportSubmission,
    progressReport,
    setProgressReport,
  } = reportContext;

  const focus = useIsFocused();

  const date: Date = new Date();
  const currentDate: string = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const currentMonth: string = date.toLocaleDateString('en-US', {
    month: 'long',
  });

  const [upCommingClasses, setUpCommingClasses] = useState([
    // {
    //   id: 1,
    //   image: require('../../Assets/Images/woman.png'),
    //   name: 'testing1',
    //   title: 'Add Math (DEGREE) Online',
    //   time: '12:00 PM to 7:00 PM',
    //   date: '20 May 2023',
    // },
    // {
    //   id: 2,
    //   image: require('../../Assets/Images/woman.png'),
    //   name: 'testing2',
    //   title: 'Add History (DEGREE) Online',
    //   time: '12:00 PM to 7:00 PM',
    //   date: '20 May 2023',
    // },
  ]);
  const [notificationLenght, setNotificationLength] = useState(0);
  const [tutorId, setTutorId] = useState<Number | null>(null);
  const [classInProcess, setClassInProcess] = useState({});

  const [tutorData, setTutorData] = useState({
    cummulativeCommission: '',
    attendedHours: '',
    activeHours: '',
    cancelledHours: '',
    scheduledHours: '',
  });

  const [cummulativeCommission, setCumulativeCommission] = useState('');
  const [attendedHours, setAttendedHours] = useState('');
  const [activeHours, setActiveHours] = useState('');
  const [cancelledHours, setCancelledHours] = useState('');
  const [schedulesHours, setScheduledHours] = useState('');
  const [tutorStudents, setTutorStudents] = useState([]);
  const [bannerData, setBannerData] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setOpenPPModal(true);
      getTutorId();
    }, 2000);
  }, [refreshing]);

  const getTutorId = async () => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(data);

    let {tutorID} = loginData;
    setTutorId(tutorID);
  };

  const getPaymentHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');
    data = JSON.parse(data);
    let {tutorID} = data;

    axios
      .get(`${Base_Uri}tutorPayments/${tutorID}`)
      .then(({data}) => {
        let {response} = data;

        setCommissionData(response);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getNotificationLength = async () => {
    axios
      .get(`${Base_Uri}api/notifications/${tutorId}`)
      .then(({data}) => {
        let length = 0;
        let {notifications} = data;
        let tutorNotification =
          notifications.length > 0 &&
          notifications.filter((e: any, i: number) => {
            return e.status == 'new';
          });
        setNotification(tutorNotification);
        // // setNotificationLength(tutorNotification.length > 0 ? tutorNotification.length : 0);
        // length =
        //   length + tutorNotification.length > 0 ? tutorNotification.length : 0;

        // setNotificationLength(length);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getClassInProcess = async () => {
    let data: any = await AsyncStorage.getItem('classInProcess');
    data = JSON.parse(data);

    setClassInProcess(data);
  };

  const sendDeviceTokenToDatabase = () => {
    messaging()
      .requestPermission()
      .then(() => {
        // Retrieve the FCM token
        return messaging().getToken();
      })
      .then(token => {
        messaging()
          .subscribeToTopic('all_devices')
          .then(() => {
            console.log(token, 'token');

            let formData = new FormData();

            formData.append('tutor_id', tutorId);
            formData.append('device_token', token);

            axios
              .post(`${Base_Uri}api/getTutorDeviceToken`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(res => {
                let data = res.data;
                console.log(data, 'tokenResponse');
              })
              .catch(error => {
                console.log(error, 'error');
              });
          })
          .catch(error => {
            console.error('Failed to subscribe to topic: all_devices', error);
          });
      })
      .catch(error => {
        console.error(
          'Error requesting permission or retrieving token:',
          error,
        );
      });
  };

  useEffect(() => {
    if (tutorId) {
      sendDeviceTokenToDatabase();
    }
  }, [tutorId]);

  useEffect(() => {
    getTutorId();
    getClassInProcess();
  }, [focus, refreshing]);

  const getCategory = () => {
    axios
      .get(`${Base_Uri}getCategories`)
      .then(({data}) => {
        let {categories} = data;

        let myCategories =
          categories &&
          categories.length > 0 &&
          categories.map((e: any, i: Number) => {
            if (e.category_name) {
              return {
                subject: e.category_name,
                id: e.id,
              };
            }
          });
        setCategory(myCategories);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getSubject = () => {
    axios
      .get(`${Base_Uri}getSubjects`)
      .then(({data}) => {
        let {subjects} = data;

        let mySubject =
          subjects &&
          subjects.length > 0 &&
          subjects.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });

        setSubjects(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getStates = () => {
    axios
      .get(`${Base_Uri}getStates`)
      .then(({data}) => {
        let {states} = data;

        let myStates =
          states &&
          states.length > 0 &&
          states.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });

        setState(myStates);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCities = () => {
    axios
      .get(`${Base_Uri}getCities`)
      .then(({data}) => {
        let {cities} = data;
        let myCities =
          cities &&
          cities.length > 0 &&
          cities.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });
        setCity(myCities);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getReportSubmissionHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let {tutorID} = data;

    axios
      .get(`${Base_Uri}api/tutorFirstReportListing/${tutorID}`)
      .then(({data}) => {
        let {tutorReportListing} = data;
        setreportSubmission(tutorReportListing);
      })
      .catch(error => {
        console.log('error');
      });
  };

  const getProgressReportHistory = async () => {
    let data: any = await AsyncStorage.getItem('loginAuth');

    data = JSON.parse(data);

    let {tutorID} = data;

    axios
      .get(`${Base_Uri}api/progressReportListing`)
      .then(({data}) => {
        let {progressReportListing} = data;

        let tutorReport =
          progressReportListing &&
          progressReportListing.length > 0 &&
          progressReportListing.filter((e: any, i: number) => {
            return e.tutorID == tutorID;
          });

        // console.log(tutorReport, "reoirt")
        setProgressReport(
          tutorReport && tutorReport.length > 0 ? tutorReport : [],
        );
      })
      .catch(error => {
        console.log('error');
      });
  };

  useEffect(() => {
    getCategory();
    getSubject();
    getStates();
    getCities();
    getPaymentHistory();
    getReportSubmissionHistory();
    getProgressReportHistory();
  }, [refreshing]);

  const getTutorDetails = async () => {
    axios
      .get(`${Base_Uri}getTutorDetailByID/${tutorId}`)
      .then(({data}) => {
        let {tutorDetailById} = data;
        let tutorDetails = tutorDetailById[0];
        let details = {
          full_name: tutorDetails?.full_name,
          email: tutorDetails?.email,
          displayName: tutorDetails?.displayName,
          gender: tutorDetails?.gender,
          phoneNumber: tutorDetails.phoneNumber,
          age: tutorDetails.age,
          nric: tutorDetails.nric,
          tutorImage: tutorDetails.tutorImage,
          tutorId: tutorDetails?.id,
          status: tutorDetails?.status,
        };

        updateTutorDetails(details);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getScheduleNotification = () => {
    axios
      .get(`${Base_Uri}api/classScheduleStatusNotifications/${tutorId}`)
      .then(res => {
        let {data} = res;

        setScheduleNotification(data.record);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    tutorId && getNotificationLength();
    tutorId && getTutorDetails();
    tutorId && getScheduleNotification();
  }, [tutorId, refreshing]);

  const getCummulativeCommission = () => {
    axios
      .get(`${Base_Uri}getCommulativeCommission/${tutorId}`)
      .then(({data}) => {
        setCumulativeCommission(data.commulativeCommission);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getAttendedHours = () => {
    axios
      .get(`${Base_Uri}getAttendedHours/${tutorId}`)
      .then(({data}) => {
        // setTutorData({ ...tutorData, attendedHours: data.attendedHours });
        setAttendedHours(data.attendedHours);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getScheduledHours = () => {
    axios
      .get(`${Base_Uri}getScheduledHours/${tutorId}`)
      .then(({data}) => {
        setScheduledHours(data.scheduledHours);
        // setTutorData({ ...tutorData, scheduledHours: data.scheduledHours });
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getCancelledHours = () => {
    console.log(tutorId, 'iddd');

    axios
      .get(`${Base_Uri}getCancelledHours/${tutorId}`)
      .then(({data}) => {
        console.log(cancelledHours, 'hoursss');

        setCancelledHours(data.cancelledHours);
        // setTutorData({ ...tutorData, cancelledHours: data.cancelledHours });
      })
      .catch(error => {
        // console.log(error,"errror")
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorStudents = () => {
    axios
      .get(`${Base_Uri}getTutorStudents/${tutorId}`)
      .then(({data}) => {
        const {tutorStudents} = data;
        console.log(tutorStudents);
        
        setTutorStudents(tutorStudents);
        updateStudent(tutorStudents);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  const getTutorSubjects = () => {
    axios
      .get(`${Base_Uri}getTutorSubjects/${tutorId}`)
      .then(({data}) => {
        let {tutorSubjects} = data;

        let mySubject =
          tutorSubjects &&
          tutorSubjects.length > 0 &&
          tutorSubjects.map((e: any, i: Number) => {
            if (e.name) {
              return {
                subject: e.name,
                id: e.id,
              };
            }
          });

        updateSubject(mySubject);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getUpcomingClasses = () => {
    axios
      .get(`${Base_Uri}getUpcomingClassesByTutorID/${tutorId}`)
      .then(({data}) => {
        const {classSchedules} = data;
        setUpCommingClasses(classSchedules);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    if (tutorId) {
      getCummulativeCommission();
    }
  }, [tutorId, refreshing]);

  useEffect(() => {
    if (tutorId) {
      getUpcomingClasses();
    }
  }, [tutorId, refreshing]);

  useEffect(() => {
    if (tutorId && cummulativeCommission) {
      getAttendedHours();
      getScheduledHours();
      getTutorStudents();
      getTutorSubjects();
      getCancelledHours();
    }
  }, [cummulativeCommission, refreshing]);
  // useEffect(() => {
  //   if (tutorId && tutorData.cummulativeCommission && tutorData.attendedHours) {
  //     getScheduledHours();
  //   }
  // }, [attendedHours, refreshing]);
  // useEffect(() => {
  //   if (
  //     tutorId &&
  //     tutorData.cummulativeCommission &&
  //     tutorData.attendedHours &&
  //     tutorData.scheduledHours
  //   ) {
  //     getCancelledHours();
  //   }
  // }, [schedulesHours, refreshing]);
  // useEffect(() => {
  //   if (tutorId) {
  //     getTutorStudents();
  //     getTutorSubjects()
  //   }
  // }, [cancelledHours, refreshing]);

  const routeToScheduleScreen = async (item: any) => {
    interface LoginAuth {
      status: Number;
      tutorID: Number;
      token: string;
    }
    const login: any = await AsyncStorage.getItem('loginAuth');
    let loginData: LoginAuth = JSON.parse(login);
    let {tutorID} = loginData;
    axios
      .get(`${Base_Uri}getClassSchedulesTime/${tutorID}`)
      .then(res => {
        let scheduledClasses = res.data;

        let {classSchedulesTime} = scheduledClasses;
        let checkRouteClass =
          classSchedulesTime &&
          classSchedulesTime.length > 0 &&
          classSchedulesTime.filter((e: any, i: number) => {
            return e?.id == item?.id;
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
          checkRouteClass && checkRouteClass.length > 0 ? checkRouteClass : [],
        );
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
    navigation.navigate('Schedule');
  };
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(async ({data}) => {
        let myHomeBanners: any = [];
        let myFaqBanners: any = [];
        let myScheduleBanners: any = [];
        let myStudentBanners: any = [];
        let myInboxBanners: any = [];
        let myProfileBanners: any = [];
        let myPaymentBanners: any = [];
        let myTicketBanners: any = [];
        let myReportBanners: any = [];

        let banners = data.bannerAds;

        let homePageBanner =
          banners &&
          banners.length > 0 &&
          banners.map((e: any, i: any) => {
            if (e.displayOnPage == 'Dashboard') {
              myHomeBanners.push(e);
            } else if (e.displayOnPage == 'Faq') {
              myFaqBanners.push(e);
            } else if (e.displayOnPage == 'Class Schedule List') {
              myScheduleBanners.push(e);
            } else if (e.displayOnPage == 'Student List') {
              myStudentBanners.push(e);
            } else if (e.displayOnPage == 'Inbox') {
              myInboxBanners.push(e);
            } else if (e.displayOnPage == 'Profile') {
              myProfileBanners.push(e);
            } else if (e.displayOnPage == 'Payment History') {
              myPaymentBanners.push(e);
            } else if (e.displayOnPage == 'Job Ticket List') {
              myTicketBanners.push(e);
            } else if (e.displayOnPage == 'Submission History') {
              myReportBanners.push(e);
            }
          });

        if (myHomeBanners && myHomeBanners.length > 0) {
          let sort: any = myHomeBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];

          let dataInStorage: any = await AsyncStorage.getItem('homePageBanner');

          dataInStorage = JSON.parse(dataInStorage);

          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setHomePageBanner([]);
          } else {
            setHomePageBanner(bannerShow);
          }
        }

        if (myFaqBanners && myFaqBanners.length > 0) {
          let sort: any = myFaqBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('faqBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setFaqBanner([]);
          } else {
            setFaqBanner(bannerShow);
          }
        }

        if (myProfileBanners && myProfileBanners.length > 0) {
          let sort: any = myProfileBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('profileBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setProfileBanner([]);
          } else {
            setProfileBanner(bannerShow);
          }
        }

        if (myScheduleBanners && myScheduleBanners.length > 0) {
          let sort: any = myScheduleBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('scheduleBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setSchedulePageBanner([]);
          } else {
            setSchedulePageBanner(bannerShow);
          }
        }

        if (myStudentBanners && myStudentBanners.length > 0) {
          let sort: any = myStudentBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('studentBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setStudentBanner([]);
          } else {
            setStudentBanner(bannerShow);
          }
        }

        if (myInboxBanners && myInboxBanners.length > 0) {
          let sort: any = myInboxBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('inboxBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setInboxBanner([]);
          } else {
            setInboxBanner(bannerShow);
          }
        }

        if (myPaymentBanners && myPaymentBanners.length > 0) {
          let sort: any = myPaymentBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('paymentBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setPaymentHistoryBanner([]);
          } else {
            setPaymentHistoryBanner(bannerShow);
          }
        }

        if (myTicketBanners && myTicketBanners.length > 0) {
          let sort: any = myTicketBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('ticketBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setJobTicketBanner([]);
          } else {
            setJobTicketBanner(bannerShow);
          }
        }

        if (myReportBanners && myReportBanners.length > 0) {
          let sort: any = myReportBanners.sort(
            (a: any, b: any) => new Date(b.created_at) - new Date(a.created_at),
          );
          let bannerShow = sort[0];
          let dataInStorage: any = await AsyncStorage.getItem('reportBanner');
          dataInStorage = JSON.parse(dataInStorage);
          if (
            dataInStorage &&
            dataInStorage.id == bannerShow.id &&
            bannerShow.displayOnce == 'on'
          ) {
            setReportSubmissionBanner([]);
          } else {
            setReportSubmissionBanner(bannerShow);
          }
        }
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const linkToOtherPage = () => {
    if (homePageBanner.callToActionType == 'Open URL') {
      Linking.openURL(homePageBanner.urlToOpen);
    } else if (homePageBanner.callToActionType == 'Open Page')
      if (homePageBanner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (homePageBanner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (homePageBanner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (homePageBanner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (homePageBanner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (homePageBanner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (homePageBanner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (homePageBanner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (homePageBanner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  // console.log(cancelledHours, "cancelledHour")

  const closeBannerModal = async () => {
    if (homePageBanner.displayOnce == 'on') {
      let bannerData = {...homePageBanner};

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('homePageBanner', stringData);
      setHomePageBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  function convertTo12HourFormat(time24: string): string {
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

  // function convertDateFormat(date: string): string {
  //   const formattedDate = new Date(date).toLocaleDateString('en-US', {
  //     day: '2-digit',
  //     month: 'short',
  //     year: 'numeric',
  //   });
  //   return formattedDate;
  // }

  function convertDateFormat(date: string): string {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  return !cancelledHours ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={Theme.black} />
    </View>
  ) : (
    <View style={{flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={[styles.container, {}]}
        showsVerticalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 15}}>
            <Text style={[styles.text, {fontSize: 20}]}>Hello,</Text>
            <Text style={[styles.heading, {fontSize: 22}]}>
              {tutorDetails?.displayName ?? tutorDetails.full_name}
            </Text>
          </View>

          <View style={styles.firstBox}>
            <Text style={[styles.text, {color: Theme.white, fontSize: 12}]}>
              {currentDate}
            </Text>
            <Text
              style={[styles.heading, {color: Theme.white, fontWeight: '400'}]}>
              RM {cummulativeCommission}
            </Text>
            <Text style={[styles.text, {color: Theme.white, fontSize: 12}]}>
              CUMMULATIVE COMMISSION
            </Text>
          </View>
          {classInProcess && Object.keys(classInProcess).length > 0 ? (
            <TouchableOpacity
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
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Notifications')}
              style={[
                styles.firstBox,
                {
                  backgroundColor: Theme.lightGray,
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  marginTop: 15,
                },
              ]}>
              <Text style={[styles.text, {color: Theme.black, fontSize: 16}]}>
                Notifications
              </Text>
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: Theme.red,
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={[styles.text, {fontSize: 10, color: Theme.white}]}>
                  {notification.length + scheduleNotification.length > 0
                    ? notification.length + scheduleNotification.length
                    : 0}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={{marginTop: 25}}>
            <Text style={[styles.heading, {fontSize: 16}]}>
              Monthly Summary
            </Text>
            <Text
              style={[
                styles.text,
                {fontSize: 14, color: Theme.gray, fontWeight: '500'},
              ]}>
              {currentMonth}
            </Text>
          </View>
          {/* attended hours */}
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                alignItems: 'center',
              }}>
              <View
                style={{backgroundColor: 'pink', padding: 10, borderRadius: 8}}>
                <Image
                  source={require('../../Assets/Images/timer-or-chronometer-tool.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 10}}>
                <Text style={[styles.text, {fontSize: 12}]}>
                  Attended hours
                </Text>
                <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
                  {attendedHours}
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
                  source={require('../../Assets/Images/student.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 10}}>
                <Text style={[styles.text, {fontSize: 12}]}>
                  Active Student
                </Text>
                <Text style={[styles.text, {fontSize: 16, fontWeight: '700'}]}>
                  {students?.length}
                </Text>
              </View>
            </View>
          </View>
          {/*Schedule hours & cancel hours  */}
          <View style={{flexDirection: 'row', marginTop: 20}}>
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
                  {schedulesHours}
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
                  {cancelledHours}
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={[
              styles.text,
              {marginTop: 20, fontWeight: '500', fontSize: 16},
            ]}>
            Upcoming Classes
          </Text>
          {upCommingClasses && upCommingClasses.length > 0 ? (
            <FlatList
              data={upCommingClasses}
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}: any) => {
                const startTime12Hour = convertTo12HourFormat(item.startTime);
                const endTime12Hour = convertTo12HourFormat(item.endTime);
                // const formattedDate = convertDateFormat(item.date);
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      borderWidth: 1,
                      paddingHorizontal: 15,
                      width: 280,
                      height: 150,
                      marginTop: 15,
                      paddingVertical: 15,
                      borderRadius: 10,
                      gap: 10,
                      marginRight: 10,
                      borderColor: '#eee',
                      marginBottom: 40,
                    }}
                    // onPress={() => routeToScheduleScreen(item)}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 12,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../Assets/Images/woman.png')}
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: 50,
                        }}
                      />
                      <Text style={{color: Theme.black, fontSize: 16}}>
                        {item?.studentName}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: Theme.black,
                        fontSize: 16,
                        fontWeight: '600',
                      }}>
                      {item?.subject_name}
                    </Text>
                    <View>
                      <Text style={{color: Theme.gray, fontSize: 14}}>
                        Time - {startTime12Hour} to {endTime12Hour}{' '}
                      </Text>
                      <Text
                        style={{
                          color: Theme.gray,
                          fontSize: 14,
                          marginTop: 10,
                        }}>
                        {/* Date - {item?.date?.slice(0, 11)} */}
                        Date - {convertDateFormat(item.date)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View style={{marginTop: 35}}>
              <Text
                style={{color: Theme.black, fontSize: 12, textAlign: 'center'}}>
                No UpComming Classes...
              </Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      {openPPModal &&
        Object.keys(homePageBanner).length > 0 &&
        (homePageBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{flex: 1}}>
            <Modal
              visible={openPPModal}
              style={{flex: 1}}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={() => linkToOtherPage()}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}>
                  <TouchableOpacity onPress={() => closeBannerModal()}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        paddingVertical: 10,
                        paddingRight: 15,
                      }}>
                      <AntDesign
                        name="closecircleo"
                        size={20}
                        color={'black'}
                      />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{uri: homePageBanner.bannerImage}}
                    style={{
                      width: Dimensions.get('screen').width / 1,
                      height: '90%',
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
