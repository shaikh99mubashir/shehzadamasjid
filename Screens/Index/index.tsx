import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  ToastAndroid,
  Dimensions,
  Linking,
  Modal,
} from 'react-native';
import {Theme} from '../../constant/theme';
import CustomHeader from '../../Component/Header';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Index({navigation}: any) {
  let bannerCont = useContext(bannerContext);

  let {inboxBanner, setInboxBanner} = bannerCont;

  const tutorDetailsContext = useContext(TutorDetailsContext);

  let {tutorDetails} = tutorDetailsContext;

  const [inboxData, setInboxData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const getNews = () => {
    setLoading(true);

    axios
      .get(`${Base_Uri}api/news`)
      .then(({data}) => {
        setLoading(false);
        let {news} = data;

        axios
          .get(`${Base_Uri}api/tutorNewsStatusList/${tutorDetails.tutorId}`)
          .then(res => {
            const status = res.data.result;

            news.forEach((e: any, i: number) => {
              status.forEach((event: any, ind: number) => {
                if (event.newsID === e.id) {
                  e.newsStatus = 'old'; // Update the newsStatus property
                }
              });
            });
          });

        setInboxData(news);
      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    getNews();
  }, [refresh]);
  // console.log('inboxData',inboxData);

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

  const closeBannerModal = async () => {
    if (inboxBanner.displayOnce == 'on') {
      let bannerData = {...inboxBanner};

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('inboxBanner', stringData);
      setInboxBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  const routeToInboxDetails = (item: any) => {
    navigation.navigate('InboxDetail', item);

    axios
      .get(
        `${Base_Uri}api/newsStatusUpdate/${item.id}/old/${tutorDetails.tutorId}`,
      )
      .then(res => {
        console.log('successfully update tutor status');
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  const renderInboxData = ({item, index}: any): any => {
    return (
      <TouchableOpacity
        onPress={() => routeToInboxDetails(item)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: Theme.lightGray,
          width: '100%',
        }}>
        <View style={{flexDirection: 'row', width: '70%'}}>
          <View
            style={{
              borderWidth: 1,
              borderColor: Theme.lightGray,
              borderRadius: 100,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                position: 'absolute',
                height: 12,
                width: 12,
                backgroundColor:
                  item.newsStatus == 'old' ? Theme.lightGray : 'rgb(0, 0, 95)',
                borderRadius: 100,
                left: 4,
                top: 0,
              }}></View>

            <Icon
              name="chatbubble-ellipses-outline"
              size={25}
              color={Theme.gray}
            />
          </View>

          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: item.newsStatus == 'old' ? Theme.gray : Theme.black,
              }}
              numberOfLines={1}>
              {item?.subject}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: item.newsStatus == 'old' ? Theme.gray : Theme.black,
              }}
              numberOfLines={1}>
              {item.status}
            </Text>
            <Text
              style={{fontSize: 12, fontWeight: '500', color: Theme.gray}}
              numberOfLines={1}>
              {item.created_at}
            </Text>
          </View>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <AntDesign name="right" color={Theme.gray} size={15} />
        </View>
      </TouchableOpacity>
    );
  };

  const linkToOtherPage = () => {
    if (inboxBanner.callToActionType == 'Open URL') {
      Linking.openURL(inboxBanner.urlToOpen);
    } else if (inboxBanner.callToActionType == 'Open Page')
      if (inboxBanner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (inboxBanner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (inboxBanner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (inboxBanner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (inboxBanner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (inboxBanner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (inboxBanner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (inboxBanner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (inboxBanner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{flex: 1, backgroundColor: Theme.white}}>
      <View>
        <CustomHeader title="Inbox" />
      </View>

      <FlatList data={inboxData} renderItem={renderInboxData} />
      {Object.keys(inboxBanner).length > 0 &&
        (inboxBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{flex: 1}}>
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
                    source={{uri: inboxBanner.bannerImage}}
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
    </ScrollView>
  );
}

export default Index;
