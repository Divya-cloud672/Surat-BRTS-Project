import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import stops from '../data/stops'


export default function StopsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Image
          source={require('../assets/images/map.jpg')}
          style={styles.mapImage}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Near by bus stop</Text>
        <Icon name="refresh" size={22} color="#fff" />
      </View>
      <FlatList
        data={stops}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>
                {String.fromCharCode(65 + index)}
              </Text>
            </View>
            <Text style={styles.stopName}>{item.name}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: {
    height: 200,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stopName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
});
