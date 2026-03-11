// screens/TicketScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TicketScreen() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [ticketType, setTicketType] = useState('single');
  const [quantity, setQuantity] = useState(1);

  const handleBuyTicket = () => {
    if (!source || !destination) {
      Alert.alert('Error', 'Please select source and destination');
      return;
    }
    Alert.alert(
      'Success',
      `Ticket booked!\nFrom: ${source}\nTo: ${destination}\nType: ${ticketType}\nQuantity: ${quantity}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="ticket-confirmation" size={50} color="#1565c0" />
        <Text style={styles.title}>M-Ticket</Text>
        <Text style={styles.subtitle}>Book your bus ticket digitally</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter source stop"
          value={source}
          onChangeText={setSource}
        />

        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination stop"
          value={destination}
          onChangeText={setDestination}
        />

        <Text style={styles.label}>Ticket Type</Text>
        <View style={styles.ticketTypeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              ticketType === 'single' && styles.selectedType
            ]}
            onPress={() => setTicketType('single')}
          >
            <Text style={ticketType === 'single' ? styles.selectedTypeText : styles.typeText}>
              Single
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              ticketType === 'return' && styles.selectedType
            ]}
            onPress={() => setTicketType('return')}
          >
            <Text style={ticketType === 'return' ? styles.selectedTypeText : styles.typeText}>
              Return
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Icon name="minus" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalPrice}>₹{quantity * 25}</Text>
        </View>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket}>
          <Text style={styles.buyButtonText}>Buy Ticket</Text>
        </TouchableOpacity>
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
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  ticketTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1565c0',
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#1565c0',
  },
  typeText: {
    color: '#1565c0',
    fontWeight: '600',
  },
  selectedTypeText: {
    color: '#fff',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#1565c0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  buyButton: {
    backgroundColor: '#1565c0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});