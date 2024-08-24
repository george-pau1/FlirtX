import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmailContext } from '../context/EmailContext';

const PickupLines = () => {
    const [pickupLines, setPickupLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const { globalemail } = useContext(EmailContext);

    useEffect(() => {
        fetchPickupLines();
    }, []);

    const fetchPickupLines = async () => {
        try {
            const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/getPickupLines', {
                id: globalemail
            });
            const data = response.data;
            const lines = data.map(item => item.line);
            setPickupLines(lines);
        } catch (error) {
            // console.error('Error fetching the pickup lines:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeOneLine = async (lineToRemove) => {
        try {
            await axios.delete('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/deletePickupLine', {
                data: {
                    id: globalemail,
                    pickupLine: lineToRemove
                }
            });
            setPickupLines(pickupLines.filter(line => line !== lineToRemove));
        } catch (error) {
            console.error('Error deleting the pickup line:', error);
        }
    };

    const addToFavorites = async (lineToAdd) => {
        try {
            await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/addFavorite', {
                id: globalemail,
                pickupLine: lineToAdd
            });
            setPickupLines(pickupLines.filter(line => line !== lineToAdd));
        } catch (error) {
            console.error('Error adding pickup line to favorites:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff4d4d" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Title style={styles.title}>Pickup Lines</Title>
                    {pickupLines.length === 0 ? (
                        <Text style={styles.noLinesText}>No pickup lines available</Text>
                    ) : (
                        pickupLines.map((line, index) => (
                            <Card key={index} style={styles.card}>
                                <Card.Content>
                                    <Paragraph style={styles.paragraph}>{line}</Paragraph>
                                </Card.Content>
                                <Card.Actions style={styles.actions}>
                                    <IconButton
                                        icon={() => <Icon name="delete" size={20} color="#ff4d4d" />}
                                        style={styles.transparentButton}
                                        onPress={() => removeOneLine(line)}
                                    />
                                    <IconButton
                                        icon={() => <Icon name="star" size={20} color="#FFD700" />}
                                        style={styles.transparentButton}
                                        onPress={() => addToFavorites(line)}
                                    />
                                </Card.Actions>
                            </Card>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    scrollContainer: {
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#ffffff',
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    paragraph: {
        color: '#ffffff',
    },
    actions: {
        justifyContent: 'flex-end',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noLinesText: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 18,
        marginTop: 20,
    },
    transparentButton: {
        backgroundColor: 'transparent',
    },
});

export default PickupLines;
