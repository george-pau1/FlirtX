import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
    View,
    Image,
    Text,
    Alert,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Clipboard from 'expo-clipboard';
import { CommonActions } from '@react-navigation/native';
import { EmailContext } from '../context/EmailContext';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

export default function UploadImage({ navigation }) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [detectedText, setDetectedText] = useState(null);
    const [receivedText, setReceivedText] = useState(null);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [additionalText, setAdditionalText] = useState('');
    const [flirtLevel, setFlirtLevel] = useState(1);
    const [showAddMoreButton, setShowAddMoreButton] = useState(false);
    const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
    const { globalemail, setEmail } = useContext(EmailContext);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(status === 'granted');
        })();
    }, []);

    const getFlirtLevelText = (level) => {
        switch (level) {
            case 1:
                return "Level 1: Casual Joke";
            case 2:
                return "Level 2: Playful Tease";
            case 3:
                return "Level 3: Slight Flirt";
            case 4:
                return "Level 4: Sincere Confession";
            case 5:
                return "Level 5: Romantic Declaration";
            default:
                return "";
        }
    };

    const getFlirtLevelTextInternal = (level) => {
        switch (level) {
            case 1:
                return "Ensure the joke is unique, clever, and genuinely funny. This is for a conversation between two mature individuals. The joke should be memorable and suitable for an adult audience, sparking both laughter and interest. Avoid clichés.";
            case 2:
                return "Level 2: Playful Tease. This adds a touch of flirtatious humor.";
            case 3:
                return "Level 3: Slight Flirt. This shows interest without being too forward.";
            case 4:
                return "Level 4: Sincere Confession. This is a genuine expression of feelings. For this, make sure to be forward with the text and showcase the intention.";
            case 5:
                return "Level 5: Romantic Declaration. This is a heartfelt and romantic statement. You can make this a little horny and make sure to follow recent trends in dating";
            default:
                return "";
        }
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

    const presentPaywallToUser = async () => {
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

    const decreaseUsageCount = useCallback(async () => {
        try {
            const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/getNumberOfLines', {
                id: globalemail,
            });
            const { usageCount } = response.data;

            if (usageCount === 0) {
                presentPaywallToUser();
                return false; // Indicate that the usage count is zero
            }

            try {
                await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/increaseUsageCount', {
                    id: globalemail,
                    usageCount: -1,
                });
            } catch (error) {
                console.error('Error increasing usage count', error);
            }

            return true; // Indicate that the usage count was decreased successfully
        } catch (error) {
            console.error('Error fetching the usage count', error);
            return false; // Indicate an error occurred
        }
    }, [globalemail]);

    const getTextResponse = async () => {
        setLoadingResponse(true);
        setShowAdditionalOptions(false);
        const flirtLevelDescription = getFlirtLevelTextInternal(flirtLevel);
        const sentMessage = `The detected text is: "${detectedText}". Please provide a concise, one-line response to this message, as if you were continuing a text conversation. ${flirtLevelDescription}. Make sure that it's one line and short. Make sure that it's like an actual text. Whatever I say after this message, make sure that it's a text response.`;

        try {
            const usageAllowed = await decreaseUsageCount(); // Check if usage is allowed
            if (!usageAllowed) return; // Exit if usage count is zero

            const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/gptfunc/give-rizz', {
                model: 'gpt-4o',
                message: sentMessage,
            });
            setReceivedText(response.data.data);
            setShowAddMoreButton(true);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to get response. Please try again.');
        } finally {
            setLoadingResponse(false);
        }
    };

    const appendAndSend = async () => {
        setLoadingResponse(true);
        const flirtLevelDescription = getFlirtLevelText(flirtLevel);
        const newMessage = `${receivedText} ${additionalText}. ${flirtLevelDescription}. make this into a text message that's short and concise.`;

        try {
            const usageAllowed = await decreaseUsageCount(); // Check if usage is allowed
            if (!usageAllowed) return; // Exit if usage count is zero

            const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/gptfunc/give-rizz', {
                model: 'gpt-4o',
                message: newMessage,
            });
            setReceivedText(response.data.data);
            setAdditionalText('');
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to get response. Please try again.');
        } finally {
            setLoadingResponse(false);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick an image. Please try again.');
        }
    };

    const uploadImage = async (fileUri) => {
        setUploading(true);
        const data = new FormData();

        data.append('file', {
            uri: fileUri,
            type: 'image/jpeg',
            name: 'upload.jpg',
        });
        data.append('upload_preset', 'images');
        data.append('cloud_name', 'dq9vilkvp');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dq9vilkvp/image/upload', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const responseData = await response.json();
            if (response.ok) {
                const imageUrl = responseData.secure_url;
                console.log(imageUrl);
                Alert.alert('Success', 'Image uploaded successfully!');

                const textDetectionResponse = await fetch('https://us-central1-flirtx-5696f.cloudfunctions.net/visionAPI/detect-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imageUrl }),
                });

                const textDetectionData = await textDetectionResponse.json();
                if (textDetectionResponse.ok) {
                    setDetectedText(textDetectionData.data);
                } else {
                    console.log('Text detection error:', textDetectionData);
                    Alert.alert('Error', 'Failed to detect text. Please try again.');
                }
            } else {
                console.log('Upload error:', responseData);
                Alert.alert('Error', 'Failed to upload image. Please try again.');
            }
        } catch (error) {
            console.log('Upload error:', error);
            Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied to Clipboard', 'The message has been copied to your clipboard.');
    };

    if (hasGalleryPermission === false) {
        return <Text>No access to Internal Storage</Text>;
    }

    const handleBackButtonPress = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'ChoiceScreen' }],
            })
        );
    };

    return (
        <ImageBackground 
            source={require('../assets/FlirtXBar6.jpeg')}
            style={styles.background}
        >
            <View style={styles.overlay} />
            <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Ionicons name="image-outline" size={24} color="white" />
                    <Text style={styles.buttonText}>Pick Image</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
                {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
                {image && !uploading && (
                    <TouchableOpacity style={styles.button} onPress={getTextResponse} disabled={loadingResponse || uploading}>
                        <FontAwesome name="commenting-o" size={24} color="white" />
                        <Text style={styles.buttonText}>Get Response</Text>
                    </TouchableOpacity>
                )}
                {loadingResponse && <ActivityIndicator size="large" color="#ff6f61" />}
                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>{getFlirtLevelText(flirtLevel)}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={5}
                        step={1}
                        value={flirtLevel}
                        onValueChange={setFlirtLevel}
                        minimumTrackTintColor="#ff6f61"
                        maximumTrackTintColor="#ccc"
                        thumbTintColor="#ff6f61"
                    />
                </View>
                {receivedText && (
                    <View style={styles.textContainer}>
                        <View style={styles.sentMessage}>
                            <Text style={styles.sentText}>{receivedText}</Text>
                            <View style={styles.rightArrow}></View>
                            <View style={styles.rightArrowOverlap}></View>
                        </View>
                        <View style={styles.rightAlign}>
                            {showAddMoreButton && !showAdditionalOptions && (
                                <TouchableOpacity style={styles.button} onPress={() => setShowAdditionalOptions(true)}>
                                    <FontAwesome name="plus" size={24} color="white" />
                                    <Text style={styles.buttonText}>Add More?</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(receivedText)}>
                                <FontAwesome name="clipboard" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        {showAdditionalOptions && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Add more to the reply..."
                                    placeholderTextColor="#ccc"
                                    value={additionalText}
                                    onChangeText={setAdditionalText}
                                />
                                <TouchableOpacity style={styles.button} onPress={appendAndSend} disabled={loadingResponse || uploading}>
                                    <FontAwesome name="paper-plane-o" size={24} color="white" />
                                    <Text style={styles.buttonText}>Send</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust opacity as needed
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6f61',
        padding: 10,
        borderRadius: 20,
        zIndex: 1, // Ensure backButton is on top
    },
    backButtonText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    rightAlign: {
        flexDirection: 'row'
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        // borderRadius: 15,
        // borderWidth: 2,
        borderColor: '#ff6f61',
    },
    textContainer: {
        marginTop: 0,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
        width: '100%',
    },
    sentMessage: {
        backgroundColor: "#147efb",
        padding: 10,
        borderRadius: 20,
        marginTop: 0,
        marginRight: "5%",
        maxWidth: '90%',
        alignSelf: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    sentText: {
        fontSize: 19,
        color: "#fff",
    },
    input: {
        height: 40,
        borderColor: '#ff6f61',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: '#333',
        color: '#fff',
        width: '100%',
    },
    uploadingText: {
        color: '#ff6f61',
        fontSize: 16,
        marginVertical: 10,
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    sliderLabel: {
        color: '#ff6f61',
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    slider: {
        width: '90%',
        height: 40,
        borderRadius: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6f61',
        padding: 12,
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    copyButton: {
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#147efb',
        padding: 10,
        borderRadius: 20,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    rightArrow: {
        position: "absolute",
        backgroundColor: "#147efb",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: -10
    },
    rightArrowOverlap: {
        position: "absolute",
        backgroundColor: "#1a1a1a",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -20
    },
});
