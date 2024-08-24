import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef, useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View, Animated, PanResponder, Dimensions, ActivityIndicator, Text, ImageBackground } from 'react-native';
import LineCard from './LineCard';
import TopBar from './TopBar';
import { AnswerContext } from '../AnswerContext';
import { EmailContext } from '../context/EmailContext';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import * as Animatable from 'react-native-animatable';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IsSubmittedContext } from '../context/IsSubmittedContext';
import { IsVisibleContext } from '../context/IsVisibleContext';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('screen');

const CompleteScreen = ({ navigation }) => {
  const { globalemail, setEmail } = useContext(EmailContext);
  const { isSubmitted, setIsSubmitted } = useContext(IsSubmittedContext);
  const visibilityContext = useContext(IsVisibleContext);
  const { ExtraVisibility, setExtraVisibility } = visibilityContext;

  const [showPaywall, setShowPaywall] = useState(false); // Paywall state
  const { answerArray, setMyArray } = useContext(AnswerContext);
  const [lineArray, setLineArray] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [usage, setUsage] = useState(5);
  const topics = [
    'Interests', 'Hobbies', 'Passions', 'Personality traits', 'Physical characteristics', 'Sense of humor', 'Intellectual pursuits', 'Creative expression', 'Adventurous spirit', 'Ambitions', 'Values', 'Beliefs', 'Experiences', 'Emotions', 'Curiosity', 'Spontaneity', 'Confidence', 'Quirks', 'Talents', 'Goals', 'Motivations', 'Inspirations', 'Fascinations', 'Desires', 'Dreams', 'Fears', 'Strengths', 'Weaknesses', 'Opinions', 'Perspectives', 'Lifestyles', 'Routines', 'Rituals', 'Traditions', 'Memories', 'Imagination', 'Creativity', 'Inspiration', 'Motivation', 'Encouragement', 'Support', 'Empathy', 'Understanding', 'Connection', 'Community', 'Growth', 'Learning', 'Exploration', 'Discovery', 'Surprises'
  ];

  const updatedArray = useMemo(() => {
    return answerArray.map((element, index) => {
      if (index === 0) {
        return element === 1 ? 'Female' : 'Male';
      } else if (index === 1) {
        return element === -1 ? 'Romantic' : 'Casual';
      } else if (index === 2) {
        return element === 1 ? 'Serious' : 'Funny';
      } else {
        return element;
      }
    });
  }, [answerArray]);

  const goBackHome = () => {
    setExtraVisibility(false);
    setMyArray((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray.pop(); // Remove the last element
      return newArray; // Update the state with the new array
    });
    setIsSubmitted(false);
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
      // Navigate back to the home screen upon successful purchase
      goBackHome();
    } catch (err) {
      console.error('Error updating purchase DB:', err);
    }
  };

  const presentPaywall = async () => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywall();

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
  };

  useEffect(() => {
    if (answerArray.length === 3) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      setMyArray([...answerArray, randomTopic]);
    }
  }, [answerArray, setMyArray, topics]);

  const generateMessage = useCallback(() => {
    const answerString = updatedArray.join(' ');
    const additionalString1 = 'Make one pickup line based on these parameters: ';
    const additionalString2 = '. Make sure the pickup line is unique';
    const sentMessage = `${additionalString1} ${answerString}${additionalString2}`;
    return sentMessage;
  }, [updatedArray]);

  const fetchPickupLine = useCallback(async () => {
    const message = generateMessage();
    try {
      const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/gptfunc/give-rizz', {
        model: 'gpt-4o',
        message: message,
      });
      return {
        name: response.data.data,
        image: require('../assets/FlirtXBar6.jpeg'),
        swipeLeft: 'Yes',
        swipeRight: 'No',
      };
    } catch (error) {
      console.error('Error fetching pickup line:', error);
      return null;
    }
  }, [generateMessage]);

  const increaseUserPickupLinesDB = useCallback(async () => {
    try {
      const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/getNumberOfLines', {
        id: globalemail,
      });
      const { usageCount } = response.data;

      if (usageCount === 0) {
        presentPaywall();
        return;
      }

      const firstElementLineArr = lineArray[0];
      const linePlacedInDB = firstElementLineArr.name;
      try {
        await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/updatelines', {
          id: globalemail,
          pickupLine: linePlacedInDB,
        });
        console.log('Line successfully updated in the database');
      } catch (error) {
        console.error('Error updating the database:', error);
      }
    } catch (error) {
      console.error('Error fetching the usage count:', error);
    }
  }, [lineArray, globalemail]);

  const decreaseUsageSwipedLeft = useCallback(async () => {
    try {
      const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/getNumberOfLines', {
        id: globalemail,
      });
      const { usageCount } = response.data;
      setUsage(usageCount);

      if (usageCount === 0) {
        presentPaywall();
        return;
      }

      try {
        await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/increaseUsageCount', {
          id: globalemail,
          usageCount: -1,
        });
      } catch (error) {
        console.error('Error decreasing usage count', error);
      }
    } catch (error) {
      console.error('Error fetching the usage count', error);
    }
  }, [globalemail]);

  const fetchInitialPickupLines = useCallback(async () => {
    try {
      const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/getNumberOfLines', {
        id: globalemail,
      });
      const { usageCount } = response.data;

      if (usageCount === 0) {
        presentPaywall();
        return;
      }
    } catch (error) {
      console.error('Error fetching the usage count', error);
    }

    setLoading(true);
    const initialRequests = Array(4).fill(null).map(fetchPickupLine);
    const initialLines = await Promise.all(initialRequests);
    setLineArray(initialLines.filter((line) => line !== null));
    setTimeout(() => setLoading(false), 4000);
  }, [fetchPickupLine, globalemail]);

  useEffect(() => {
    fetchInitialPickupLines();
  }, [fetchInitialPickupLines]);

  const ensureBuffer = useCallback(async () => {
    if (lineArray.length < 4) {
      const newLine = await fetchPickupLine();
      if (newLine) {
        setLineArray((prevArray) => [...prevArray, newLine]);
      }
    }
  }, [fetchPickupLine, lineArray]);

  const handleSwipeRight = () => {
    increaseUserPickupLinesDB();
  };

  const handleSwipeLeft = () => {
    decreaseUsageSwipedLeft();
  };

  const swipe = useRef(new Animated.ValueXY()).current;
  const titleSign = useRef(new Animated.Value(1)).current;

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy, y0 }) => {
      swipe.setValue({ x: dx, y: dy });
      titleSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 100;

      if (isActionActive) {
        if (direction > 0) {
          handleSwipeRight();
        } else {
          handleSwipeLeft();
        }
        Animated.timing(swipe, {
          duration: 800,
          toValue: { x: direction * 500, y: dy },
          useNativeDriver: true,
        }).start(() => {
          swipe.setValue({ x: 0, y: 0 });
          setLineArray((prevArray) => {
            const newArray = prevArray.slice(1);
            ensureBuffer();
            return newArray;
          });
        });
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  }), [ensureBuffer, swipe, titleSign]);

  return (
    <ImageBackground
      source={require('../assets/nightclubvobes.jpeg')} // Replace with your image path
      style={styles.background}
      imageStyle={{ opacity: 0.5 }}
    >
      <View style={styles.container}>
        <TopBar resetLength={goBackHome} navigation={navigation} style={{ zIndex: 0 }} />
        <StatusBar hidden={true} />
        {loading ? (
          <View>
            <Animatable.Text
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={styles.loadingText}
            >
              ❤️
            </Animatable.Text>
          </View>
        ) : (
          lineArray.map(({ name, image, swipeLeft, swipeRight }, index) => {
            const isFirst = index === 0;
            const dragHandlers = isFirst ? panResponder.panHandlers : {};
            return (
              <LineCard
                key={name}
                name={name}
                location="null"
                distance="null"
                age="null"
                image={image}
                isFirst={isFirst}
                swipe={swipe}
                swipeLeft={swipeLeft}
                swipeRight={swipeRight}
                titleSign={titleSign}
                {...dragHandlers}
              />
            );
          }).reverse()
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 200,
    paddingTop: height / 4,
    color: 'rgba(255, 0, 0, 1)',
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default CompleteScreen;
