
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width >= 768;


const responsiveFontSize = (size: number) => {
  if (isLargeDevice) return size * 1.1;
  if (isSmallDevice) return size * 0.85;
  return size;
};
const responsiveWidth = (percentage: number) => (width * percentage) / 100;
const responsiveHeight = (percentage: number) => (height * percentage) / 100;


const cardWidth = (width - responsiveWidth(8) - responsiveWidth(2.5)) / 2;


interface MenuItem {
  id: number;
  title: string;
  icon: string;
  color: string;
  screen: keyof RootStackParamList;
}


type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const language = await AsyncStorage.getItem('languageName');
      if (language) setSelectedLanguage(language);
    } catch (error) {
      console.log('Error getting user data:', error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Plan Trip',
      icon: 'map-marker-path',
      color: '#8e44ad',
      screen: 'plantrip',
    },
    {
      id: 2,
      title: 'M-Ticket',
      icon: 'ticket-confirmation',
      color: '#27ae60',
      screen: 'mticket',
    },
    {
      id: 3,
      title: 'Bus Stops',
      icon: 'map-marker',
      color: '#2980b9',
      screen: 'stops',
    },
  
    {
      id: 4,
      title: 'Fare Chart',
      icon: 'star',
      color: '#e74c3c',
      screen: 'Fare-Chart',
    },
    {
      id: 5,
      title: 'Route Map',
      icon: 'map',
      color: '#34495e',
      screen: 'Surat Map',
    },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userLanguage');
            await AsyncStorage.removeItem('languageName');
            navigation.replace('Welcome');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1565c0" barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
       
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="bus" size={responsiveFontSize(28)} color="#fff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerMainText}>BRTSConnect</Text>
              <Text style={styles.headerSubText}>Surat • Smart City</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {selectedLanguage ? (
              <View style={styles.languageBadge}>
                <Text style={styles.languageBadgeText}>{selectedLanguage}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <Icon name="logout" size={responsiveFontSize(22)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

      
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome to BRTSConnect</Text>
          <Text style={styles.welcomeSubText}>
            Select a service to continue
          </Text>
        </View>

      
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: item.color },
                index % 2 !== 0 && styles.cardMarginLeft,
              ]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Icon
                    name={item.icon}
                    size={responsiveFontSize(28)}
                    color="#fff"
                  />
                </View>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        
        <View style={styles.noteContainer}>
          <Icon name="information-outline" size={16} color="#666" />
          <Text style={styles.noteText}>Tap any service to get started</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565c0',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(4),
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight! + 5
        : responsiveHeight(1.5),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerTextContainer: { marginLeft: responsiveWidth(2) },
  headerMainText: {
    color: '#fff',
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubText: {
    color: '#fff',
    fontSize: responsiveFontSize(10),
    opacity: 0.9,
    marginTop: 2,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  languageBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.3),
    borderRadius: 12,
    marginRight: responsiveWidth(1.5),
  },
  languageBadgeText: { color: '#fff', fontSize: responsiveFontSize(10) },
  profileButton: { padding: responsiveWidth(1) },
  welcomeContainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
  },
  welcomeText: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: responsiveHeight(0.3),
  },
  welcomeSubText: { fontSize: responsiveFontSize(12), color: '#666' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: responsiveWidth(4),
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.0,
    borderRadius: 15,
    marginBottom: responsiveHeight(1.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardMarginLeft: { marginLeft: responsiveWidth(2.5) },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(2),
  },
  iconContainer: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    maxWidth: 50,
    maxHeight: 50,
    borderRadius: responsiveWidth(6),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  cardText: {
    color: '#fff',
    fontSize: responsiveFontSize(13),
    fontWeight: '600',
    textAlign: 'center',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    marginTop: responsiveHeight(0.5),
  },
  noteText: { fontSize: responsiveFontSize(11), color: '#666', marginLeft: 4 },
  bottomPadding: { height: responsiveHeight(1) },
});
