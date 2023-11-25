import React from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    ToastAndroid,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Theme } from '../../constant/theme';
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

export default function ModalImg({
    modalVisible,
    openGallery,
    openCamera,
    closeModal,
}) {
    //   const [modalVisible, setModalVisible] = useState(false);
    //   const showModal = () => setModalVisible(true);
    //   const hideModal = () => setModalVisible(false);
    return (
        <Modal transparent={true} visible={modalVisible} animationType="slide">
            <View style={styles.backContainer}>
                <View style={[styles.frontContainer,{}]}>
                    <TouchableOpacity style={[styles.innerContainer,{alignSelf:'flex-end'}]} onPress={closeModal}>
                        {/* <Text style={styles.textStyle}>Close</Text> */}
                        <AntDesign name="closecircleo" size={20} color={'black'} />
                    </TouchableOpacity>
                    <View style={{flexDirection:'row', paddingVertical:20}}>

                    <TouchableOpacity style={[styles.innerContainer,{alignItems:'center'}]} onPress={openCamera}>
                    <AntDesign name="camera" size={40} color={'black'} />
                        <Text style={[styles.textStyle,{marginTop:20}]}>Take a Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.midContainer,{alignItems:'center'}]} onPress={openGallery} >
                    <AntDesign name="clouduploado" size={40} color={'black'} />
                        <Text style={[styles.textStyle,{marginTop:20}]}>Upload a Photo</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    backContainer: {
        backgroundColor: '#000000aa',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    frontContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width:'90%',
    },
    innerContainer: {
        padding: 10,
        paddingHorizontal: 30,
    },
    midContainer: {
        padding: 10,
        paddingHorizontal: 30,
        // borderBottomWidth: 1,
        // borderTopWidth: 1,
        borderColor: Theme.gray
    },
    removeContainer: {
        padding: 10,
        paddingHorizontal: 30,
        // borderBottomWidth: 1,
        borderColor: Theme.gray
    },
    textStyle: {
        fontSize: 15,
        color: Theme.darkGray
    }
})