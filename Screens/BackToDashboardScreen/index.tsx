import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { Theme } from "../../constant/theme"
import { useNavigation } from "@react-navigation/native"

//#0f58cb

function BackToDashboard({ route }: any) {

    let data = route.params





    const navigation: any = useNavigation()

    return (
        <View style={{ flex: 1, backgroundColor: Theme.darkGray, alignItems: "center", justifyContent: "space-around" }} >

            <Image source={require("../../Assets/Images/Customicon.png")} style={{ width: "80%", height: 300 }} />

            <Text style={{ color: Theme.white, fontSize: 16, width: "90%", textAlign: "center", fontWeight: "300" }} >
                {data?.notificationType ? "Report has been successfully Submited" : "Good Job for completing your class. See you next class!!"}
            </Text>

            <TouchableOpacity onPress={() => navigation.replace("Main")} style={{ width: "90%", backgroundColor: Theme.white, padding: 12, borderRadius: 8 }} >

                <Text style={{ fontSize: 16, color: Theme.darkGray, textAlign: "center", fontWeight: "700" }} >
                    Back To Dashboard
                </Text>
            </TouchableOpacity>

        </View>
    )
}

export default BackToDashboard
