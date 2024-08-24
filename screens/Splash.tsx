import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    Home: undefined;
    Splash: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreenComponent: React.FC<Props> = ({ navigation }) => {
    const opacity = new Animated.Value(0);
    const scale = new Animated.Value(0.5);
    const flickerX = new Animated.Value(1);
    const slideIn = new Animated.Value(-100);
    const [loginOpacity] = useState(new Animated.Value(0));

    useEffect(() => {
        // Flickering effect for the "X"
        const flickerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(flickerX, {
                    toValue: 0.5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerX, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerX, {
                    toValue: 0.2,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerX, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerX, {
                    toValue: 0.7,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerX, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]),
            {
                iterations: -1,
            }
        );

        // Start the flicker animation
        flickerAnimation.start();

        // Initial animations for opacity and scale
        Animated.sequence([
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1.2,
                    friction: 3,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.timing(slideIn, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.bounce,
                }),
            ]),
        ]).start(() => {
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(loginOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'Login' }],
                        })
                      );
                });
            }, 3000); // Wait for 3 seconds before starting the transition to Login
        });
    }, [navigation, loginOpacity]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ ...styles.logoContainer, opacity, transform: [{ scale }] }}>
                <View style={styles.sign}>
                    <Text style={styles.logoText}>
                        <Text style={styles.logoTextFlirt}>Flirt</Text>
                        <Animated.Text style={{ ...styles.logoTextX, opacity: flickerX }}>X</Animated.Text>
                    </Text>
                </View>
            </Animated.View>
            <Animated.View style={{ ...styles.subtitleContainer, transform: [{ translateY: slideIn }] }}>
                <Text style={styles.subtitleText}>The AI Wingman</Text>
            </Animated.View>
            <Animated.View style={{ ...styles.loginContainer, opacity: loginOpacity }}>
                <Text style={styles.loginText}>Navigating to Login...</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E', // Updated background color
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sign: {
    //    padding: 20,
    //    borderWidth: 4,
    //    borderColor: '#E94560', // Updated border color //If you still want the box around the logo 
    //    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    //    borderRadius: 10,
    },
    logoText: {
        fontSize: 75,
        fontFamily: "Caramel", // Use Vibur-Regular font
        fontWeight: 'bold',
        color: '#E94560', // Updated text color
        textShadowColor: '#E94560', // Updated shadow color
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    logoTextFlirt: {
        color: '#FFFFFF', // White color for "Flirt"
    },
    logoTextX: {
        color: '#E94560', // Updated color for "X"
        textShadowColor: '#E94560', // Updated shadow color
        textShadowOffset: { width: 0, height: 0 },
    //    textShadowRadius: 10,
        fontFamily: 'Vibur-Regular', // Ensure the "X" also uses Vibur-Regular font
    },
    subtitleContainer: {
        position: 'absolute',
        bottom: 50,
    },
    subtitleText: {
        fontSize: 18,
        fontFamily: 'Vibur-Regular', // Use Vibur-Regular font
        color: '#CCCCCC', // Updated subtitle color
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
    },
    loginContainer: {
        position: 'absolute',
        bottom: 10,
    },
    loginText: {
        fontSize: 14,
        fontFamily: 'Vibur-Regular', // Use Vibur-Regular font
        color: '#FFFFFF',
        textShadowColor: '#FFFFFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
    },
});

export default SplashScreenComponent;
