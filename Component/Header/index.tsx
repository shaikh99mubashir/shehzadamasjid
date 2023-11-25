import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Theme } from '../../constant/theme';
import Icon from 'react-native-vector-icons/AntDesign';
export type Props = {
  navigation: any;
};

const Header = (Props: any) => {
  let {
    navigation,
    Drawer,
    backBtn,
    backBtnColor,
    filter,
    addClass,
    title,
    plus,
    noLogo,
    myStyle,
    tab,
    containerStyle
  } = Props;

  const routeToFilter = () => {

    let selectedTab = tab.filter((e: any, i: number) => {

      return e.selected

    })

    if (selectedTab[0].name == "Applied") {
      navigation.navigate('Filter', "applied")
    } else {
      navigation.navigate('Filter')
    }
  }



  return (
    <View
      style={{
        backgroundColor: 'rgba(52, 52, 52, 0.0)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 15,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        height: 60,
        ...containerStyle
      }}>
      <>
        {backBtn ? (
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <TouchableOpacity style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', padding: 10, borderRadius: 50 }} onPress={() => navigation.goBack()}>
              <Image source={require('../../Assets/Images/back.png')} style={{ width: 12, height: 12 }} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
            }}></View>
        )}

        {title ? (
          <View style={{ flex: 2, alignItems: 'center' }}>
            <Text
              style={{
                // fontFamily: 'Poppins-Regular',
                fontSize: 22,
                color: Theme.darkGray,
                marginVertical: 0,
                fontWeight: '600',
              }}>
              {title}
            </Text>
          </View>
        ) : (
          <View style={{ flex: 2 }}>
          </View>
        )}
        {filter ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
              activeOpacity={0.8}
              onPress={() => routeToFilter()}>
              <Image source={require('../../Assets/Images/funnel.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />

            </TouchableOpacity>
          </View>
        ) : addClass ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
              activeOpacity={0.8}
              onPress={() => { }}>
              <Image source={require('../../Assets/Images/plus.png')} style={{ width: 25, height: 25 }} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        ) : plus ? <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity
            style={{
              // flex: 1,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              backgroundColor: Theme.darkGray,
              padding: 5
            }}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddClass')}>
            {/* <Image source={require('../../Assets/Images/plus2.png')} style={{width:20, height:20}} resizeMode='contain'/> */}
            <Icon name={"plus"} size={14} color={Theme.white} />
          </TouchableOpacity>
        </View> : (
          <View style={{ flex: 1 }}>
            <Text></Text>
          </View>
        )}
      </>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  button: {
    height: Dimensions.get('window').height / 12,
    width: Dimensions.get('window').width / 5,
  },
  icon: {
    height: Dimensions.get('window').height / 16,
    width: Dimensions.get('window').width / 16,
  },
  logo: {
    // height: Dimensions.get('window').height / 12,
    // width: Dimensions.get('window').width / 2,
    width: 150,
    height: 40,
    alignSelf: 'center',
  },
});
