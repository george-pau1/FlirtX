import { View, Text , Animated} from 'react-native'
import React from 'react'
import Button from './Button'

const COLORS = {
    like: "#00eda6",
    nope: "#ff006f",
    star: "#07A6FF"
}
const Footer = ({handleChoice, navigation}) => {
  const goToFavorites = () => {
      navigation.navigate('Favorites');
      // Add your custom action for swipe right here
    }; 
  return (
    <View style={{
        position: 'absolute',
        bottom: 15,
        width: 240,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        zIndex: -999
    }}>
      <Button
        name="arrow-left"
        size={24}
        color={COLORS.nope}
        onPress={()=>handleChoice(-1)}
      />
      <Button
        name="star"
        size={24}
        onPress={()=>goToFavorites()}
        color={COLORS.star}
        style={{
            height:40,
            width: 40
        }}
      />
      <Button
        name="arrow-right"
        size={24}
        color={COLORS.like}
        onPress={()=>handleChoice(1)}
      />
    </View>
  )
}

export default Footer