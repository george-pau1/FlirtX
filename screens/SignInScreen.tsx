import React, { useState, useContext } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../config/firebase'; // Adjust the import path as needed
import { EmailContext } from '../context/EmailContext'; // Update the path as necessary
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  ChoiceScreen: undefined;
};

type Props1 = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props1) {
  const { globalemail, setEmail } = useContext(EmailContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
    error: '',
  });

  const createAccountDB = async () => {
    try {
      await axios.post('https://us-central1-flirtx-5696f.cloudfunctions.net/firestorefunc/create', {
        email: form.email,
        paidstatus: '0'
      });
      console.log('User created');
    } catch (error) {
      console.error('Error updating the database:', error);
    }
  };

  const storeUserData = async (email: string, password: string) => {
    try {
      await AsyncStorage.setItem('user', email);
      await AsyncStorage.setItem('password', password);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSignUp = async () => {
    if (form.email === '' || form.password === '') {
      setForm({ ...form, error: 'Email and password are mandatory.' });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      Alert.alert('Success', 'Account created successfully');
      setEmail(form.email);
      createAccountDB();
      storeUserData(form.email, form.password);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ChoiceScreen' }],
        })
      );
    } catch (error) {
      setForm({ ...form, error: (error as Error).message });
      Alert.alert('Sign Up failed', (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={require('../assets/neonlips.png')}
          />
          <Text style={styles.title}>
            Sign up for Flirt<Text style={styles.highlightText}>X</Text>
          </Text>
          <Text style={styles.subtitle}>
            Your Personal Dating Assistant
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#AAB8C2" style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#AAB8C2"
                style={styles.inputControl}
                value={form.email}
              />
            </View>
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#AAB8C2" style={styles.inputIcon} />
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#AAB8C2"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>
          </View>

          {form.error ? <Text style={styles.errorText}>{form.error}</Text> : null}

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignUp}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign up</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.formFooterContainer}
        >
          <Text style={styles.formFooter}>
            Already have an account? <Text style={styles.formFooterLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 100,
    height: 100,
    marginBottom: 24,
    transform: [{rotate: '-25deg'}],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: '#E94560',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  highlightText: {
    color: '#E94560',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  form: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F3460',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E94560',
  },
  inputIcon: {
    marginRight: 8,
  },
  inputControl: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#FFFFFF',
  },
  formAction: {
    marginTop: 24,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 14,
    backgroundColor: '#E94560',
    shadowColor: '#E94560',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  formFooterContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  formFooter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formFooterLink: {
    color: '#E94560',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#E94560',
    textAlign: 'center',
    marginBottom: 10,
  },
});
