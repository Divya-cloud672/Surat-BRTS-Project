
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// ---- Types ----
type LanguageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Language'
>;

type LanguageScreenProps = {
  navigation: LanguageScreenNavigationProp;
};

interface Language {
  code: string;
  name: string;
  native: string;
  icon: string;
  flag: string;
}

// ---- Component ----
const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const languages: Language[] = [
    { code: 'en', name: 'English', native: 'English', icon: 'alphabet-latin', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', icon: 'alpha-h', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', icon: 'alpha-g', flag: '🇮🇳' },
  ];

  useEffect(() => {
    checkPreviousLanguage();
  }, []);

  const checkPreviousLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage) {
        setSelectedLang(savedLanguage);
      }
    } catch (error) {
      console.log('Error checking saved language:', error);
    }
  };

  const handleLanguageSelect = async (lang: Language) => {
    setSelectedLang(lang.code);
    try {
      setLoading(true);
      await AsyncStorage.setItem('userLanguage', lang.code);
      await AsyncStorage.setItem('languageName', lang.name);

      setTimeout(() => {
        setLoading(false);
        navigation.replace('Home');
      }, 500);
    } catch (error) {
      console.log('Save error:', error);
      Alert.alert(
        'Error',
        'Failed to save language preference. Please try again.',
        [{ text: 'OK' }]
      );
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedLang) {
      const selectedLanguage = languages.find(lang => lang.code === selectedLang);
      if (selectedLanguage) handleLanguageSelect(selectedLanguage);
    } else {
      Alert.alert(
        'No Language Selected',
        'Please select a language to continue',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bus4.jpg')}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(21, 101, 192, 0.97)" />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="translate" size={50} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Choose Language</Text>
          <Text style={styles.headerSubtitle}>Select your preferred language</Text>
        </View>

        <View style={styles.languageContainer}>
          {languages.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                selectedLang === lang.code && styles.selectedCard,
              ]}
              onPress={() => setSelectedLang(lang.code)}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.languageName}>{lang.name}</Text>
                <Text style={styles.nativeName}>{lang.native}</Text>
              </View>
              {selectedLang === lang.code && (
                <View style={styles.checkIconContainer}>
                  <Icon name="check-circle" size={24} color="#4caf50" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedLang || loading) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={loading || !selectedLang}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#1565C0" />
          ) : (
            <Text style={styles.continueButtonText}>Continue to Home</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loaderText}>Setting up your language...</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default LanguageScreen;

// ---- Styles remain the same ----
const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(21, 101, 192, 0.97)', padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)' },
  languageContainer: { flex: 1, marginBottom: 20 },
  languageCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#4caf50',
    backgroundColor: '#f0fff0',
    transform: [{ scale: 1.02 }],
  },
  flag: { fontSize: 30, marginRight: 15 },
  textContainer: { flex: 1 },
  languageName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  nativeName: { fontSize: 14, color: '#666', marginTop: 2 },
  checkIconContainer: { marginLeft: 10 },
  continueButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueButtonDisabled: { backgroundColor: 'rgba(255, 255, 255, 0.5)', elevation: 0 },
  continueButtonText: { color: '#1565C0', fontSize: 18, fontWeight: 'bold' },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: { color: '#fff', marginTop: 10, fontSize: 16 },
});