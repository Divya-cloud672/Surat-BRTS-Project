// screens/WelcomeScreen.jsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

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
  }, [fadeAnim, slideAnim, scaleAnim]);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Language');
    });
  };

  return (
    <ImageBackground
      source={require('../assets/images/bus4.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
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
            <Icon 
              name="bus" 
              size={isTablet ? 120 : isSmallDevice ? 70 : 100} 
              color="#fff" 
            />
          </View>
          
          <Text style={styles.title}>BRTSConnect</Text>
          <Text style={styles.subtitle}>Surat</Text>
          
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>Smart Travel • Safe Journey</Text>
            <Text style={styles.taglineHindi}>स्मार्ट यात्रा • सुरक्षित सफर</Text>
            <Text style={styles.taglineGujarati}>સ્માર્ટ મુસાફરી • સલામત સફર</Text>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleButtonPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Icon 
                name="arrow-right" 
                size={isTablet ? 28 : 24} 
                color="#1565c0" 
              />
            </TouchableOpacity>
          </Animated.View>

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
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 101, 192, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    width: '100%',
    maxWidth: 600,
  },
  iconContainer: {
    width: width * 0.4,
    height: width * 0.4,
    maxWidth: 180,
    maxHeight: 180,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.03,
    borderWidth: Platform.OS === 'ios' ? 3 : 2,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: Math.min(width * 0.12, 48),
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
        fontWeight: '700',
      },
      android: {
        fontFamily: 'sans-serif-bold',
      },
    }),
  },
  subtitle: {
    fontSize: Math.min(width * 0.07, 28),
    color: '#fff',
    marginTop: height * 0.005,
    opacity: 0.9,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  taglineContainer: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  tagline: {
    fontSize: Math.min(width * 0.045, 18),
    color: '#fff',
    marginVertical: height * 0.003,
    opacity: 0.9,
    fontWeight: '500',
    textAlign: 'center',
  },
  taglineHindi: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#fff',
    marginVertical: height * 0.002,
    opacity: 0.8,
    textAlign: 'center',
  },
  taglineGujarati: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#fff',
    marginVertical: height * 0.002,
    opacity: 0.8,
    textAlign: 'center',
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.1,
    paddingVertical: height * 0.02,
    minWidth: width * 0.5,
    maxWidth: 400,
    borderRadius: 50,
    marginTop: height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  buttonText: {
    color: '#1565c0',
    fontSize: Math.min(width * 0.05, 20),
    fontWeight: 'bold',
    marginRight: width * 0.02,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: -height * 0.25,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  footerText: {
    color: '#fff',
    fontSize: Math.min(width * 0.035, 14),
    opacity: 0.7,
    marginVertical: height * 0.002,
    textAlign: 'center',
  },
});