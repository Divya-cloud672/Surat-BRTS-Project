import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

// Responsive sizing function
const responsive = (size: number) => {
  const standardWidth = 375;
  return (width / standardWidth) * size;
};

interface MenuItem {
  id: number;
  title: string;
  icon: string;
  color: string;
  screen: keyof RootStackParamList;
}

interface QuickAction {
  id: number;
  title: string;
  icon: string;
  color: string;
  badge?: number;
  onPress: () => void;
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
  const [userName] = useState<string>('Guest');
  const [notifications] = useState<number>(3);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBackgroundColor('#1565c0');
    StatusBar.setBarStyle('light-content');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

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

  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: 'Notifications',
      icon: 'bell',
      color: '#ff9800',
      badge: notifications,
      onPress: () => {
        Alert.alert('Notifications', `You have ${notifications} new notifications`);
      },
    },
    {
      id: 2,
      title: 'Station Alert',
      icon: 'alert-circle',
      color: '#f44336',
      onPress: () => {
        Alert.alert('Station Alert', 'Set alerts for your favorite stations');
      },
    },
    {
      id: 3,
      title: 'Recharge',
      icon: 'wallet',
      color: '#1565c0',
      onPress: () => {
        Alert.alert('Recharge', 'Coming soon!');
      },
    },
    {
      id: 4,
      title: 'History',
      icon: 'history',
      color: '#9c27b0',
      onPress: () => {
        Alert.alert('History', 'View your travel history');
      },
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
            await AsyncStorage.removeItem('onboardingCompleted');
            navigation.replace('Welcome');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  const handleCardPress = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  const headerPaddingTop =
    Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 5 : responsive(15);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar backgroundColor="#1565c0" barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
        <View style={styles.headerLeft}>
          <Icon name="bus" size={responsive(24)} color="#fff" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerMainText}>BRTSConnect</Text>
            <Text style={styles.headerSubText}>Surat</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {selectedLanguage && (
            <View style={styles.languageBadge}>
              <Text style={styles.languageBadgeText}>{selectedLanguage}</Text>
            </View>
          )}

          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => Alert.alert('Notifications', `You have ${notifications} new notifications`)}
          >
            <Icon name="bell" size={responsive(22)} color="#fff" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Icon name="logout" size={responsive(22)} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.greetingText}>Hello, {userName}!</Text>
          <Text style={styles.welcomeText}>What would you like to do today?</Text>
        </View>

        {/* Main Menu - Horizontal Scroll */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.horizontalCard, { backgroundColor: item.color }]}
                onPress={() => handleCardPress(item.screen)}
              >
                <Icon name={item.icon} size={responsive(28)} color="#fff" />
                <Text style={styles.horizontalCardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color + '15' }]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} size={responsive(22)} color="#fff" />
                  {action.badge && action.badge > 0 && (
                    <View style={styles.actionBadge}>
                      <Text style={styles.actionBadgeText}>{action.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Station Alert Banner */}
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => Alert.alert('Station Alert', 'Get alerts for your favorite stations')}
        >
          <View style={styles.alertBannerContent}>
            <Icon name="bell-ring" size={responsive(24)} color="#fff" />
            <View style={styles.alertBannerText}>
              <Text style={styles.alertBannerTitle}>Station Alerts</Text>
              <Text style={styles.alertBannerSubtitle}>Never miss your stop</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={responsive(24)} color="#fff" />
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565c0',
    paddingHorizontal: responsive(16),
    paddingBottom: responsive(12),
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: responsive(10),
  },
  headerMainText: {
    color: '#fff',
    fontSize: responsive(18),
    fontWeight: 'bold',
  },
  headerSubText: {
    color: '#fff',
    fontSize: responsive(12),
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: responsive(8),
    paddingVertical: responsive(4),
    borderRadius: 12,
    marginRight: responsive(8),
  },
  languageBadgeText: {
    color: '#fff',
    fontSize: responsive(11),
  },
  notificationButton: {
    padding: responsive(5),
    marginRight: responsive(5),
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f44336',
    borderRadius: 9,
    minWidth: responsive(18),
    height: responsive(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: responsive(10),
    fontWeight: 'bold',
  },
  iconButton: {
    padding: responsive(5),
  },
  welcomeContainer: {
    padding: responsive(16),
  },
  greetingText: {
    fontSize: responsive(22),
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: responsive(4),
  },
  welcomeText: {
    fontSize: responsive(16),
    color: '#666',
  },
  sectionContainer: {
    marginBottom: responsive(20),
  },
  sectionTitle: {
    fontSize: responsive(18),
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: responsive(16),
    marginBottom: responsive(12),
  },
  horizontalScrollContent: {
    paddingHorizontal: responsive(16),
  },
  horizontalCard: {
    width: responsive(100),
    height: responsive(100),
    borderRadius: 12,
    marginRight: responsive(12),
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsive(10),
    elevation: 3,
  },
  horizontalCardText: {
    color: '#fff',
    fontSize: responsive(12),
    fontWeight: '600',
    marginTop: responsive(8),
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: responsive(16),
  },
  quickActionCard: {
    width: (width - responsive(48)) / 2,
    marginRight: responsive(16),
    marginBottom: responsive(12),
    padding: responsive(16),
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  quickActionIcon: {
    width: responsive(48),
    height: responsive(48),
    borderRadius: responsive(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive(8),
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f44336',
    borderRadius: 9,
    minWidth: responsive(18),
    height: responsive(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  actionBadgeText: {
    color: '#fff',
    fontSize: responsive(10),
    fontWeight: 'bold',
  },
  quickActionText: {
    fontSize: responsive(13),
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  alertBanner: {
    backgroundColor: '#ff9800',
    marginHorizontal: responsive(16),
    marginVertical: responsive(10),
    padding: responsive(16),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  alertBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertBannerText: {
    marginLeft: responsive(12),
  },
  alertBannerTitle: {
    color: '#fff',
    fontSize: responsive(16),
    fontWeight: 'bold',
  },
  alertBannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: responsive(12),
    marginTop: responsive(2),
  },
  bottomPadding: {
    height: responsive(20),
  },
});

export default HomeScreen;