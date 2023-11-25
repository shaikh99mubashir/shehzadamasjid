import { View, Text, FlatList, StyleSheet, Dimensions, Image, Linking, ToastAndroid, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Header from '../../Component/Header';
const height = Dimensions.get('screen').height;
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import paymentContext from '../../context/paymentHistoryContext';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
const PaymentHistory = ({ navigation }: any) => {


  const paymentHistory = useContext(paymentContext)

  let { commissionData, setCommissionData } = paymentHistory

  let bannerCont = useContext(bannerContext)

  let { paymentHistoryBanner, setPaymentHistoryBanner } = bannerCont
  const tutorDetailsContext = useContext(TutorDetailsContext)
  let { tutorDetails } = tutorDetailsContext


  // const [commissionData, setCommissionData] = useState<any>([
  // {
  //   id: 1,
  //   tutorID: 2,
  //   classAttendedID: null,
  //   paymentDate: '2023-07-10 00:00:00',
  //   comissionMonth: 'June',
  //   comissionYear: '2023',
  //   payAmount: 151,
  //   payingAccount: 'Cash At Bank - Maybank',
  //   deduction: 0,
  //   addition: 0,
  //   remark: 'testing remarks at 10-07-2023',
  // },
  // {
  //   id: 2,
  //   tutorID: 2,
  //   classAttendedID: null,
  //   paymentDate: '2023-07-10 00:00:00',
  //   comissionMonth: 'June',
  //   comissionYear: '2023',
  //   payAmount: 151,
  //   payingAccount: 'Cash At Bank - Maybank',
  //   deduction: 0,
  //   addition: 0,
  //   remark: 'testing remarks at 10-07-2023',
  // },
  // {
  //   id: 3,
  //   tutorID: 2,
  //   classAttendedID: null,
  //   paymentDate: '2023-07-10 00:00:00',
  //   comissionMonth: 'June',
  //   comissionYear: '2023',
  //   payAmount: 151,
  //   payingAccount: 'Cash At Bank - Maybank',
  //   deduction: 0,
  //   addition: 0,
  //   remark: 'testing remarks at 10-07-2023',
  // },
  // {
  //   id: 4,
  //   tutorID: 2,
  //   classAttendedID: null,
  //   paymentDate: '2023-07-10 00:00:00',
  //   comissionMonth: 'June',
  //   comissionYear: '2023',
  //   payAmount: 151,
  //   payingAccount: 'Cash At Bank - Maybank',
  //   deduction: 0,
  //   addition: 0,
  //   remark: 'testing remarks at 10-07-2023',
  // },
  // {
  //   id: 5,
  //   tutorID: 2,
  //   classAttendedID: null,
  //   paymentDate: '2023-07-10 00:00:00',
  //   comissionMonth: 'June',
  //   comissionYear: '2023',
  //   payAmount: 151,
  //   payingAccount: 'Cash At Bank - Maybank',
  //   deduction: 0,
  //   addition: 0,
  //   remark: 'testing remarks at 10-07-2023',
  // },
  // ]);

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setOpenPPModal(true)
      setRefresh(!refresh)
    }, 2000);
  }, [refresh]);

  const getPaymentHistory = async () => {

    if (refresh) {

      let data: any = await AsyncStorage.getItem('loginAuth');
      data = JSON.parse(data);
      let { tutorID } = data;
      setLoading(true)
      axios.get(`${Base_Uri}tutorPayments/${tutorID}`).then(({ data }) => {

        let { response } = data

        setCommissionData(response)
        setLoading(false)


      }).catch((error) => {
        setLoading(false)
        ToastAndroid.show("Internal Server Error", ToastAndroid.SHORT)

      })

    }

  }

  useEffect(() => {
    getPaymentHistory()
  }, [refresh])


  const linkToOtherPage = () => {

    if (paymentHistoryBanner.callToActionType == "Open URL") {
      Linking.openURL(paymentHistoryBanner.urlToOpen);
    }
    else if (paymentHistoryBanner.callToActionType == "Open Page")

      if (paymentHistoryBanner.pageToOpen == "Dashboard") {

        navigation.navigate("Home")
      }
      else if (paymentHistoryBanner.pageToOpen == "Faq") {

        navigation.navigate("FAQs")

      }
      else if (paymentHistoryBanner.pageToOpen == ("Class Schedule List")) {

        navigation.navigate("Schedule")

      }

      else if (paymentHistoryBanner.pageToOpen == "Student List") {

        navigation.navigate("Students")

      }
      else if (paymentHistoryBanner.pageToOpen == "Inbox") {

        navigation.navigate("inbox")

      }
      else if (paymentHistoryBanner.pageToOpen == "Profile") {
        navigation.navigate("Profile")
      }
      else if (paymentHistoryBanner.pageToOpen == ("Payment History")) {

        navigation.navigate("PaymentHistory")


      }
      else if (paymentHistoryBanner.pageToOpen == ("Job Ticket List")) {

        navigation.navigate("Job Ticket")

      }
      else if (paymentHistoryBanner.pageToOpen == ("Submission History")) {
        navigation.navigate("ReportSubmissionHistory")
      }
  }
  function convertDateFormat(date: string): string {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  const closeBannerModal = async () => {

    if (paymentHistoryBanner.displayOnce == "on") {

      let bannerData = { ...paymentHistoryBanner }

      let stringData = JSON.stringify(bannerData)

      let data = await AsyncStorage.setItem("paymentBanner", stringData)
      setPaymentHistoryBanner([])
      setOpenPPModal(false)
    } else {
      setOpenPPModal(false)
    }
  }



  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ color: 'black', fontWeight: '600' }}>
            Comission Month
          </Text>
          <Text style={{ color: 'grey', }}>
            {item.comissionMonth} {item.comissionYear}
          </Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ color: 'black', fontWeight: '600' }}>
            Payment Date
          </Text>
          <Text style={{ color: 'grey', }}>
            {convertDateFormat(item.paymentDate)}
          </Text>
        </View>

      </View>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
        Payment Amount : <Text style={{ color: 'grey', }}>{item.payAmount}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
        Paying Account :<Text style={{ color: 'grey', }}> {item.payingAccount}</Text>
      </Text>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <Text style={{ color: 'black', fontWeight: '600' }}>
          Deduction: <Text style={{ color: 'grey', }}>{item.deduction} |{' '}</Text>
        </Text>
        <Text style={{ color: 'black', fontWeight: '600' }}>
          Addition: <Text style={{ color: 'grey', }}>{item.addition}</Text>
        </Text>
      </View>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
        Remarks: <Text style={{ color: 'grey', }}>{item.remark ? item.remark : "No Remarks"}</Text>
      </Text>
    </View>
  );

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
  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator color={"black"} size={"large"} />
    </View> : <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title="Payment History" navigation={navigation} backBtn />
      {commissionData && commissionData.length > 0 ? (
        <View style={{ paddingBottom: 80 }}>
          <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } >
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={commissionData}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
            />
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            justifyContent: 'center',
            alignItems: 'center',
            height: height / 1.5,
          }}>
          <Image
            source={require('../../Assets/Images/payment.png')}
            style={{ height: 25, width: 25 }}
          />
          <Text style={{ color: 'black', fontSize: 14 }}>No payment history at this moment...</Text>
        </View>
      )}
      {Object.keys(paymentHistoryBanner).length > 0 && (paymentHistoryBanner.tutorStatusCriteria == "All" || tutorDetails.status == "verified") && <View style={{ flex: 1 }}>
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
              <Image source={require('../../Assets/Images/Returnoninstallment.png')} style={{ width: Dimensions.get('screen').width / 1.1, height: '80%', }} resizeMode='contain' />

            </View>

          </TouchableOpacity>
        </Modal>
      </View>}
    </View>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: 'silver',
    elevation: 1
  },
});
