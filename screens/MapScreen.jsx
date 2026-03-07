import React from 'react';
import { View, Image, StyleSheet, Text, ScrollView } from 'react-native';

export default function MapScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mapCard}>
        <Image
          source={require('../assets/images/map.jpg')}
          style={styles.map}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 5,
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  mapCard: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
});
