// screens/FareScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FARE_DATA = [
  { distance: '0-2 km', fare: 5 },
  { distance: '2-5 km', fare: 10 },
  { distance: '5-10 km', fare: 15 },
  { distance: '10-15 km', fare: 20 },
  { distance: '15-20 km', fare: 25 },
  { distance: '20-25 km', fare: 30 },
  { distance: '25+ km', fare: 35 },
];

const DISCOUNTS = [
  { type: 'Student', discount: '50%', validity: 'Valid on weekdays' },
  { type: 'Senior Citizen', discount: '40%', validity: 'Valid all days' },
  { type: 'Monthly Pass', discount: '30%', validity: '30 days validity' },
  { type: 'Group Booking', discount: '20%', validity: 'Min 5 persons' },
];

export default function FareScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="currency-inr" size={50} color="#1565c0" />
        <Text style={styles.title}>Fare Chart</Text>
        <Text style={styles.subtitle}>Standard fare structure</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distance Based Fare</Text>
        {FARE_DATA.map((item, index) => (
          <View key={index} style={styles.fareRow}>
            <Text style={styles.distanceText}>{item.distance}</Text>
            <Text style={styles.fareText}>₹{item.fare}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Special Discounts</Text>
        {DISCOUNTS.map((item, index) => (
          <View key={index} style={styles.discountRow}>
            <View style={styles.discountIcon}>
              <Icon name="percent" size={20} color="#1565c0" />
            </View>
            <View style={styles.discountInfo}>
              <Text style={styles.discountType}>{item.type}</Text>
              <Text style={styles.discountValidity}>{item.validity}</Text>
            </View>
            <Text style={styles.discountValue}>{item.discount}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteCard}>
        <Icon name="information" size={24} color="#1565c0" />
        <Text style={styles.noteText}>
          *Fares are subject to change. Digital payments get 5% extra discount.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565c0',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  distanceText: {
    fontSize: 16,
    color: '#666',
  },
  fareText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  discountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  discountInfo: {
    flex: 1,
  },
  discountType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  discountValidity: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  discountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    margin: 15,
    marginTop: 5,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#1565c0',
    marginLeft: 10,
    fontStyle: 'italic',
  },
});