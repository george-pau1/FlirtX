import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CompleteScreen from "./components/CompleteScreen";
import { AnswerProvider } from './AnswerContext';
import { EmailProvider } from './context/EmailContext';
import { IsSubmittedProvider } from './context/IsSubmittedContext';
import { IsVisibleProvider } from './context/IsVisibleContext';
import SplashScreenComponent from "./screens/Splash";
import { Provider as PaperProvider } from 'react-native-paper';
import SignUpScreen from "./screens/SignInScreen";
import LoginScreen from "./screens/Login";
import HistoryScreen from "./screens/HistoryScreen";
import FavoritesScreen from "./screens/FavoritesScreen"
import PaywallScreen from "./screens/PaywallScreen";
import UploadImage from "./screens/ImagePicker"
import ChoiceScreen from "./screens/ChoiceScreen"
import Purchases from 'react-native-purchases'
import {AuthProvider} from './context/AuthContext'

const Stack = createNativeStackNavigator();

export default function App() {

  //Configure Revenue Cat
  useEffect(() => {
  const tester = async () => {
    if (Platform.OS === 'ios') {

      if (!process.env.EXPO_PUBLIC_RC_IOS) {
        Alert.alert("Error configure Revenue Cat", "RevenueCat API key for ios not provided")
      }
      else{
        Purchases.configure({apiKey: process.env.EXPO_PUBLIC_RC_IOS});
      }
    } else if (Platform.OS === 'android') {
      console.log("This is a problem since we are in android")
      Purchases.configure({apiKey: process.env.EXPO_PUBLIC_RC_ANDROID});
  }
     const prods = await Purchases.getOfferings()
     console.log(prods)
  };

  tester();
  }, [])


  return (
    <AuthProvider>
    <IsVisibleProvider>
      <PaperProvider>
      <IsSubmittedProvider>
        <EmailProvider>
          <AnswerProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="UploadImage" component={UploadImage} options={{ headerShown: false }} />
                <Stack.Screen name="Paywall" component={PaywallScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Splash" component={SplashScreenComponent} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ChoiceScreen" component={ChoiceScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="GetLines" component={CompleteScreen} options={{ headerShown: false }} />
                <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
              </Stack.Navigator>
            </NavigationContainer>
          </AnswerProvider>
        </EmailProvider>
      </IsSubmittedProvider>
      </PaperProvider>
    </IsVisibleProvider>
    </AuthProvider>
  );
}
