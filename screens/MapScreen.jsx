import React, { useState } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Dimensions,
  ActivityIndicator,
  Alert 
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    Alert.alert(
      'Error',
      'Failed to load the BRTS route map. Please check your connection and try again.'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Surat BRTS Route Map</Text>
      <Text style={styles.subtitle}>All BRTS Corridors & Phases</Text>

      <View style={styles.mapCard}>
        {imageLoading && !imageError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1565c0" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
        
        {imageError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️</Text>
            <Text style={styles.errorText}>Failed to load map</Text>
            <Text style={styles.errorSubText}>Please try again later</Text>
          </View>
        ) : (
          <Image
            source={require('../assets/images/BRTSphase.jpg')}
            style={styles.map}
            resizeMode="contain"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={handleImageError}
          />
        )}
      </View>

      {/* Optional: Add map legend or info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Map Legend</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>Phase 1 Corridor</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4ECDC4' }]} />
          <Text style={styles.legendText}>Phase 2 Corridor</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#45B7D1' }]} />
          <Text style={styles.legendText}>Proposed Corridor</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  mapCard: {
    width: width - 30, // Responsive width
    height: width * 0.8, // Responsive height (80% of width)
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#1565c0',
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 40,
    color: '#dc3545',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
  },
});