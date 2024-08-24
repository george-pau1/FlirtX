import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, FlatList, Text, Alert } from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { EmailContext } from '../context/EmailContext';

const FavoritesScreen = () => {
    const { globalemail, setEmail } = useContext(EmailContext);
    const [favoriteLines, setFavoriteLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavoriteLines = async () => {
            try {
                const userId = globalemail; // Replace with the actual user ID
                const response = await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/getFavoriteLines', { id: userId });
                setFavoriteLines(response.data);
            } catch (err) {
                setError('No Favorite Lines Have Been Added.');
             //   console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteLines();
    }, []);

    const handleDelete = async (favoriteLineChosen) => {
        try {
            const userId = globalemail; // Replace with the actual user ID
            await axios.delete('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/deleteFavoriteLine', { 
                data: {
                    id: globalemail, 
                    favoriteLine: favoriteLineChosen
                } 
            });
            setFavoriteLines(favoriteLines.filter(line => line !== favoriteLineChosen));
        } catch (err) {
            Alert.alert('Error', 'Failed to delete favorite line.');
            console.error(err);
        }
    };

    const handleCopy = (favoriteLine) => {
        Clipboard.setString(favoriteLine);
        Alert.alert('Copied to Clipboard', 'The line has been copied to your clipboard.');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ff4d4d" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Paragraph style={styles.errorText}>{error}</Paragraph>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favoriteLines}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Title style={styles.title}>{item}</Title>
                        </Card.Content>
                        <Card.Actions style={styles.cardActions}>
                            <IconButton
                                icon="content-copy"
                                color="#ffffff"
                                size={20}
                                onPress={() => handleCopy(item)}
                            />
                            <Button
                                mode="contained"
                                style={styles.buttonColor}
                                onPress={() => handleDelete(item)}
                                icon="delete"
                                labelStyle={styles.buttonLabel}
                            >
                                Delete
                            </Button>
                        </Card.Actions>
                    </Card>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 20,
    },
    buttonColor: {
        backgroundColor: '#ff4d4d',
    },
    card: {
        marginVertical: 10,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: '#333',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: '#ffffff',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
        paddingBottom: 10,
    },
    buttonLabel: {
        color: '#ffffff',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default FavoritesScreen;
