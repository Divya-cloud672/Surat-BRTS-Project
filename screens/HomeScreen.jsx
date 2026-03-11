// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = width >= 768;

// Responsive sizing functions
const responsiveFontSize = (size) => {
  if (isLargeDevice) return size * 1.2;
  if (isSmallDevice) return size * 0.9;
  return size;
};

const responsiveWidth = (percentage) => {
  return (width * percentage) / 100;
};

const responsiveHeight = (percentage) => {
  return (height * percentage) / 100;
};

const cardWidth = isLargeDevice 
  ? responsiveWidth(28) // 28% for tablets
  : responsiveWidth(44); // 44% for phones

// Helper function for greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 20) return 'Evening';
  return 'Night';
};

export default function HomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    updateTime();
    getUserData();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`;

    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);

    setCurrentTime(formattedTime);
    setCurrentDate(formattedDate);
  };

  const getUserData = async () => {
    try {
      const language = await AsyncStorage.getItem('languageName');
      if (language) {
        setSelectedLanguage(language);
      }
      // You can also get user name if you have it stored
      // const name = await AsyncStorage.getItem('userName');
      // setUserName(name || '');
    } catch (error) {
      console.log('Error getting user data:', error);
    }
  };

  const menuItems = [
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
      title: 'My Tickets',
      icon: 'account-ticket',
      color: '#e67e22',
      screen: 'My Tickets',
    },
    {
      id: 5,
      title: 'Fare Chart',
      icon: 'star',
      color: '#e74c3c',
      screen: 'Fare-Chart',
    },
    {
      id: 6,
      title: 'Route Map',
      icon: 'map',
      color: '#34495e',
      screen: 'Surat Map',
    },
  ];

  const handleSearch = (text) => {
    setSearchText(text);
    // Implement search functionality here
    if (text.length > 2) {
      // You can add search logic here
      console.log('Searching for:', text);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userLanguage');
              await AsyncStorage.removeItem('languageName');
              navigation.replace('Welcome');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#1565c0" 
        barStyle="light-content" 
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon 
              name="bus" 
              size={responsiveFontSize(32)} 
              color="#fff" 
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerMainText}>BRTSConnect</Text>
              <Text style={styles.headerSubText}>Surat • Smart City</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {selectedLanguage ? (
              <Text style={styles.languageBadge}>{selectedLanguage}</Text>
            ) : null}
            <TouchableOpacity 
              style={styles.profileButton}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <Icon 
                name="logout" 
                size={responsiveFontSize(24)} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Hero Section */}
        <ImageBackground
          source={require('../assets/images/bus4.jpg')}
          style={styles.heroSection}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.greeting}>Good {getGreeting()}{userName ? `, ${userName}` : ''}</Text>
            <Text style={styles.time}>{currentTime}</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
        </ImageBackground>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Icon name="magnify" size={responsiveFontSize(22)} color="#666" />
            <TextInput
              placeholder="Search bus route or stop..."
              style={styles.input}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={handleSearch}
            />
            {searchText.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchText('')}
              >
                <Icon name="close-circle" size={responsiveFontSize(20)} color="#999" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.filterButton}
              activeOpacity={0.7}
            >
              <Icon name="tune" size={responsiveFontSize(22)} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Active Routes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>120+</Text>
            <Text style={styles.statLabel}>Daily Buses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50</Text>
            <Text style={styles.statLabel}>Bus Stops</Text>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Icon 
                    name={item.icon} 
                    size={responsiveFontSize(32)} 
                    color="#fff" 
                  />
                </View>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565c0',
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : responsiveHeight(2),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: responsiveWidth(3),
  },
  headerMainText: {
    color: '#fff',
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubText: {
    color: '#fff',
    fontSize: responsiveFontSize(12),
    opacity: 0.9,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageBadge: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 15,
    fontSize: responsiveFontSize(12),
    marginRight: responsiveWidth(2),
    overflow: 'hidden',
  },
  profileButton: {
    padding: responsiveWidth(1.5),
  },
  heroSection: {
    height: responsiveHeight(25),
    width: '100%',
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    padding: responsiveWidth(6),
  },
  greeting: {
    fontSize: responsiveFontSize(16),
    color: '#fff',
    marginBottom: responsiveHeight(0.7),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  time: {
    fontSize: responsiveFontSize(38),
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  date: {
    fontSize: responsiveFontSize(16),
    color: '#fff',
    marginTop: responsiveHeight(0.5),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  searchContainer: {
    paddingHorizontal: responsiveWidth(5),
    marginTop: -responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(1),
    elevation: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  input: {
    marginLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(16),
    flex: 1,
    color: '#333',
    paddingVertical: responsiveHeight(1.2),
  },
  clearButton: {
    padding: responsiveWidth(1),
    marginRight: responsiveWidth(1),
  },
  filterButton: {
    padding: responsiveWidth(2),
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: responsiveWidth(5),
    borderRadius: 15,
    paddingVertical: responsiveHeight(2),
    marginBottom: responsiveHeight(2.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: responsiveFontSize(22),
    fontWeight: 'bold',
    color: '#1565c0',
  },
  statLabel: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    marginTop: responsiveHeight(0.5),
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: responsiveFontSize(14),
    color: '#1565c0',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: responsiveWidth(5),
    justifyContent: isLargeDevice ? 'flex-start' : 'space-between',
    gap: isLargeDevice ? responsiveWidth(3) : 0,
  },
  card: {
    width: cardWidth,
    height: cardWidth * (isLargeDevice ? 0.8 : 0.9),
    borderRadius: 20,
    marginBottom: responsiveHeight(2.5),
    marginRight: isLargeDevice ? responsiveWidth(2) : 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(3.5),
  },
  iconContainer: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    maxWidth: 60,
    maxHeight: 60,
    borderRadius: responsiveWidth(7.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(1.5),
  },
  cardText: {
    color: '#fff',
    fontSize: responsiveFontSize(isLargeDevice ? 16 : 15),
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomPadding: {
    height: responsiveHeight(2.5),
  },
});