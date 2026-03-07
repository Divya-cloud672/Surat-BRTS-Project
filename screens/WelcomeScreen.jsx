// screens/WelcomeScreen.js
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

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/bus4.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Icon name="bus" size={100} color="#fff" />
          </View>
          
          <Text style={styles.title}>BRTSConnect</Text>
          <Text style={styles.subtitle}>Surat</Text>
          
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>Smart Travel • Safe Journey</Text>
            <Text style={styles.taglineHindi}>स्मार्ट यात्रा • सुरक्षित सफर</Text>
            <Text style={styles.taglineGujarati}>સ્માર્ટ મુસાફરી • સલામત સફર</Text>
          </View>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.replace('Language')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Icon name="arrow-right" size={24} color="#1565c0" />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by Surat BRTS</Text>
            <Text style={styles.footerText}>© 2024 All Rights Reserved</Text>
          </View>
        </Animated.View>
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
    backgroundColor: 'rgba(21, 101, 192, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 28,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
    fontWeight: '600',
  },
  taglineContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 2,
    opacity: 0.9,
    fontWeight: '500',
  },
  taglineHindi: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 2,
    opacity: 0.8,
  },
  taglineGujarati: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 2,
    opacity: 0.8,
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 40,
    marginTop: 50,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#1565c0',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  footer: {
    position: 'absolute',
    bottom: -150,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    marginVertical: 2,
  },
});