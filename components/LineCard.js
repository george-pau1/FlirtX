import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Animated 
} from 'react-native';
import React, { 
  Fragment, 
  useCallback 
} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Choice from './Choice';

const { width, height } = Dimensions.get('screen');

const LineCard = ({ 
  name, 
  image, 
  isFirst, 
  swipe, 
  swipeLeft, 
  swipeRight, 
  titleSign, 
  ...rest 
}) => {
  const rotate = Animated.multiply(swipe.x, titleSign).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };

  const likeOpacity = swipe.x.interpolate({
    inputRange: [25, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-100, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderChoice = useCallback(() => {
    return (
      <Fragment>
        <Animated.View
          style={[
            styles.choiceContainer,
            styles.likeContainer,
            { opacity: likeOpacity },
          ]}
        >
          <Choice type={'liketype'} />
        </Animated.View>
        <Animated.View
          style={[
            styles.choiceContainer,
            styles.nopeContainer,
            { opacity: nopeOpacity },
          ]}
        >
          <Choice type={'nopetype'} />
        </Animated.View>
      </Fragment>
    );
  }, [likeOpacity, nopeOpacity]);

  return (
    <Animated.View
      style={[styles.container, isFirst && animatedCardStyle]}
      {...rest}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        <View style={styles.overlay} />
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,.9)']}
        style={styles.gradient}
      >
        <View style={styles.userContainer}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </LinearGradient>
      {isFirst && renderChoice()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  imageContainer: {
    position: 'relative',
    width: width * 0.9,
    height: height * 0.78,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  userContainer: {
    top: 20,
    bottom: 0,
    left: 14,
    justifyContent: 'center',
  },
  name: {
    fontSize: 30,
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '400',
    left: 0,
    bottom: 20,
    textShadowColor: 'rgba(255, 0, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    maxWidth: width * 0.85,
  },
  location: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '300',
    maxWidth: width * 0.85,
  },
  distance: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '300',
    maxWidth: width * 0.85,
  },
  choiceContainer: {
    position: 'absolute',
    top: 100,
  },
  likeContainer: {
    left: 45,
    transform: [{ rotate: '-30deg' }],
  },
  nopeContainer: {
    right: 45,
    transform: [{ rotate: '30deg' }],
  },
});

export default LineCard;
