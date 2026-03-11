import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ListRenderItem,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Import from your navigator

type StopsScreenProps = NativeStackScreenProps<RootStackParamList, 'stops'>; // 'stops' matches the name in your navigator

interface Stop {
  id: string;
  name: string;
  routes: string[];
}

// Updated with Surat BRTS stops (you can replace with your actual data)
const STOPS: Stop[] = [
  { id: '1', name: 'Majura Gate', routes: ['1', '2', '5'] },
  { id: '2', name: 'Delhi Gate', routes: ['1', '3', '4'] },
  { id: '3', name: 'Railway Station', routes: ['1', '2', '6'] },
  { id: '4', name: 'Udhna', routes: ['2', '5'] },
  { id: '5', name: 'Katargam', routes: ['3', '6'] },
  { id: '6', name: 'Adajan', routes: ['3', '4'] },
  { id: '7', name: 'Pal', routes: ['4', '6'] },
  { id: '8', name: 'Dumas', routes: ['5'] },
  { id: '9', name: 'Varachha', routes: ['1', '3'] },
  { id: '10', name: 'Sarthana', routes: ['2', '4'] },
];

export default function StopsScreen({ navigation }: StopsScreenProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Memoized filtered stops for better performance
  const filteredStops = useMemo(() => {
    if (!searchQuery.trim()) {
      return STOPS;
    }
    return STOPS.filter(stop =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id],
    );
  }, []);

  const showStopDetails = useCallback(
    (item: Stop) => {
      Alert.alert(item.name, `Available Buses: ${item.routes.join(', ')}`, [
        {
          text: 'View on Map',
          onPress: () => navigation.navigate('Surat Map'), // This matches your screen name
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]);
    },
    [navigation],
  );

  const renderStopItem: ListRenderItem<Stop> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.stopCard}
        onPress={() => showStopDetails(item)}
        activeOpacity={0.7}
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

        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name={favorites.includes(item.id) ? 'star' : 'star-outline'}
            size={24}
            color="#fbc02d"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [favorites, showStopDetails, toggleFavorite],
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
          placeholderTextColor="#999"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={clearSearch}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.resultsText}>
        {filteredStops.length} {filteredStops.length === 1 ? 'stop' : 'stops'}{' '}
        found
      </Text>

      <FlatList
        data={filteredStops}
        renderItem={renderStopItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    marginBottom: 4,
  },
  stopRoutes: {
    fontSize: 13,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
});
