import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>;

interface Language {
  code: string;
  name: string;
  flag: string;
}

export default function LanguageScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Slower animations
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    // Slower entrance animation for the whole screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // Slower fade in (1.5 seconds)
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 10, // Lower tension = slower spring
        friction: 8,  // Higher friction = slower movement
        useNativeDriver: true,
      }),
    ]).start();

    checkSavedLanguage();
  }, []);

  const checkSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem('userLanguage');
      if (saved) {
        setSelected(saved);
      }
    } catch (error) {
      console.error('Error checking saved language:', error);
    }
  };

  // Slower button animation when language is selected
  useEffect(() => {
    if (selected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03, // Smaller scale for subtle effect
          duration: 400,  // Slower scale up (0.4 seconds)
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,  // Slower scale down (0.4 seconds)
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected]);

  const handleContinue = async () => {
    if (!selected) {
      return Alert.alert(
        'Select Language',
        'Please choose a language to continue.',
        [{ text: 'OK' }],
      );
    }

    const lang = languages.find(l => l.code === selected);
    if (!lang) return;

    setLoading(true);
    try {
      await AsyncStorage.setItem('userLanguage', lang.code);
      await AsyncStorage.setItem('languageName', lang.name);
      
      // Add small delay before navigation for better UX
      setTimeout(() => {
        navigation.replace('Home');
      }, 500);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to save language preference.');
      console.error('Error saving language:', error);
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Language Selection',
      'English will be set as default. You can change this later in settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue with English',
          onPress: async () => {
            setLoading(true);
            try {
              await AsyncStorage.setItem('userLanguage', 'en');
              await AsyncStorage.setItem('languageName', 'English');
              
              // Add small delay before navigation
              setTimeout(() => {
                navigation.replace('Home');
              }, 500);
              
            } catch (error) {
              Alert.alert('Error', 'Failed to save language preference.');
              console.error('Error saving language:', error);
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  let bg;
  try {
    bg = require('../assets/images/bus4.jpg');
  } catch {
    bg = { uri: 'https://via.placeholder.com/400x800.png' };
  }

  return (
    <ImageBackground source={bg} style={styles.background}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(21,101,192,0.97)"
      />
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.header}>Choose Language</Text>

        {/* Centered Language Buttons Container */}
        <View style={styles.centerContainer}>
          <View style={styles.langContainer}>
            {languages.map((l, index) => {
              // Individual card animation with delay
              const cardAnim = new Animated.Value(0);
              
              useEffect(() => {
                Animated.timing(cardAnim, {
                  toValue: 1,
                  duration: 800,
                  delay: index * 200, // Each card appears with delay
                  useNativeDriver: true,
                }).start();
              }, []);

              return (
                <Animated.View
                  key={l.code}
                  style={{
                    opacity: cardAnim,
                    transform: [
                      {
                        translateX: cardAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={[styles.card, selected === l.code && styles.selected]}
                    onPress={() => setSelected(l.code)}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.flag}>{l.flag}</Text>
                    <Text style={styles.langName}>{l.name}</Text>
                    {selected === l.code && (
                      <Icon name="check-circle" size={24} color="#4caf50" />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1565c0" size="large" />
            ) : (
              <>
                <Text style={styles.buttonText}>Continue to Home</Text>
                <Icon name="arrow-right" size={24} color="#1565c0" />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {!selected && !loading && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.6}
          >
            <Text style={styles.skipText}>Skip for now (English)</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
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
    backgroundColor: 'rgba(21,101,192,0.97)',
    padding: 20,
  },
  header: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
    letterSpacing: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  langContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#4caf50',
    backgroundColor: '#f0f9f0',
    elevation: 8,
    shadowColor: '#4caf50',
    shadowOpacity: 0.3,
  },
  flag: {
    fontSize: 32,
    marginRight: 15,
  },
  langName: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    color: '#333',
  },
  button: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#1565c0',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  skipText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});