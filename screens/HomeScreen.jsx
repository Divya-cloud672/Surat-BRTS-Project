import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
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
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="bus" size={28} color="#fff" />
        <Text style={styles.headerText}>BRTSConnect Surat</Text>
      </View>
      <ImageBackground
        source={require('../assets/images/bus4.jpg')}
        style={styles.topSection}
      >
        <View style={styles.overlay} />
        <View style={styles.topContent}>
          <Text style={styles.time}>{currentTime}</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
      </ImageBackground>

      <View style={styles.searchBox}>
        <Icon name="magnify" size={22} color="#666" />
        <TextInput
          placeholder="Search bus route number"
          style={styles.input}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#8e44ad' }]}
          onPress={() => navigation.navigate('plantrip')}
        >
          <Icon name="map-marker-path" size={32} color="#fff" />
          <Text style={styles.cardText}>Planner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#27ae60' }]}
          onPress={() => navigation.navigate('mticket')}
        >
          <Icon name="ticket-confirmation" size={32} color="#fff" />
          <Text style={styles.cardText}>M Ticket</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#2980b9' }]}
          onPress={() => navigation.navigate('stops')}
        >
          <Icon name="map-marker" size={32} color="#fff" />
          <Text style={styles.cardText}>Stops</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#e67e22' }]}
          onPress={() => navigation.navigate('My Tickets')}
        >
          <Icon name="account-ticket" size={32} color="#fff" />
          <Text style={styles.cardText}>My Tickets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#e74c3c' }]}
          onPress={() => navigation.navigate('Fare-Chart')}
        >
          <Icon name="star" size={32} color="#fff" />
          <Text style={styles.cardText}>Fare Chart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#34495e' }]}
          onPress={() => navigation.navigate('Surat Map')}
        >
          <Icon name="map" size={32} color="#fff" />
          <Text style={styles.cardText}>Surat Map</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddddddd2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1565c0',
    padding: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 7,
    fontWeight: 'bold',
  },
  topSection: {
    paddingVertical: 30,
    alignItems: 'center',
    height: 200,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  topContent: {
    marginLeft: 150,
  },
  time: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 3,
    alignItems: 'center',
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  cardText: {
    marginTop: 8,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
