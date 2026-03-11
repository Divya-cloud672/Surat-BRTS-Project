import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    // Animate welcome screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 15,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if user has already selected language
    checkLanguage();
  }, []);

  const checkLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem('userLanguage');
      // If language already selected, go to Home after a brief delay
      if (lang) {
        setTimeout(() => {
          navigation.replace('Home');
        }, 2000); // Show welcome screen for 2 seconds
      }
    } catch (error) {
      console.error('Error checking language:', error);
    }
  };

  const handleGetStarted = () => {
    navigation.replace('Language');
  };

  let bg;
  try {
    bg = require('../assets/images/bus4.jpg');
  } catch {
    bg = { uri: 'https://via.placeholder.com/400x800.png' };
  }

  return (
    <ImageBackground source={bg} style={styles.background}>
      <View style={styles.overlay}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: 'center',
            width: '100%',
          }}
        >
          <View style={styles.iconContainer}>
            <Icon name="bus" size={80} color="#fff" />
          </View>
          <Text style={styles.title}>BRTSConnect</Text>
          <Text style={styles.subtitle}>Surat</Text>
          <Text style={styles.tagline}>Smart Travel • Safe Journey</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Icon name="arrow-right" size={24} color="#1565c0" />
          </TouchableOpacity>
        </Animated.View>
      </View>
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
    flex: 1,
    backgroundColor: 'rgba(21,101,192,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
    fontWeight: '500',
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    opacity: 0.8,
    letterSpacing: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#1565c0',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});
