import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder, Dimensions, ImageBackground, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { users as usersArray } from './utils/data';
import Card from './components/Card';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import AddExtra from './components/AddExtra';
import axios from 'axios';
import { AnswerContext } from './AnswerContext';
import { IsSubmittedContext } from './context/IsSubmittedContext';
import { IsVisibleContext } from './context/IsVisibleContext';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState(usersArray);
  const [isFirst, setFirst] = useState(true);

  const visibilityContext = useContext(IsVisibleContext);
  const { ExtraVisibility, setExtraVisibility } = visibilityContext; 

  const { isSubmitted, setIsSubmitted } = useContext(IsSubmittedContext); 
  const answerContext = useContext(AnswerContext);
  const { answerArray, setMyArray } = answerContext;

  const addToArray = (newItem) => {
    setMyArray((prevArray) => [...prevArray, newItem]);
  };

  const swipe = useRef(new Animated.ValueXY()).current;
  const titleSign = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy, y0 }) => {
      swipe.setValue({ x: dx, y: dy });
      titleSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 100;
      if (isActionActive) {
        Animated.timing(swipe, {
          duration: 800,
          toValue: { x: direction * 500, y: dy },
          useNativeDriver: true,
        }).start(removeTopCard);
        setMyArray((prevArray) => [...prevArray, direction]);
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });

  const removeTopCard = useCallback(() => {
    setFirst(false);
    setUsers((prevState) => prevState.slice(1));
    swipe.setValue({ x: 0, y: 0 });
  }, [swipe]);

  const handleChoice = useCallback((direction) => {
    setFirst(false);
    setMyArray((prevArray) => [...prevArray, direction]);
    Animated.timing(swipe.x, {
      toValue: direction * 500,
      duration: 200,
      useNativeDriver: true,
    }).start(removeTopCard);
  }, [removeTopCard, swipe.x]);

  useEffect(() => {
    if (!users.length && !ExtraVisibility) {
      setIsSubmitted(false);
      resetLength();
    }
  }, [ExtraVisibility]);

  useEffect(() => {
    if (!users.length) {
      setExtraVisibility(true);
    }
  }, [users.length]);

  const resetLength = () => {
    setUsers(usersArray);
    swipe.setValue({ x: 0, y: 0 });
    setMyArray((prevArray) => prevArray.slice(0, 0));
    setExtraVisibility(false);
  };

  const handleBackPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ChoiceScreen' }],
      })
    );
  };

  return (
    <ImageBackground
      source={require('./assets/background-nightclub.jpeg')} // Replace with your image path
      style={styles.background}
      imageStyle={{ opacity: 0.5 }}
    >
      <View style={styles.container}>
        <TopBar resetLength={resetLength} navigation={navigation} style={{ zIndex: 0 }} />
        <StatusBar hidden={true} />
        {users.map(({ name, image, location, distance, swipeLeft, swipeRight, age }, index) => {
          const isFirst = index === 0;
          const dragHandlers = isFirst ? panResponder.panHandlers : {};
          return (
            <Card
              key={name}
              name={name}
              location={location}
              distance={distance}
              age={age}
              image={image}
              isFirst={isFirst}
              swipe={swipe}
              swipeLeft={swipeLeft}
              swipeRight={swipeRight}
              titleSign={titleSign}
              {...dragHandlers}
            />
          );
        }).reverse()}
        <AddExtra answerArray={answerArray} addToArray={addToArray} isVisible={ExtraVisibility} navigation={navigation} />
        <Footer handleChoice={handleChoice} navigation={navigation} />
        {users.length > 2 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.5)', // Background color with 50% opacity
  },
  backButton: {
    position: 'absolute',
    top: 90,
    left: 10,
    backgroundColor: '#E94560', // A nice blue color for the button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000', // Add shadow for a subtle 3D effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add elevation for Android
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Add any other styles you need here
});
