// screens/LanguageScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LanguageScreen({ navigation }) {
  const [selectedLang, setSelectedLang] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      native: 'English', 
      icon: 'alphabet-latin',
      flag: '🇬🇧'
    },
    { 
      code: 'hi', 
      name: 'Hindi', 
      native: 'हिन्दी', 
      icon: 'alpha-h',
      flag: '🇮🇳'
    },
    { 
      code: 'gu', 
      name: 'Gujarati', 
      native: 'ગુજરાતી', 
      icon: 'alpha-g',
      flag: '🇮🇳'
    },
  ];

  const handleLanguageSelect = async (lang) => {
    setSelectedLang(lang.code);
    
    try {
      setLoading(true);
      // Store selected language
      await AsyncStorage.setItem('userLanguage', lang.code);
      await AsyncStorage.setItem('languageName', lang.name);
      
      // Show success message
      Alert.alert(
        'Language Selected',
        `You have selected ${lang.name} (${lang.native})`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.replace('Home'),
          },
        ]
      );
    } catch (error) {
      console.log('Error saving language:', error);
      Alert.alert('Error', 'Failed to save language preference');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bus4.jpg')}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="translate" size={60} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Choose Your Language</Text>
          <Text style={styles.headerSubtitle}>अपनी भाषा चुनें • તમારી ભાષા પસંદ કરો</Text>
        </View>

        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                selectedLang === lang.code && styles.selectedCard,
              ]}
              onPress={() => handleLanguageSelect(lang)}
              activeOpacity={0.7}
              disabled={loading}
            >
              <View style={styles.flagContainer}>
                <Text style={styles.flag}>{lang.flag}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Icon name={lang.icon} size={35} color="#1565c0" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.languageName}>{lang.name}</Text>
                <Text style={styles.nativeName}>{lang.native}</Text>
              </View>
              {selectedLang === lang.code && (
                <View style={styles.checkContainer}>
                  <Icon name="check-circle" size={30} color="#4caf50" />
                </View>
              )}
              <View style={styles.arrowContainer}>
                <Icon name="chevron-right" size={24} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedLang || loading) && styles.disabledButton,
            ]}
            onPress={() => selectedLang && navigation.replace('Home')}
            disabled={!selectedLang || loading}
          >
            <Text style={styles.continueText}>Continue to App</Text>
            <Icon name="arrow-right" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.replace('Home')}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          <Text style={styles.noteText}>
            You can change language later in settings
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 101, 192, 0.97)',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  headerIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  languageContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  languageCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#4caf50',
    backgroundColor: '#f8fff8',
    transform: [{ scale: 1.02 }],
  },
  flagContainer: {
    marginRight: 10,
  },
  flag: {
    fontSize: 30,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkContainer: {
    marginRight: 10,
  },
  arrowContainer: {
    marginLeft: 5,
  },
  bottomContainer: {
    marginBottom: 30,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#4caf50',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  skipButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
  noteText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});