import {
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';
import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {isAxiosError} from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {touch} from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropDownModalView from '../../Component/DropDownModalView';
import bannerContext from '../../context/bannerContext';
import ModalImg from '../../Component/Modal/modal';

const TutorDetailForm = ({navigation, route}: any) => {
  interface ITutorDetails {
    full_name: string | undefined;
    email: string | undefined;
    gender: string | undefined;
    phoneNumber: string | undefined;
    age: any;
    nric: string | undefined;
  }

  let data = route.params;

  let tutorData = data.tutorData.tutorDetailById[0];

  console.log(tutorData, 'dataa');

  let tutorId = tutorData.id;

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [uri, setUri] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');

  const [tutorDetail, setTutorDetail] = useState<any>({
    full_name: '',
    displayName: '',
    gender: '',
    age: '',
    nric: '',
    street_address: '',
    city: '',
    state: '',
    bank_name: '',
    bank_account_number: '',
  });

  const openPhoto = async () => {
    setOpenPhotoModal(false);

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const options: any = {
        title: 'Select Picture',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5,
      };

      const result: any = await launchCamera(options);
      if (result.didCancel) {
        // ('Cancelled image selection');
      } else if (result.errorCode == 'permission') {
        // setToastMsg('Permission Not Satisfied');
      } else if (result.errorCode == 'others') {
        // setToastMsg(result.errorMessage);
      } else {
        let uri = result.assets[0].uri;
        let type = result.assets[0].type;
        let name = result.assets[0].fileName;

        setUri(uri);
        setType(type);
        setName(name);
      }
    }
  };

  const uploadProfilePicture = async () => {
    setOpenPhotoModal(false);

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const options: any = {
        title: 'Select Picture',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5,
      };
      const result: any = await launchImageLibrary(options);
      if (result.didCancel) {
        // ('Cancelled image selection');
      } else if (result.errorCode == 'permission') {
        // setToastMsg('Permission Not Satisfied');
      } else if (result.errorCode == 'others') {
        // setToastMsg(result.errorMessage);
      } else {
        let uri = result.assets[0].uri;
        let type = result.assets[0].type;
        let name = result.assets[0].fileName;

        setUri(uri);
        setType(type);
        setName(name);
      }
    }
  };

  const genderOption = [
    {
      option: 'Male',
    },
    {
      option: 'Female',
    },
  ];

  const updateTutorDetail = async () => {
    let values = Object.values(tutorDetail);

    let flag = values.some((e, i) => !e);

    if (flag) {
      ToastAndroid.show('Required Fields are missing', ToastAndroid.SHORT);
      return;
    }

    if (!uri) {
      ToastAndroid.show('Please Upload Profile Picture', ToastAndroid.SHORT);
      return;
    }

    if (uri && name && type) {
      setLoading(true);

      let formData = new FormData();
      formData.append('tutorImage', {
        uri: uri,
        type: type,
        name: name,
      });
      formData.append('tutorID', tutorId);
      formData.append('name', tutorDetail.full_name);
      formData.append('displayName', tutorDetail.displayName);
      formData.append('email', tutorData.email);
      formData.append('phone', tutorData.phoneNumber);
      formData.append('gender', tutorDetail.gender);
      formData.append('nric', tutorDetail.nric);
      formData.append('age', tutorDetail.age);
      formData.append('street_address)', tutorDetail.street_address);
      formData.append('city', tutorDetail.city);
      formData.append('state', tutorDetail.state);
      formData.append('bank_name', tutorDetail.bank_name);
      formData.append('bank_account_number', tutorDetail.bank_account_number);

      axios
        .post(`${Base_Uri}api/editTutorProfile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          setLoading(false);
          let responseData = res.data;

          ToastAndroid.show(
            'Successfully Update Tutor Details',
            ToastAndroid.SHORT,
          );
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                params: {
                  data,
                },
              },
            ],
          });
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
          ToastAndroid.show(
            'Tutor Details update unsuccessfull',
            ToastAndroid.SHORT,
          );
        });
    }
  };

  let imageUrl = image
    ? image
    : !tutorDetail.tutorImage
    ? '../../Assets/Images/plus.png'
    : tutorDetail.tutorImage.includes('https')
    ? tutorDetail.tutorImage
    : `${Base_Uri}public/tutorImage/${tutorDetail.tutorImage}`;

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={Theme.black} />
    </View>
  ) : (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Tutor Details" />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15, marginBottom: 30}}>
          <View style={{paddingVertical: 15, alignItems: 'center'}}>
            <Image
              source={
                uri ? {uri: uri} : require('../../Assets/Images/student.png')
              }
              style={{width: 80, height: 80, borderRadius: 50}}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => setOpenPhotoModal(true)}
              activeOpacity={0.8}>
              <Image
                source={require('../../Assets/Images/plus.png')}
                style={{width: 20, height: 20, top: -20, left: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {/* Full Name */}

          {/* Email */}
          <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Full Name
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              {/* <Text
                  style={{
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '600',
                    marginTop: 5,
                  }}>
                  {tutorDetail?.email}
                </Text> */}
              <TextInput
                onChangeText={e =>
                  setTutorDetail({...tutorDetail, full_name: e})
                }
                placeholder={'Enter Full Name'}
                style={{color: 'black', fontSize: 14}}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>
          {/* Displlay name */}
          <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Display Name
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              {/* <Text
                  style={{
                    color: Theme.black,
                    fontSize: 14,
                    // fontWeight: '600',
                    marginTop: 5,
                  }}>
                  {tutorDetail?.full_name}
                </Text> */}
              <TextInput
                onChangeText={e =>
                  setTutorDetail({...tutorDetail, displayName: e})
                }
                placeholder={'Enter Display Name'}
                style={{color: 'black', fontSize: 14}}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>

          {/* Gender*/}
          <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Gender
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                // paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              {/* <Text
                  style={{
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '600',
                    marginTop: 5,
                  }}>
                  {tutorDetail?.gender ? tutorDetail?.gender : 'not provided'}
                </Text> */}
              <DropDownModalView
                // title="Gender"
                selectedValue={(e: any) => {
                  setTutorDetail({...tutorDetail, gender: e.option});
                }}
                // subTitle="Rate the student's performance in the quizes"
                placeHolder="Select Answer"
                option={genderOption}
                value={tutorDetail.gender}
                modalHeading="Select Gender"
                style={{
                  borderWidth: 0,
                  marginTop: 0,
                  fontSize: 18,
                  color: 'black',
                }}
              />
            </View>
          </View>
          {/* Age*/}
          <View style={{marginBottom: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Age
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black'}}
                keyboardType="numeric"
                onChangeText={e => setTutorDetail({...tutorDetail, age: e})}
                placeholder={'Enter Age'}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>
          {/* Nric*/}
          <View style={{marginBottom: 10}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              NRIC
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black'}}
                onChangeText={e => setTutorDetail({...tutorDetail, nric: e})}
                placeholder={'Enter Nric'}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>

          <View style={{marginBottom: 10}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Street Address
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black'}}
                onChangeText={e =>
                  setTutorDetail({...tutorDetail, street_address: e})
                }
                placeholder={'Enter Street Address'}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>

          <View style={{marginBottom: 10}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              City
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black'}}
                onChangeText={e => setTutorDetail({...tutorDetail, city: e})}
                placeholder={'Enter City'}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>

          <View style={{marginBottom: 10}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              State
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black'}}
                onChangeText={e => setTutorDetail({...tutorDetail, state: e})}
                placeholder={'Enter State'}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>

          <View style={{marginBottom: 10}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Bank Name
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black'}}
                onChangeText={e =>
                  setTutorDetail({...tutorDetail, bank_name: e})
                }
                placeholder={'Enter Bank Name'}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>

          <View style={{marginBottom: 10}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Bank Account Number
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 0,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <TextInput
                editable
                style={{color: 'black'}}
                onChangeText={e =>
                  setTutorDetail({...tutorDetail, bank_account_number: e})
                }
                placeholder={'Enter Bank Account Number'}
                placeholderTextColor={Theme.black}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {openPhotoModal && (
        <ModalImg
          closeModal={() => setOpenPhotoModal(false)}
          modalVisible={openPhotoModal}
          openCamera={openPhoto}
          openGallery={uploadProfilePicture}
        />
      )}

      {/* Submit Button */}
      <View
        style={{
          backgroundColor: Theme.white,
          // position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: Theme.white,
            marginVertical: 20,
            width: '94%',
          }}>
          <TouchableOpacity
            onPress={updateTutorDetail}
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
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TutorDetailForm;

const styles = StyleSheet.create({});
