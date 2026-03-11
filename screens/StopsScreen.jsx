// screens/StopsScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const STOPS = [
  { id: '1', name: 'City Center', routes: ['101', '202', '305'] },
  { id: '2', name: 'North Station', routes: ['101', '405'] },
  { id: '3', name: 'South Mall', routes: ['202', '305'] },
  { id: '4', name: 'East End', routes: ['202'] },
  { id: '5', name: 'Westside', routes: ['305'] },
  { id: '6', name: 'Downtown', routes: ['305', '405'] },
  { id: '7', name: 'Airport', routes: ['405'] },
  { id: '8', name: 'Railway Station', routes: ['405'] },
  { id: '9', name: 'Main Street', routes: ['101'] },
];

export default function StopsScreen({ navigation }) {

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStops, setFilteredStops] = useState(STOPS);
  const [favorites, setFavorites] = useState([]);

  const handleSearch = (text) => {
    setSearchQuery(text);

    const filtered = STOPS.filter(stop =>
      stop.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredStops(filtered);
  };

  const toggleFavorite = (id) => {

    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }

  };

  const showStopDetails = (item) => {

    Alert.alert(
      item.name,
      `Available Buses: ${item.routes.join(', ')}`,
      [
        {
          text: "View on Map",
          onPress: () => navigation.navigate("Surat Map")
        },
        {
          text: "Close",
          style: "cancel"
        }
      ]
    );

  };

  const renderStopItem = ({ item }) => (

    <TouchableOpacity
      style={styles.stopCard}
      onPress={() => showStopDetails(item)}
    >

      <View style={styles.stopIcon}>
        <Icon name="bus-stop" size={24} color="#1565c0" />
      </View>

      <View style={styles.stopInfo}>
        <Text style={styles.stopName}>{item.name}</Text>
        <Text style={styles.stopRoutes}>
          Routes: {item.routes.join(' • ')}
        </Text>
      </View>

      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <Icon
          name={favorites.includes(item.id) ? "star" : "star-outline"}
          size={24}
          color="#fbc02d"
        />
      </TouchableOpacity>

    </TouchableOpacity>

  );

  return (

    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search bus stops..."
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}

      </View>

      <Text style={styles.resultsText}>
        {filteredStops.length} stops found
      </Text>

      <FlatList
        data={filteredStops}
        renderItem={renderStopItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  resultsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    marginLeft: 5,
  },

  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

  stopIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  stopInfo: {
    flex: 1,
  },

  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  stopRoutes: {
    fontSize: 13,
    color: '#666',
  },

});