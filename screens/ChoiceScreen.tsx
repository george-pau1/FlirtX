import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { EmailContext } from '../context/EmailContext';

export default function ChoiceScreen({ navigation }) {
  const [opacity, setOpacity] = useState(0.8);
  const [scaleValue] = useState(new Animated.Value(1));
  const { globalemail, setEmail } = useContext(EmailContext);
  const [onboardingOffering, setOnboardingOffering] = useState(null);

  const navigatePickupLines = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  const updatePurchaseDB = async () => {
    try {
      await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/increaseUsageCount', {
        id: globalemail,
        usageCount: 20
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchOfferings = async () => {
      const offerings = await Purchases.getOfferings();
      setOnboardingOffering(offerings.all['onboarding']);
    };

    fetchOfferings();
  }, []);

  useEffect(() => {
    const showPaywall = async () => {
      console.log(onboardingOffering);
      const randomNumber = Math.random();

      if (randomNumber < 0.8 && onboardingOffering) {
        try {
          const paywallResult = await RevenueCatUI.presentPaywall({ offering: onboardingOffering });

          switch (paywallResult) {
            case PAYWALL_RESULT.NOT_PRESENTED:
              return true;
            case PAYWALL_RESULT.ERROR:
              return false;
            case PAYWALL_RESULT.CANCELLED:
              return false;
            case PAYWALL_RESULT.PURCHASED:
              await updatePurchaseDB();
              return true;
            default:
              return false;
          }

        } catch (error) {
          console.error('Error presenting paywall:', error);
          return false;
        }
      }
    };

    if (onboardingOffering) {
      showPaywall();
    }
  }, [onboardingOffering]);

  const navigateScreenshot = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'UploadImage' }],
      })
    );
  };

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = () => {
    // Clear user data
    setEmail(null);

    // Navigate to the login or welcome screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <ImageBackground
      source={require('../assets/flirtxentrance5.jpg')}
      style={styles.background}
      imageStyle={{ opacity: opacity }}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="white" style={styles.logouticon} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <AnimatedTouchableOpacity
            style={[styles.button, { transform: [{ scale: scaleValue }] }]}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={navigateScreenshot}
          >
            <Ionicons name="camera" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Upload A Screenshot</Text>
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity
            style={[styles.button, { transform: [{ scale: scaleValue }] }]}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={navigatePickupLines}
          >
            <Ionicons name="chatbubbles" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Create A Pickup Line</Text>
          </AnimatedTouchableOpacity>
        </View>
        <View style={styles.sliderContainer}></View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6F61',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 100, // Adjusted to leave space for the logout button
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  icon: {
    color: 'white',
    transform: [{rotate: '0deg'}],
  },
  logouticon: {
    color: 'white',
    transform: [{rotate: '180deg'}],
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
    alignItems: 'center',
  },
  sliderLabel: {
    color: '#ff69b4',
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
