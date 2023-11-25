import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ToastAndroid,
  Modal,
  Linking,
  Dimensions
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FAQs = ({ navigation }: any) => {


  let bannerCont = useContext(bannerContext)

  let { faqBanner, setFaqBanner } = bannerCont
  const tutorDetailsContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutorDetailsContext


  const [faqsData, setFaqsData] = useState([
    {
      id: 1,
      question: 'First time user',
      answer:
        "a) Apply Job (refer to the steps\n https://youtu.be/ztb3bTfTqxA)\n\n"
        + "b) Register as a Tutor.\n"
        + "https://sifututor.my/tutor/apply/\n\n"
        + "If you have completed these two steps, admin will contact you as soon as possible via call or whatsapp.",
      open: false,
    },
    {
      id: 2,
      question: 'Verified Tutor',
      answer:
        "1. How much do I get paid for being a tutor?\n"
        + "(https://sifututor.my/tutor/tutor-guidelines/)\n\n"
        + "2. When should I expect to receive my monthly commission?\n"
        + "Kindly expect to receive monthly commission every 3rd to 10th day of the following month.\n\n"
        + "3. What if I forgot to clock in and out using mobile apps?\n"
        + "Apps will notify you on 'Notification' tab. Please provide attachment(s) to verify your attendance.\n\n"
        + "4. How should I register my attendance for online class?\n"
        + "Follow the same SOP as the physical class. You can clock in and out from any desired location.\n\n"
        + "5. When to complete and submit Student Progress Report?\n"
        + "Apps will notify you on 'Notification' tab. Reports shall be completed and submitted by every end of March, June, September, and December of every year.\n\n"
        + "6. How is cumulative commission being calculated?\n"
        + "It is calculated based on 'Attended Hours'.\n\n"
        + "7. Apps are not working properly?\n"
        + "Contact us via WhatsApp or call Ms. Atirah at +60146437500.\n\n"
        + "Read full guidelines and SOP via link below: \n(https://sifututor.my/tutor/tutor-guidelines/)",
      open: false,
    }
  ]);

  const handleQuestionPress = (index: number) => {

    setFaqsData((prevData) =>
      prevData.map((faq, i) => ({
        ...faq,
        open: i == index ? !faq.open : false,
      }))
    );
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


  const linkToOtherPage = () => {

    if (faqBanner.callToActionType == "Open URL") {
      Linking.openURL(faqBanner.urlToOpen);
    }
    else if (faqBanner.callToActionType == "Open Page")

      if (faqBanner.pageToOpen == "Dashboard") {

        navigation.navigate("Home")
      }
      else if (faqBanner.pageToOpen == "Faq") {

        navigation.navigate("FAQs")

      }
      else if (faqBanner.pageToOpen == ("Class Schedule List")) {

        navigation.navigate("Schedule")

      }

      else if (faqBanner.pageToOpen == "Student List") {

        navigation.navigate("Students")

      }
      else if (faqBanner.pageToOpen == "Inbox") {

        navigation.navigate("inbox")

      }
      else if (faqBanner.pageToOpen == "Profile") {
        navigation.navigate("Profile")
      }
      else if (faqBanner.pageToOpen == ("Payment History")) {

        navigation.navigate("PaymentHistory")


      }
      else if (faqBanner.pageToOpen == ("Job Ticket List")) {

        navigation.navigate("Job Ticket")

      }
      else if (faqBanner.pageToOpen == ("Submission History")) {
        navigation.navigate("ReportSubmissionHistory")
      }
  }


  const closeBannerModal = async () => {

    if (faqBanner.displayOnce == "on") {

      let bannerData = { ...faqBanner }

      let stringData = JSON.stringify(bannerData)

      let data = await AsyncStorage.setItem("faqBanner", stringData)
      setFaqBanner([])
      setOpenPPModal(false)
    } else {
      setOpenPPModal(false)
    }



  }



  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="FAQs" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15, marginVertical: 15 }}>

          <FlatList
            data={faqsData ?? []}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            renderItem={({ item, index }: any) => {
              return (
                <>
                  <View
                    key={index}
                    style={{
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 15,
                      flexDirection: 'row',
                      width: '100%',
                      borderRadius: 5,
                      borderColor: 'gray',
                      borderBottomWidth: item.open ? 0 : 1,
                      borderBottomLeftRadius: item.open ? 1 : 5,
                      borderBottomRightRadius: item.open ? 1 : 5,
                      marginBottom: item.open ? 0 : 15,
                    }}>
                    <View style={{ width: '93%' }}>
                      <Text
                        style={{ fontSize: 15, fontWeight: '600', color: 'black' }}>
                        {item.question}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleQuestionPress(index)}>
                      {item.open ? (
                        <Image
                          source={require('../../Assets/Images/minus.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={require('../../Assets/Images/plus.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {item.open ? (
                    <View
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        paddingBottom: 10,
                        flexDirection: 'row',
                        width: '100%',
                        borderRadius: 5,
                        borderColor: 'gray',
                        borderTopWidth: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        marginBottom: 15,

                      }}>
                      <Text style={{ color: 'black' }}>
                        {item.answer}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                </>
              );
            }}
          />
        </View>
      </ScrollView>



      {Object.keys(faqBanner).length > 0 && (faqBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
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
              <Image source={{ uri: faqBanner.bannerImage }} style={{ width: Dimensions.get('screen').width / 1.05, height: '90%', }} resizeMode='contain' />
            </View>

          </TouchableOpacity>
        </Modal>
      </View>}

    </View>
  );
};

export default FAQs;

const styles = StyleSheet.create({});
