import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import BlankScreen from "../screens/BlankScreen";
import CareersScreen from "../screens/CareersScreen";
import HomeScreen from "../screens/HomeScreen";
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CareerDetailScreen from "../screens/CareerDetailScreen";

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

export default function TabsComponent() {
    return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return (
              <Entypo name="home" size={size} color={color} />
            );
          } else if (route.name === 'User') {
            return (
              <FontAwesome name="user" size={size} color={color}  />
            );
          }else if (route.name === 'Carriere') {
            return (
              <FontAwesome name="trophy" size={size} color={color}  />
            );
          }
        },
        tabBarInactiveTintColor: 'gray',
        tabBarActiveTintColor: '#F49A54',
        tabBarLabelStyle: {
            fontFamily: 'rale-sb'
        }
      })}
    >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Carriere" component={CareersScreen} options={{ headerShown: false }} />
        <Tab.Screen name="User" component={BlankScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }