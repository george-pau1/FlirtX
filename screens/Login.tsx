import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../config/firebase'; // Adjust the import path as needed
import { EmailContext } from '../context/EmailContext'; // Update the path as necessary
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  ChoiceScreen: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { setEmail } = useContext(EmailContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
    error: '',
  });

  const storeUserData = async (value: string) => {
    try {
      await AsyncStorage.setItem('user', value);
    } catch (error) {
      console.warn(error);
    }
  };

  const storePasswordData = async (value: string) => {
    try {
      await AsyncStorage.setItem('password', value);
    } catch (error) {
      console.warn(error);
    }
  };

  const getData = async () => {
    try {
      const email = await AsyncStorage.getItem('user');
      const password = await AsyncStorage.getItem('password');
      if (email && password) {
        setForm({ email, password, error: '' });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLogin = async () => {
    if (form.email === '' || form.password === '') {
      setForm({ ...form, error: 'Email and password are mandatory.' });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setEmail(form.email);
      
      await storeUserData(form.email); // Store user email upon successful login
      await storePasswordData(form.password); // Store the password

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ChoiceScreen' }],
        })
      );
    } catch (error) {
      setForm({ ...form, error: (error as Error).message });
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
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
            Sign in to Flirt<Text style={styles.highlightText}>X</Text>
          </Text>
          <Text style={styles.subtitle}>Your Personal Dating Assistant</Text>
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
          {form.error ? <Text style={styles.errorText}>Incorrect Password</Text> : null}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity onPress={navigateToSignUp} style={styles.formFooterContainer}>
        <Text style={styles.formFooter}>
          Don't have an account? <Text style={styles.formFooterLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
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
    transform: [{ rotate: '-25deg' }],
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
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E94560',
    textAlign: 'center',
    textDecorationLine: 'underline',
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
