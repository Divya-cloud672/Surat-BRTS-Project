// screens/StopsScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import stops from '../data/stops';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
const responsiveFontSize = (size) => {
  const scale = width / 375; // 375 is base width (iPhone SE)
  return Math.round(size * Math.min(scale, 1.5));
};

const responsiveWidth = (percentage) => (width * percentage) / 100;
const responsiveHeight = (percentage) => (height * percentage) / 100;

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function StopsScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [sortBy, setSortBy] = useState('distance'); // 'distance' or 'name'

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getCurrentLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to find nearby bus stops.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setLocationError('Location permission denied');
          setLoading(false);
        }
      } catch (err) {
        setLocationError('Error requesting permission');
        setLoading(false);
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        findNearbyStops(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        setLocationError(error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const findNearbyStops = (userLat, userLon) => {
    // Add coordinates to stops data (you'll need to add actual coordinates to your stops data)
    const stopsWithDistance = stops.map(stop => ({
      ...stop,
      distance: calculateDistance(
        userLat, 
        userLon, 
        stop.latitude || 21.1702, // Default to Surat coordinates if not available
        stop.longitude || 72.8311
      ).toFixed(2),
      duration: Math.round(calculateDistance(userLat, userLon, stop.latitude || 21.1702, stop.longitude || 72.8311) * 12) // Approx travel time in minutes
    }));

    // Sort by distance
    const sortedStops = stopsWithDistance.sort((a, b) => 
      parseFloat(a.distance) - parseFloat(b.distance)
    );
    
    setNearbyStops(sortedStops);
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (userLocation) {
      findNearbyStops(userLocation.latitude, userLocation.longitude);
    } else {
      requestLocationPermission();
    }
    setRefreshing(false);
  };

  const sortStops = (criteria) => {
    setSortBy(criteria);
    let sorted = [...nearbyStops];
    if (criteria === 'distance') {
      sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (criteria === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    setNearbyStops(sorted);
  };

  const handleStopPress = (stop) => {
    setSelectedStop(stop);
    // Animate to stop location on map
    if (stop.latitude && stop.longitude) {
      setMapRegion({
        latitude: stop.latitude,
        longitude: stop.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const renderStopItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.stopCard,
        selectedStop?.id === item.id && styles.selectedStopCard
      ]}
      onPress={() => handleStopPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.stopIconContainer}>
        <View style={[styles.stopIcon, { backgroundColor: getStopColor(index) }]}>
          <Text style={styles.stopIconText}>
            {String.fromCharCode(65 + (index % 26))}
          </Text>
        </View>
        <View style={styles.stopStatus}>
          <View style={[styles.statusDot, { backgroundColor: item.isActive ? '#4CAF50' : '#FF5252' }]} />
        </View>
      </View>
      
      <View style={styles.stopInfo}>
        <Text style={styles.stopName}>{item.name}</Text>
        <Text style={styles.stopAddress} numberOfLines={1}>
          {item.address || 'Bus Stop'}
        </Text>
        <View style={styles.stopMeta}>
          <View style={styles.metaItem}>
            <Icon name="directions-bus" size={14} color="#666" />
            <Text style={styles.metaText}>Route {item.routeCount || 5}+</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="access-time" size={14} color="#666" />
            <Text style={styles.metaText}>{item.duration} min</Text>
          </View>
        </View>
      </View>

      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>{item.distance} km</Text>
        <Icon 
          name="navigation" 
          size={20} 
          color={selectedStop?.id === item.id ? '#1976D2' : '#999'} 
        />
      </View>
    </TouchableOpacity>
  );

  const getStopColor = (index) => {
    const colors = ['#E53935', '#43A047', '#FB8C00', '#8E44AD', '#1976D2', '#00ACC1'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Finding nearby stops...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="location-off" size={60} color="#FF5252" />
        <Text style={styles.errorTitle}>Location Error</Text>
        <Text style={styles.errorText}>{locationError}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={requestLocationPermission}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {mapRegion && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            rotateEnabled={true}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor="#1976D2"
              />
            )}
            
            {/* Stop Markers */}
            {nearbyStops.slice(0, 10).map((stop, index) => (
              stop.latitude && stop.longitude && (
                <Marker
                  key={stop.id}
                  coordinate={{
                    latitude: stop.latitude,
                    longitude: stop.longitude
                  }}
                  title={stop.name}
                  description={`${stop.distance} km away`}
                  onPress={() => handleStopPress(stop)}
                >
                  <View style={[styles.markerContainer, { backgroundColor: getStopColor(index) }]}>
                    <Text style={styles.markerText}>
                      {String.fromCharCode(65 + (index % 26))}
                    </Text>
                  </View>
                </Marker>
              )
            ))}
          </MapView>
        )}
        
        {/* Map Overlay Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => {
              if (userLocation) {
                setMapRegion({
                  ...userLocation,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }
            }}
          >
            <Icon name="my-location" size={24} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => setMapRegion({
              ...mapRegion,
              latitudeDelta: mapRegion.latitudeDelta * 0.8,
              longitudeDelta: mapRegion.longitudeDelta * 0.8,
            })}
          >
            <Icon name="zoom-in" size={24} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => setMapRegion({
              ...mapRegion,
              latitudeDelta: mapRegion.latitudeDelta * 1.2,
              longitudeDelta: mapRegion.longitudeDelta * 1.2,
            })}
          >
            <Icon name="zoom-out" size={24} color="#1976D2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Header with Sort Options */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>
            Nearby Stops ({nearbyStops.length})
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'distance' && styles.sortButtonActive]}
            onPress={() => sortStops('distance')}
          >
            <Icon 
              name="sort-by-distance" 
              size={20} 
              color={sortBy === 'distance' ? '#fff' : '#666'} 
            />
            <Text style={[styles.sortButtonText, sortBy === 'distance' && styles.sortButtonTextActive]}>
              Distance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
            onPress={() => sortStops('name')}
          >
            <Icon 
              name="sort-by-alpha" 
              size={20} 
              color={sortBy === 'name' ? '#fff' : '#666'} 
            />
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>
              Name
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stops List */}
      <FlatList
        data={nearbyStops}
        keyExtractor={item => item.id.toString()}
        renderItem={renderStopItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1976D2']}
            tintColor="#1976D2"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="directions-bus" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No stops found nearby</Text>
          </View>
        }
      />

      {/* Selected Stop Info Bar */}
      {selectedStop && (
        <View style={styles.selectedStopBar}>
          <View style={styles.selectedStopInfo}>
            <Text style={styles.selectedStopName}>{selectedStop.name}</Text>
            <Text style={styles.selectedStopDistance}>{selectedStop.distance} km away</Text>
          </View>
          <TouchableOpacity 
            style={styles.directionsButton}
            onPress={() => {
              // Open in maps app
              const url = Platform.select({
                ios: `maps:0,0?q=${selectedStop.name}@${selectedStop.latitude},${selectedStop.longitude}`,
                android: `geo:0,0?q=${selectedStop.latitude},${selectedStop.longitude}(${selectedStop.name})`
              });
              // Implement linking to maps
            }}
          >
            <Icon name="directions" size={24} color="#fff" />
            <Text style={styles.directionsText}>Go</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(16),
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(5),
  },
  errorTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: 'bold',
    color: '#333',
    marginTop: responsiveHeight(2),
  },
  errorText: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    textAlign: 'center',
    marginTop: responsiveHeight(1),
  },
  retryButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 25,
    marginTop: responsiveHeight(3),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
  mapContainer: {
    height: responsiveHeight(35),
    width: '100%',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerText: {
    color: '#fff',
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
  },
  mapControls: {
    position: 'absolute',
    right: responsiveWidth(4),
    top: responsiveHeight(2),
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    padding: responsiveWidth(1),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    color: '#333',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: responsiveWidth(2),
  },
  sortButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  sortButtonText: {
    marginLeft: 4,
    fontSize: responsiveFontSize(12),
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: responsiveHeight(8),
  },
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  selectedStopCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  stopIconContainer: {
    position: 'relative',
    marginRight: responsiveWidth(4),
  },
  stopIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  stopIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(16),
  },
  stopStatus: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stopInfo: {
    flex: 1,
    marginRight: responsiveWidth(3),
  },
  stopName: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stopAddress: {
    fontSize: responsiveFontSize(13),
    color: '#666',
    marginBottom: 6,
  },
  stopMeta: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    marginLeft: 4,
  },
  distanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: responsiveWidth(15),
  },
  distanceText: {
    fontSize: responsiveFontSize(15),
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(10),
  },
  emptyText: {
    fontSize: responsiveFontSize(16),
    color: '#999',
    marginTop: responsiveHeight(2),
  },
  selectedStopBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  selectedStopInfo: {
    flex: 1,
  },
  selectedStopName: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedStopDistance: {
    fontSize: responsiveFontSize(14),
    color: '#666',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  directionsText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginLeft: 6,
  },
});