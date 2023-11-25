import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import { Base_Uri } from '../../constant/BaseUri';

function More({ navigation }: any) {

  const context = useContext(TutorDetailsContext)

  const { tutorDetails } = context

  console.log(tutorDetails, "detailss")


  const [modalVisible, setModalVisible] = useState(false);
  const handleFilterPress = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const [apply, setApply] = useState(false);
  const [cancel, setCancel] = useState(false);

  const ApplyButton = async () => {
    handleCloseModal();
    await AsyncStorage.removeItem("loginAuth")
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Login',
        },
      ],
    });
  };
  const CancelButton = () => {
    handleCloseModal();
  };

  let imageUrl = tutorDetails?.tutorImage?.includes('https')
    ? tutorDetails.tutorImage
    : `${Base_Uri}public/tutorImage/${tutorDetails.tutorImage}`;


  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="More" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          {/* Profile */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}>
              <Image
                source={tutorDetails.tutorImage ? { uri: imageUrl } : require('../../Assets/Images/avatar.png')}
                style={{ height: 60, width: 60, borderRadius:50 }}
              />
              <View>
                <Text
                  style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                  {tutorDetails?.displayName ?? tutorDetails?.full_name}
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '300', color: Theme.gray }}>
                  {tutorDetails?.email}
                </Text>
              </View>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* notification */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#f88222',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/notification.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                Notification
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Students */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Students')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'pink',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/student2.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                Students
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Payment History */}
          <TouchableOpacity
            onPress={() => navigation.navigate('PaymentHistory')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'lightgreen',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/payment.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                Payment
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/*Report Submission History */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ReportSubmissionHistory')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'aqua',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/report.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                Report Submission History
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/*Faq */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FAQs')}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'gray',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/faq.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                FAQs
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Report Submission */}
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ReportSubmission')}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'gray',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/faq.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                ReportSubmission
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
          {/*Logout */}
          <TouchableOpacity
            onPress={handleFilterPress}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/logout.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text
                style={{ fontSize: 16, fontWeight: '600', color: Theme.black }}>
                Log Out
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',

          }}>
          <View style={[styles.modalContainer, { padding: 30, marginHorizontal: 40, }]}>
            <Text
              style={{
                color: Theme.darkGray,
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Are you sure you want to Quit ?
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                marginTop: 20,
                marginBottom: 20,
              }}>
              <TouchableOpacity
                onPressIn={() => setCancel(true)}
                onPressOut={() => setCancel(false)}
                onPress={CancelButton}
                activeOpacity={0.8}
                style={{
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 50,
                  borderColor: Theme.lightGray,
                  alignItems: 'center',
                  width: 100,
                  backgroundColor: cancel ? Theme.darkGray : 'white',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                    color: cancel ? 'white' : Theme.darkGray,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPressIn={() => setApply(true)}
                onPressOut={() => setApply(false)}
                onPress={ApplyButton}
                activeOpacity={0.8}
                style={{
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 50,
                  borderColor: Theme.lightGray,
                  alignItems: 'center',
                  width: 100,
                  backgroundColor: apply ? 'white' : Theme.darkGray,
                }}>
                <Text
                  style={{
                    color: apply ? Theme.darkGray : 'white',

                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: Theme.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,

  },
  modalText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: Theme.darkGray,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingHorizontal: 10,
  },
});

export default More;
