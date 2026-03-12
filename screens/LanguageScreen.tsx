import React, { useState, useEffect, useRef } from 'react';
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
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguageScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Create animation values for each card
  const cardAnims = useRef(languages.map(() => new Animated.Value(0))).current;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('rgba(21,101,192,0.97)');

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate cards with stagger
    Animated.stagger(
      150,
      cardAnims.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      )
    ).start();

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

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    animateButton();

    if (!selected) {
      Alert.alert(
        'Select Language',
        'Please choose your preferred language to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    const lang = languages.find(l => l.code === selected);
    if (!lang) return;

    setLoading(true);
    try {
      await AsyncStorage.setItem('userLanguage', lang.code);
      await AsyncStorage.setItem('languageName', lang.name);
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      
      // Smooth transition to Home
      setTimeout(() => {
        navigation.replace('Home');
      }, 500);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to save language preference. Please try again.');
      console.error('Error saving language:', error);
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Use English?',
      'English will be set as default. You can change this later in Settings.',
      [
        {
          text: 'Choose Language',
          style: 'cancel',
        },
        {
          text: 'Continue with English',
          onPress: async () => {
            setLoading(true);
            try {
              await AsyncStorage.setItem('userLanguage', 'en');
              await AsyncStorage.setItem('languageName', 'English');
              await AsyncStorage.setItem('onboardingCompleted', 'true');
              
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
      ]
    );
  };

  let bg;
  try {
    bg = require('../assets/images/bus4.jpg');
  } catch {
    bg = { uri: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800' };
  }

  return (
    <ImageBackground source={bg} style={styles.background}>
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          <Icon name="translate" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Choose Language</Text>
          <Text style={styles.headerSubtitle}>Select your preferred language</Text>
        </View>

        <View style={styles.languageContainer}>
          {languages.map((lang, index) => (
            <Animated.View
              key={lang.code}
              style={[
                styles.cardWrapper,
                {
                  opacity: cardAnims[index],
                  transform: [
                    {
                      translateX: cardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.card,
                  selected === lang.code && styles.selectedCard,
                ]}
                onPress={() => setSelected(lang.code)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View style={styles.langInfo}>
                    <Text style={styles.langName}>{lang.name}</Text>
                    <Text style={styles.nativeName}>{lang.nativeName}</Text>
                  </View>
                </View>
                
                {selected === lang.code && (
                  <View style={styles.checkmark}>
                    <Icon name="check-circle" size={24} color="#4caf50" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1565c0" size="large" />
            ) : (
              <>
                <Text style={styles.continueText}>
                  {selected ? 'Continue' : 'Select a Language'}
                </Text>
                <Icon 
                  name="arrow-right" 
                  size={24} 
                  color={selected ? '#1565c0' : '#999'} 
                />
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

        <Text style={styles.noteText}>
          You can change language later in Settings
        </Text>
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
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  languageContainer: {
    flex: 1,
    justifyContent: 'center',
    maxHeight: 400,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#4caf50',
    backgroundColor: '#f8fff8',
    elevation: 8,
    shadowColor: '#4caf50',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 36,
    marginRight: 15,
  },
  langInfo: {
    flex: 1,
  },
  langName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkmark: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  continueText: {
    color: '#1565c0',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  noteText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});