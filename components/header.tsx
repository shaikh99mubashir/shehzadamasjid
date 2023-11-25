import React from 'react';
import {View, Text, TouchableOpacity,Image} from 'react-native';
import {Theme} from '../constant/theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import AntDesign from "react-native-vector-icons/AntDesign"
import Icon from 'react-native-vector-icons/AntDesign';

interface Props {
  headerName? : string;
  icon?: boolean;
  icon_name?: any;
  source?: any;
  back?: boolean;
  navigation?: any;
  iconStyle?:any
  iconRight?:boolean,
  containerStyle?:any
}

function CustomHeader({headerName, icon, icon_name, source,back,navigation,iconStyle,iconRight,containerStyle}: Props) {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        height:60,
        alignItems:"center",
        width:"100%",
        borderColor:"red",
        borderBottomWidth:1,
        borderBottomColor:Theme.darkGray,
        
      }}>

      
    
    <TouchableOpacity onPress={()=>navigation.goBack()} >
        
       { back &&    <Image source={require("../Assets/Images/BackIcon.png")} style={{width:20,height:20,alignSelf:"flex-start"}} />}
      
      </TouchableOpacity>
      
      


          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}} >
        <Text style={{color:Theme.black,fontSize:22,fontFamily:"Poppins-regular",fontWeight:"700"}} >{headerName}</Text>
        </View>
        <View>

            {iconRight && <View style={{width:60,height:60,backgroundColor:Colors.blue,borderRadius:100}} ><Icon name={"plus"} size={30} color={Theme.black} /></View> }

        </View>

      </View>
  );
}

export default CustomHeader;
