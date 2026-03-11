import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

// Interfaces for dataset
interface Stop {
  id: number;
  name: string;
}

interface Route {
  id: number;
  name: string;
}

interface RouteStop {
  route_id: number;
  stops: number[];
}

// Props for bus item
interface BusItem {
  id: number;
  busNumber: number;
  route: string;
  stops: string[];
  fare: number;
  duration: string;
  frequency: string;
}

// ============== MOCK DATA (Replace with actual imports later) ==============
const stopsData: Stop[] = [
  { id: 1, name: 'Majura Gate' },
  { id: 2, name: 'Delhi Gate' },
  { id: 3, name: 'Railway Station' },
  { id: 4, name: 'Udhna' },
  { id: 5, name: 'Katargam' },
  { id: 6, name: 'Adajan' },
  { id: 7, name: 'Pal' },
  { id: 8, name: 'Dumas' },
  { id: 9, name: 'Varachha' },
  { id: 10, name: 'Sarthana' },
];

const routesData: Route[] = [
  { id: 101, name: 'Route 1: Majura Gate - Udhna' },
  { id: 102, name: 'Route 2: Railway Station - Adajan' },
  { id: 103, name: 'Route 3: Katargam - Varachha' },
  { id: 104, name: 'Route 4: Pal - Dumas' },
];

const routeStopsData: RouteStop[] = [
  { route_id: 101, stops: [1, 2, 3, 4] }, // Majura Gate → Delhi Gate → Railway Station → Udhna
  { route_id: 102, stops: [3, 6, 7] }, // Railway Station → Adajan → Pal
  { route_id: 103, stops: [5, 2, 9] }, // Katargam → Delhi Gate → Varachha
  { route_id: 104, stops: [7, 8] }, // Pal → Dumas
];
// ============================================================================

const PlannerScreen: React.FC = () => {
  const [startStop, setStartStop] = useState<string>('');
  const [endStop, setEndStop] = useState<string>('');
  const [availableBuses, setAvailableBuses] = useState<BusItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showStartSuggestions, setShowStartSuggestions] =
    useState<boolean>(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState<boolean>(false);
  const [filteredStartStops, setFilteredStartStops] = useState<string[]>([]);
  const [filteredEndStops, setFilteredEndStops] = useState<string[]>([]);

  // Use the mock data instead of declare
  const ALL_STOPS: string[] = stopsData.map(s => s.name);

  const filterSuggestions = (text: string, type: 'start' | 'end') => {
    const filtered = ALL_STOPS.filter(stop =>
      stop.toLowerCase().includes(text.toLowerCase()),
    );
    if (type === 'start') {
      setFilteredStartStops(filtered);
      setShowStartSuggestions(true);
    } else {
      setFilteredEndStops(filtered);
      setShowEndSuggestions(true);
    }
  };

  const selectSuggestion = (stop: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartStop(stop);
      setShowStartSuggestions(false);
    } else {
      setEndStop(stop);
      setShowEndSuggestions(false);
    }
  };

  const searchBuses = () => {
    if (!startStop.trim() || !endStop.trim()) {
      Alert.alert('Error', 'Please enter both start and end stops');
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      const start = stopsData.find(
        s => s.name.toLowerCase() === startStop.toLowerCase(),
      );
      const end = stopsData.find(
        s => s.name.toLowerCase() === endStop.toLowerCase(),
      );

      if (!start || !end) {
        setIsSearching(false);
        Alert.alert(
          'Stop Not Found',
          'One of the stops does not exist in dataset',
        );
        return;
      }

      const resultRoutes = routeStopsData.filter(route => {
        const startIndex = route.stops.indexOf(start.id);
        const endIndex = route.stops.indexOf(end.id);
        return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
      });

      const buses: BusItem[] = resultRoutes.map(route => {
        const routeInfo = routesData.find(r => r.id === route.route_id);
        return {
          id: route.route_id,
          busNumber: route.route_id,
          route: routeInfo?.name || 'Unknown Route',
          stops: route.stops.map(
            id => stopsData.find(s => s.id === id)?.name || '',
          ),
          fare: 20,
          duration: '25 mins',
          frequency: 'Every 15 mins',
        };
      });

      setAvailableBuses(buses);
      setIsSearching(false);

      if (buses.length === 0) {
        Alert.alert(
          'No Buses Found',
          'No direct buses available for this route',
        );
      }
    }, 800);
  };

  const showBusDetails = (bus: BusItem) => {
    const startIndex = bus.stops.findIndex(
      s => s.toLowerCase() === startStop.toLowerCase(),
    );
    const endIndex = bus.stops.findIndex(
      s => s.toLowerCase() === endStop.toLowerCase(),
    );

    if (startIndex !== -1 && endIndex !== -1) {
      const stopsBetween = bus.stops.slice(startIndex, endIndex + 1);
      Alert.alert(
        `Bus ${bus.busNumber} Details`,
        `Route: ${bus.route}\n\n` +
          `Your Journey: ${startStop} → ${endStop}\n` +
          `Stops: ${stopsBetween.join(' → ')}\n\n` +
          `Fare: ₹${bus.fare}\n` +
          `Duration: ${bus.duration}\n` +
          `Frequency: ${bus.frequency}`,
      );
    }
  };

  const renderBusItem = ({ item }: { item: BusItem }) => (
    <TouchableOpacity
      style={styles.busCard}
      onPress={() => showBusDetails(item)}
    >
      <View style={styles.busHeader}>
        <Text style={styles.busNumber}>Bus {item.busNumber}</Text>
        <View style={styles.busBadge}>
          <Text style={styles.busBadgeText}>{item.frequency}</Text>
        </View>
      </View>

      <Text style={styles.routeText}>{item.route}</Text>

      <View style={styles.stopsContainer}>
        <Text style={styles.stopsLabel}>Route Stops:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stopsList}>
            {item.stops.map((stop, index) => (
              <View key={index} style={styles.stopItem}>
                <Text style={styles.stopText}>{stop}</Text>
                {index < item.stops.length - 1 && (
                  <Text style={styles.arrow}> → </Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.busFooter}>
        <Text style={styles.fareText}>Fare: ₹{item.fare}</Text>
        <Text style={styles.durationText}>Duration: {item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Route Planner</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Start Stop"
          placeholderTextColor="#999"
          value={startStop}
          onChangeText={text => {
            setStartStop(text);
            filterSuggestions(text, 'start');
          }}
          onFocus={() => setShowStartSuggestions(true)}
          style={styles.input}
        />
        {showStartSuggestions && filteredStartStops.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView nestedScrollEnabled style={styles.suggestionsList}>
              {filteredStartStops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(stop, 'start')}
                >
                  <Text style={styles.suggestionText}>{stop}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter End Stop"
          placeholderTextColor="#999"
          value={endStop}
          onChangeText={text => {
            setEndStop(text);
            filterSuggestions(text, 'end');
          }}
          onFocus={() => setShowEndSuggestions(true)}
          style={styles.input}
        />
        {showEndSuggestions && filteredEndStops.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView nestedScrollEnabled style={styles.suggestionsList}>
              {filteredEndStops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(stop, 'end')}
                >
                  <Text style={styles.suggestionText}>{stop}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.searchButton,
          (!startStop || !endStop) && styles.searchButtonDisabled,
        ]}
        onPress={searchBuses}
        disabled={!startStop || !endStop || isSearching}
      >
        {isSearching ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.searchButtonText}>Search Buses</Text>
        )}
      </TouchableOpacity>

      {availableBuses.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            Available Buses ({availableBuses.length})
          </Text>
          <FlatList
            data={availableBuses}
            renderItem={renderBusItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: { marginBottom: 15, position: 'relative', zIndex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: { maxHeight: 200 },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: { fontSize: 14, color: '#333' },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  searchButtonDisabled: { backgroundColor: '#ccc' },
  searchButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultsContainer: { flex: 1 },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  listContent: { paddingBottom: 20 },
  busCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  busNumber: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  busBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  busBadgeText: { color: '#007AFF', fontSize: 12, fontWeight: '600' },
  routeText: { fontSize: 16, color: '#333', marginBottom: 10 },
  stopsContainer: { marginBottom: 10 },
  stopsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  stopsList: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  stopItem: { flexDirection: 'row', alignItems: 'center' },
  stopText: { fontSize: 14, color: '#555' },
  arrow: { fontSize: 14, color: '#999', marginHorizontal: 5 },
  busFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  fareText: { fontSize: 14, fontWeight: '600', color: '#28a745' },
  durationText: { fontSize: 14, color: '#666' },
});

export default PlannerScreen;
