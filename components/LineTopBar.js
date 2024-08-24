import React from 'react'
import {StyleSheet, View, Text, SafeAreaView, Image} from 'react-native'
import {FontAwesome6, FontAwesome} from '@expo/vector-icons'

export default function LineTopBar({resetLengthLines}){
    return (
            <View style={styles.container}>
                    <Text style={styles.textBold}> Flirt</Text>
                    <Text style={styles.textBoldRed}>X  </Text>
                    <Image source={require('../assets/logowhite.png')} style={{ width: 25, height: 25, left:80}}/>
                    <View style={styles.rightContainer}>
                        <FontAwesome onPress={resetLengthLines} hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        style={styles.element1} name="repeat" size={35}></FontAwesome>
                        <FontAwesome style={styles.element2} name="clock-o" size={35}></FontAwesome>
                    </View>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height:85,
        flexDirection: 'row',
        paddingTop:50,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height:10,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5.46,
        elevation: 9,
    },
    textBold:{
        fontWeight: 'bold',
        paddingLeft:5,
        fontSize: 25,
    },
    textBoldRed: {
        fontWeight: 'bold',
        fontSize:30,
        color: 'red',
        paddingVertical:-20,
    },
    rightside1: {
        paddingLeft:200,
        flexDirection: 'row',
    },
    rightside2: {
        flexDirection: 'row',
        paddingLeft: 0,
    },
    rightContainer: {
        flex: 1, // Takes up 2/3 of the screen
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row', // Vertical layout for elements inside
    },
    element1: {
        paddingLeft: 150,
    },
    element2: {
        paddingLeft: 30,
    },
});