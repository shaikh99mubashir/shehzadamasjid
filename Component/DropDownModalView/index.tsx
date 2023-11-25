import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DropDownModalView = ({
  navigation,
  title,
  selectedValue,
  option,
  value,
  placeHolder,
  modalHeading,
  subTitle,
  style,
}: any) => {

  const [serviceDD, setServiceDD] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleReportTypeChange = (value: any) => {
    setServiceDD(!serviceDD);
    setModalVisible(true);
  };

  const setReportTypeChange = (value: any) => {
    selectedValue(value)
    setReportType(value?.option);
    setModalVisible(false);
    setServiceDD(!serviceDD);
  };

const getModalValue = () => {

  setModalVisible(false);

}


  return (
    <>
      {/* Report Type */}
        
      <View style={{marginTop: 8}}>
        {title &&
        <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
          {title}
        </Text>
        }
        {subTitle && (
          <Text
            style={{
              color: Theme.gray,
              fontFamily: 'Poppins-SemiBold',
              fontSize: 12,
            }}>
            {subTitle}
          </Text>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleReportTypeChange}
          style={{
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderColor: Theme.gray,
            alignItems: 'center',
            ...style
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
              }}>
              {value ? value : reportType ? reportType : placeHolder && placeHolder}
            </Text>

            {serviceDD ? (
              <Image
                source={require('../../Assets/Images/up.png')}
                style={{width: 15, height: 20}}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../Assets/Images/down.png')}
                style={{width: 20, height: 20}}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Modal onRequestClose={()=>setModalVisible(false)} visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              position: 'absolute',
              bottom: 0,
              height: '40%',
              width: '100%',
            }}>
              <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={{padding:10,backgroundColor:"white", justifyContent:'flex-end',alignItems:'flex-end'}} onPress={() => getModalValue()}>
              {/* <Text >X</Text> */}
              <AntDesign name="closecircleo" size={20} color={'black'} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                // fontWeight: 'bold',
                color: 'black',
                marginBottom: 15,
              }}>
              {modalHeading}
            </Text>
            {option &&
              option.map((e: any, i: number) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setReportTypeChange(e)}
                    style={{marginVertical: 5}}>
                    <Text
                      style={{
                        fontSize: 16,
                        // fontWeight: 'bold',
                        color: 'black',
                        borderBottomWidth:1,
                        paddingBottom:8,
                        borderBottomColor:'#eee',
                       
                      }}>
                      {e.option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DropDownModalView;

const styles = StyleSheet.create({});
