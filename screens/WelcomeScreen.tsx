import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const [isChecking, setIsChecking] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('rgba(21,101,192,0.95)');

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const language = await AsyncStorage.getItem('userLanguage');
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        'onboardingCompleted',
      );

      if (language && hasCompletedOnboarding) {
        // User has completed setup, go to Home
        setTimeout(() => {
          navigation.replace('Home');
        }, 1500);
      } else {
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setIsChecking(false);
    }
  };

  const handleGetStarted = () => {
    // Pulse animation on button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Language');
    });
  };

  let bg;
  try {
    bg = require('../assets/images/bus4.jpg');
  } catch {
    bg = {
      uri: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    };
  }

  if (isChecking) {
    return (
      <ImageBackground source={bg} style={styles.background}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bg} style={styles.background}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Icon name="bus" size={80} color="#fff" />
          </View>

          <Text style={styles.title}>BRTSConnect</Text>
          <Text style={styles.subtitle}>Surat</Text>

          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>Smart Travel</Text>
            <View style={styles.dot} />
            <Text style={styles.tagline}>Safe Journey</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Icon name="arrow-right" size={24} color="#1565c0" />
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    backgroundColor: 'rgba(21,101,192,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 26,
    color: '#fff',
    marginTop: 5,
    opacity: 0.95,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    letterSpacing: 1,
    fontWeight: '400',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    opacity: 0.7,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 45,
    paddingVertical: 16,
    borderRadius: 35,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#1565c0',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  versionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 40,
    position: 'absolute',
    bottom: -50,
  },
});
