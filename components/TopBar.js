import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

export default function TopBar({ resetLength }) {
  const navigation = useNavigation();

  const goHistoryScreen = () => {
    navigation.navigate('History');
  };


  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.textBold}>Flirt</Text>
        <Text style={styles.textBoldRed}>X</Text>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.rightContainer}>
        <FontAwesome
          onPress={resetLength}
          style={styles.icon}
          name="repeat"
          size={35}
          color="#FFFFFF"
        />
        <FontAwesome
          onPress={goHistoryScreen}
          style={styles.icon}
          name="clock-o"
          size={35}
          color="#FFFFFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 85,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A2E',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5.46,
    elevation: 9,
  },
  leftContainer: {
    paddingRight: width/50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FFFFFF',
  },
  textBoldRed: {
    fontWeight: 'bold',
    fontSize: 35,
    color: '#E94560',
    marginLeft: 5,
    paddingRight: width/10
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 30,
    transform: [{rotate: '-0deg'}],
    paddingLeft: width/10
  },
  rightContainer: {
    paddingLeft: width/9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 30,
  },
});
