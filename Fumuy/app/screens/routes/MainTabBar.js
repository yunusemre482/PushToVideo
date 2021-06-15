import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../Home';
import DetailsScreen from '../Detail';
import ExploreScreen from '../Explore';
import ProfileScreen from '../Profile';
import EditProfileScreen from '../EditProfile';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabBar = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      shifting={true}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#00377b',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
     
    
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Channel',
          tabBarColor: '#900C3F',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="video-camera" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#FF6347',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default MainTabBar;

const HomeStackScreen = ({navigation}) => (
<HomeStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#00377b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        }
    }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
        title:'Channels',
        headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#00377b" onPress={() => navigation.openDrawer()}></Icon.Button>
        )
        }} />
</HomeStack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
<DetailsStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#1f65ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        }
    }}>
        <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
        headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
        )
        }} />
</DetailsStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: '#FF6347',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}>
  <ProfileStack.Screen
    name="Profile"
    component={ProfileScreen}
    options={{
      headerLeft:()=>(
        <Icon.Button
        name="ios-menu"
        size={25}
        backgroundColor="#FF6347"
        onPress={() => navigation.openDrawer()}></Icon.Button>
      ),
      headerRight:()=>(
        <FontAwesome5.Button
        name="user-edit"
        size={20}
        backgroundColor="#FF6347"
        onPress={() => navigation.navigate('EditProfile')}></FontAwesome5.Button>
      ),
    }}
  />

<ProfileStack.Screen
    name="EditProfile"
    component={EditProfileScreen}
    options={({ navigation}) => ({
      headerLeft:()=>(
        <Icon.Button
        name="chevron-back-outline"
        size={25}
        backgroundColor="#FF6347"
        onPress={() => navigation.goBack()}></Icon.Button>
      ),
    })}
  />

  </ProfileStack.Navigator>

);