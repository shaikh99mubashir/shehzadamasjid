import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
// import IonIcons from  'react-native-vector-icons/Ionicons'
import { Theme } from '../constant/theme';
import Home from '../Screens/Home';
import JobTicket from '../Screens/JobTicket';
import Schedule from '../Screens/Schedule';
import Index from '../Screens/Index';
import More from '../Screens/More';
import { View, Text, StyleSheet, Image } from 'react-native';
import OpenDetails from '../Screens/OpenDetails';
import Notifications from '../Screens/Notifications';
import AppliedDetails from '../Screens/AppliedDetails';
import Filter from '../Screens/Filter';
import Profile from '../Screens/Profile';
import Students from '../Screens/Students';
import StudentsDetails from '../Screens/StudentsDetails';
import Status from '../Screens/Status';
import FAQs from '../Screens/FAQs';
import ReportSubmissionHistory from '../Screens/ReportSubmissionHistory';
import OnBoarding from '../Screens/OnBoarding';
import Login from '../Screens/Login';
import Verification from '../Screens/Verification';
import Splash from '../Screens/Splash';
import EditScheduleClass from '../Screens/EditScheduleClass.tsx';
import EditAttendedClass from '../Screens/EditAttendedClass/EditAttendedClass';
import EditPostpondClass from '../Screens/EditPostpondClass';
import EditCancelledClass from "../Screens/EditCancelledClass"
import InboxDetail from '../Screens/InboxDetailScreen';
import AddClass from '../Screens/AddClass';
import BackToDashboard from '../Screens/BackToDashboardScreen';
import ClockIn from '../Screens/ClockInScreen/ClockIn';
import ClassTimerCount from '../Screens/ClassTimerCountScreen';
import ClockOut from '../Screens/ClockOutScreen';
import ReportSubmission from '../Screens/ReportSubmission';
import AttendedDetails from '../Screens/AttendedDetails';
import PaymentHistory from '../Screens/PaymentHistory';
import Signup from '../Screens/TutorRegister';
import TutorDetailForm from '../Screens/TutorDetailForm';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomNavigation({ route }: any) {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarShowLabel: false,
        tabBarInactiveTintColor: Theme.darkGray,
        // tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: 'black',
      })}
      initialRouteName="home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View>
              {focused == true ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../Assets/Images/home.png')}
                    resizeMode="contain"
                    style={{
                      height: 30,
                      width: 30,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={require('../Assets/Images/home.png')}
                    resizeMode="contain"
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Job Ticket"
        component={JobTicket}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View>
              {focused == true ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../Assets/Images/ticket.png')}
                    resizeMode="contain"
                    style={{
                      height: 30,
                      width: 30,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={require('../Assets/Images/ticket.png')}
                    resizeMode="contain"
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{

          tabBarIcon: ({ focused, color }) => (
            <View>
              {focused == true ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../Assets/Images/schedule.png')}
                    resizeMode="contain"
                    style={{
                      height: 30,
                      width: 30,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={require('../Assets/Images/schedule.png')}
                    resizeMode="contain"
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="inbox"
        component={Index}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View>
              {focused == true ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../Assets/Images/inbox.png')}
                    resizeMode="contain"
                    style={{
                      height: 30,
                      width: 30,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={require('../Assets/Images/inbox.png')}
                    resizeMode="contain"
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View>
              {focused == true ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../Assets/Images/settings.png')}
                    resizeMode="contain"
                    style={{
                      height: 30,
                      width: 30,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={require('../Assets/Images/settings.png')}
                    resizeMode="contain"
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: focused ? Theme.darkGray : Theme.lightGray,
                    }}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator  >
        <Stack.Screen
          options={{ headerShown: false }}
          name="Splash"
          component={Splash}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="OnBoarding"
          component={OnBoarding}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ReportSubmission"
          component={ReportSubmission}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ReportSubmissionHistory"
          component={ReportSubmissionHistory}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Verification"
          component={Verification}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Main"
          component={BottomNavigation}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="OpenDetails"
          component={OpenDetails}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Notifications"
          component={Notifications}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AppliedDetails"
          component={AppliedDetails}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Filter"
          component={Filter}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Students"
          component={Students}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="StudentsDetails"
          component={StudentsDetails}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Status"
          component={Status}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="FAQs"
          component={FAQs}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="EditScheduleClass"
          component={EditScheduleClass}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="EditAttendedClass"
          component={EditAttendedClass}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="EditPostpondClass"
          component={EditPostpondClass}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="EditCancelledClass"
          component={EditCancelledClass}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="InboxDetail"
          component={InboxDetail}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AddClass"
          component={AddClass}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="BackToDashboard"
          component={BackToDashboard}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ClockIn"
          component={ClockIn}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ClassTimerCount"
          component={ClassTimerCount}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ClockOut"
          component={ClockOut}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AttendedDetails"
          component={AttendedDetails}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PaymentHistory"
          component={PaymentHistory}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="TutorDetails"
          component={TutorDetailForm}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
