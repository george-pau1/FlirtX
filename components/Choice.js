import { View, Text} from 'react-native'
import React from 'react'

const COLORS = {
    liketype: "#00eda6",
    nopetype: "#ff006f",
    maletype: "#5ce1e6",
    femaletype: "#ff3131",
    casualtype: "#F5EEF8",
    romantictype: "#ff006f",
    funnytype: "#DC7633",
    serioustype: "#7D3C98",
}
//Make the "like" and "nope" associated with the questions
//Make a random generator for the topics that the pickups lines are used for
  //Array of 50 elements that the topic is randomly chosen from

//On the first page, need to have a feature that says "Surprise Me" -> To create pickup lines on the spot
//For this, we can go straight into creating the pickup lines.
const Choice = ({type}) => {
    const color = COLORS[type]
  return (
    <View style={{
        borderWidth: 7,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,.2)',
        borderColor: color
    }}>
      <Text style={{
        fontSize: 48,
        fontWeight: 'bold',
        textTransform: "uppercase",
        letterSpacing: 4,
        color: color
      }}>{type.substring(0, type.length - 4)}</Text>
    </View>
  )
}

export default Choice