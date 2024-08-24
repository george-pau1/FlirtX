import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { IsSubmittedContext } from '../context/IsSubmittedContext';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

const Stack = createNativeStackNavigator();

const AddExtra = ({ answerArray, addToArray, isVisible, navigation }) => {
    const [text, setText] = useState('');
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const { isSubmitted, setIsSubmitted } = useContext(IsSubmittedContext);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const [opacity, setOpacity] = useState(1);
    const animation = new Animated.Value(1);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 100000,
            useNativeDriver: true,
        }).start();
    }, []);

    const resetAnimation = () => {
        animation.setValue(1);
    };

    const interpolateOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const handleAdd = async () => {
        addToArray(text);
        console.log(answerArray);
        setIsSubmitted(true);
    };

    const handleX = () => {
        setIsSubmitted(true);
    };

    const handleTextChange = (newText) => {
        setText(newText);
        if (newText.length > 0) {
            setShowPlaceholder(false);
        } else {
            setShowPlaceholder(true);
        }
    };

    useEffect(() => {
        if (isSubmitted && isVisible) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'GetLines' }],
                })
            );
        }
    }, [isSubmitted, isVisible, navigation]);

    return isVisible && (
        <View style={styles.container}>
            <TextInput
                value={text}
                onChangeText={handleTextChange}
                placeholderTextColor="#ccc"
                style={styles.inputcontainer}
                multiline={true}
                returnKeyType="done"
                blurOnSubmit={true}
            />
            {showPlaceholder && (
                <Text style={styles.textcontainer}>
                    Add More Here...
                </Text>
            )}
            {showPlaceholder && (
                <View style={styles.movedown}>
                    <Animated.View
                        style={[
                            styles.circle,
                            {
                                opacity: interpolateOpacity,
                            },
                        ]}
                    >
                        <FontAwesome
                            style={styles.container1}
                            name="times"
                            size={50}
                            color="#F00"
                            onPress={handleX}
                        />
                    </Animated.View>
                </View>
            )}
            {!showPlaceholder && (
                <FontAwesome style={styles.xbuttoncontainer} onPress={handleAdd} name="check" size={60} color="#0F0" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'visible',
        top: 50,
         // Dark background
        padding: 20,
        borderRadius: 20,
    },
    textcontainer: {
        paddingTop: height/18,
        paddingLeft: width/4,
        fontSize: 30,
        position: 'absolute',
        color: '#ffffff',
        textShadowColor: '#ff0000',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    inputcontainer: {
        width: width * 0.9,
        height: height * 0.6,
        borderColor: '#FF3131',
        borderWidth: 3,
        textAlignVertical: 'top',
        paddingTop: 10,
        paddingLeft: 10,
        fontSize: 30,
        color: '#fff',
        backgroundColor: '#333',
        borderRadius: 10,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    xbuttoncontainer: {
        paddingBottom: 400,
        paddingLeft: 150,
        color: '#fff',
        textShadowColor: '#0f0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    container1: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    movedown: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: 'black', //Might need to change this
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f00',
        alignItems: 'center',
        shadowColor: '#f00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    icon: {
        position: 'absolute',
        top: 30,
        left: 30,
    },
});

export default AddExtra;
