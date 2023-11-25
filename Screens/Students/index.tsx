import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
  View,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Dimensions
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentContext from '../../context/studentContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
const Students = ({ navigation }: any) => {

  const context = useContext(StudentContext)

  let student = context.students
  let bannerCont = useContext(bannerContext)

  let { studentBanner, setStudentBanner } = bannerCont
  const tutorDetailsContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutorDetailsContext





  const [students, setstudents] = useState([]);
  const [loading, setLoading] = useState(false)
  const [foundName, setFoundName] = useState([]);
  const [searchText, setSearchText] = useState('');



  useEffect(() => {

    setstudents(student)

  }, [])

  console.log(studentBanner, "nanmmmer")

  const linkToOtherPage = () => {

    if (studentBanner.callToActionType == "Open URL") {
      Linking.openURL(studentBanner.urlToOpen);
    }
    else if (studentBanner.callToActionType == "Open Page")

      if (studentBanner.pageToOpen == "Dashboard") {

        navigation.navigate("Home")
      }
      else if (studentBanner.pageToOpen == "Faq") {

        navigation.navigate("FAQs")

      }
      else if (studentBanner.pageToOpen == ("Class Schedule List")) {

        navigation.navigate("Schedule")

      }

      else if (studentBanner.pageToOpen == "Student List") {

        navigation.navigate("Students")

      }
      else if (studentBanner.pageToOpen == "Inbox") {

        navigation.navigate("inbox")

      }
      else if (studentBanner.pageToOpen == "Profile") {
        navigation.navigate("Profile")
      }
      else if (studentBanner.pageToOpen == ("Payment History")) {

        navigation.navigate("PaymentHistory")


      }
      else if (studentBanner.pageToOpen == ("Job Ticket List")) {

        navigation.navigate("Job Ticket")

      }
      else if (studentBanner.pageToOpen == ("Submission History")) {
        navigation.navigate("ReportSubmissionHistory")
      }
  }


  // const getStudentData = async () => {
  //   setLoading(true)
  //   let data: any = await AsyncStorage.getItem('loginAuth');
  //   data = JSON.parse(data);

  //   let { tutorID } = data;

  //   axios
  //     .get(`${Base_Uri}getTutorStudents/${tutorID}`)
  //     .then(({ data }) => {
  //       setLoading(false)
  //       let { tutorStudents } = data;

  //       setstudents(tutorStudents);
  //     })
  //     .catch(error => {
  //       setLoading(false)
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {
  //   getStudentData();
  // }, []);


  const searchStudent = (e: any) => {

    setSearchText(e);
    let filteredItems: any = students.filter((x: any) => {
      console.log(x, "xxxx")
      return (
        x?.studentName?.toLowerCase()?.includes(e?.toLowerCase()) ||
        x?.studentID?.toString().toLowerCase().includes(e?.toLowerCase())
      )
    });
    setFoundName(filteredItems);
  };
  const [openPPModal, setOpenPPModal] = useState(false);
  const displayBanner = async () => {
    setOpenPPModal(true)
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({ data }) => {
        console.log('res', data.bannerAds);
      })
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const closeBannerModal = async () => {

    if (studentBanner.displayOnce == "on") {

      let bannerData = { ...studentBanner }

      let stringData = JSON.stringify(bannerData)

      let data = await AsyncStorage.setItem("studentBanner", stringData)
      setStudentBanner([])
      setOpenPPModal(false)
    } else {
      setOpenPPModal(false)
    }
  }


  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size="large" color={Theme.black} />
    </View> : <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Student" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          {/* Search */}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                backgroundColor: Theme.lightGray,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 4,
                paddingHorizontal: 10,
                marginVertical: 15,
              }}>
              <TextInput
                placeholder="Search"
                placeholderTextColor="black"
                onChangeText={e => searchStudent(e)}
                style={{ width: '90%', padding: 8, color: 'black' }}
              />
              <TouchableOpacity onPress={() => navigation}>
                <Image
                  source={require('../../Assets/Images/search.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {students && students.length > 0 ? (
            <FlatList
              data={searchText && foundName.length > 0 ? foundName : students}
              nestedScrollEnabled
              renderItem={({ item, index }: any) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('StudentsDetails', item)}
                    key={index}
                    style={{
                      borderWidth: 1,
                      paddingHorizontal: 15,
                      marginTop: 10,
                      paddingVertical: 15,
                      borderRadius: 10,
                      gap: 10,
                      marginRight: 10,
                      borderColor: '#eee',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 15,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../Assets/Images/woman.png')}
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 50,
                        }}
                      />
                      <View>
                        <Text style={{ color: Theme.gray, fontSize: 16 }}>
                          {item.studentID}
                        </Text>
                        <Text style={{ color: Theme.black, fontSize: 14 }}>
                          {item.studentName}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View style={{ marginTop: 35 }}>
              <Text
                style={{ color: Theme.black, fontSize: 14, textAlign: 'center' }}>
                No Student Found...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {Object.keys(studentBanner).length > 0 && (studentBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
        <Modal
          visible={openPPModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => closeBannerModal()}>
          <TouchableOpacity
            onPress={linkToOtherPage}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            <View
              style={{
                backgroundColor: 'white',
                // padding: 15,
                borderRadius: 5,
                marginHorizontal: 20,
              }}>
              <TouchableOpacity onPress={() => closeBannerModal()}>
                <View style={{ alignItems: 'flex-end', paddingVertical: 10, paddingRight: 15 }}>
                  <AntDesign
                    name="closecircleo"
                    size={20}
                    color={'black'}
                  />
                </View>
              </TouchableOpacity>
              {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
              <Image source={{ uri: studentBanner.bannerImage }} style={{ width: Dimensions.get('screen').width / 1.1, height: '80%', }} resizeMode='contain' />

            </View>

          </TouchableOpacity>
        </Modal>
      </View>}
    </View>
  );
};

export default Students;

const styles = StyleSheet.create({});
