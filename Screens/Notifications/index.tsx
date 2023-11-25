import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationContext from '../../context/notificationContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import scheduleContext from '../../context/scheduleContext';
import scheduleNotificationContext from '../../context/scheduleNotificationContext';
const height = Dimensions.get('screen').height;
const Notifications = ({ navigation }: any) => {
  // const [notification, setNotification] = useState<any>([]);



  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false)

  const context = useContext(notificationContext)
  let tutotContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutotContext

  const scheduleNotCont = useContext(scheduleNotificationContext)

  let { scheduleNotification, setScheduleNotification } = scheduleNotCont

  console.log(tutorDetails, "DETAUL")

  let { notification, setNotification } = context

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefresh(!refresh)
    }, 2000);
  }, [refresh]);
  const getNotificationMessage = () => {
    if (refresh) {



      // interface LoginAuth {
      //   status: Number;
      //   tutorID: Number;
      //   token: string;
      // }

      // const data: any = await AsyncStorage.getItem('loginAuth');
      // let loginData: LoginAuth = JSON.parse(data);
      // let { tutorID } = loginData;

      setLoading(true);
      axios
        .get(`${Base_Uri}api/notifications/${tutorDetails.tutorId}`)
        .then(async ({ data }) => {
          let { notifications } = data;
          let tutorNotification =
            notifications.length > 0 &&
            notifications.filter((e: any, i: number) => {
              return e.status == "new";
            });
          setLoading(false);
          setNotification(tutorNotification);
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        });
    }
  };

  const getScheduleNotification = () => {

    if (refresh) {


      axios.get(`${Base_Uri}api/classScheduleStatusNotifications/${tutorDetails.tutorId}`).then((res) => {
        let { data } = res
        setScheduleNotification(data.record)
      }).catch((error) => {

        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      })
    }


  }

  useEffect(() => {
    getNotificationMessage();
    getScheduleNotification()
  }, [refresh]);


  const navigateToOtherScreen = (item: any) => {

    if (item.notificationType == "Submit Evaluation Report" || item.notificationType == "Submit Progress Report") {
      navigation.navigate("ReportSubmission", item)
      axios.get(`${Base_Uri}api/updateNotificationStatus/${item.notificationID}/old`).then((res) => {

        let updateNotifications = notification.filter((e: any, i: number) => {
          return e.notificationID !== item?.notificationID
        })

        setNotification(updateNotifications)

        // axios
        //   .get(`${Base_Uri}api/notifications/${tutorDetails?.tutorId}`)
        //   .then(({ data }) => {
        //     let { notifications } = data;

        //     let tutorNotification =
        //       notifications.length > 0 &&
        //       notifications.filter((e: any, i: number) => {
        //         return e.status == 'new';
        //       });
        //     setNotification(tutorNotification);
        //   })
        //   .catch(error => {
        //     ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
        //   });

      }).catch((error) => {

        ToastAndroid.show("Nework Error", ToastAndroid.SHORT)
      })

    } else {

      item.status = "attended"
      item.id = item.class_schedule_id
      navigation.navigate("EditAttendedClass", { data: item })


      axios.get(`${Base_Uri}api/updateNotificationStatus/${item.notificationID}/old`).then((res) => {

        let updateNotifications = notification.filter((e: any, i: number) => {
          return e.notificationID !== item?.notificationID
        })

        setNotification(updateNotifications)

      }).catch((error) => {

        ToastAndroid.show("Nework Error", ToastAndroid.SHORT)
      })



    }

  }

  let totalNotifications = [...notification, ...scheduleNotification]

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Notifications" backBtn navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {totalNotifications && totalNotifications.length > 0 ? (
          <FlatList

            data={totalNotifications}
            nestedScrollEnabled={true}
            renderItem={({ item, index }: any) => {

              return (
                <TouchableOpacity
                  onPress={() => navigateToOtherScreen(item)}
                  activeOpacity={0.8}
                  key={index}
                  style={{ paddingHorizontal: 15 }}>
                  <View
                    style={{
                      backgroundColor: Theme.white,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      borderRadius: 10,
                      marginVertical: 5,
                      borderWidth: 1,
                      borderColor: '#eee',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '95%' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            color: Theme.gray,
                            fontSize: 14,
                            fontWeight: '600',
                            marginTop: 5,
                            width: '75%',
                          }}>
                          {item.notificationType ?? "Update Schedule Classs"}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 14,
                          fontWeight: '600',
                          marginTop: 10,
                        }}>
                        {item.notificationMessage ?? `Update Schedule Class, Tutor Name: ${tutorDetails.full_name}, Student Name: ${item?.studentName}, Subject Name: ${item?.subjectName}`}
                      </Text>
                      <Text
                        style={{
                          color: Theme.gray,
                          fontSize: 12,
                          fontWeight: '600',
                          marginTop: 5,
                        }}>
                        {item.notificationProgressReportMonth}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Image
                        source={require('../../Assets/Images/right.png')}
                        resizeMode="contain"
                        style={{ height: 18, width: 18 }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'center',
              alignItems: 'center',
              height: height / 1.5,
            }}>
            <AntDesign name="copy1" size={20} color={Theme.gray} />
            <Text style={{ color: Theme.gray }}>There are no Notifications</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
