import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FareScreen() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  // Simple Fare Logic
  const calculateFare = () => {

    if (source === "" || destination === "") {
      Alert.alert("Error", "Please select source and destination");
      return;
    }

    if (source === destination) {
      Alert.alert("Error", "Source and Destination cannot be same");
      return;
    }

    let fare = 10;

    const routes = {
      "Station-Adajan": 15,
      "Station-Vesu": 20,
      "Adajan-Vesu": 12
    };

    const key1 = `${source}-${destination}`;
    const key2 = `${destination}-${source}`;

    if (routes[key1]) fare = routes[key1];
    else if (routes[key2]) fare = routes[key2];

    Alert.alert("Bus Fare", `Fare from ${source} to ${destination} is ₹${fare}`);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Fare Chart</Text>

      {/* Source Picker */}
      <View style={styles.pickerBox}>
        <Icon name="trip-origin" size={20} color="#333" />
        <Picker
          selectedValue={source}
          style={styles.picker}
          onValueChange={(itemValue) => setSource(itemValue)}
        >
          <Picker.Item label="Select Source" value="" />
          <Picker.Item label="Station" value="Station" />
          <Picker.Item label="Adajan" value="Adajan" />
          <Picker.Item label="Vesu" value="Vesu" />
        </Picker>
      </View>

      {/* Destination Picker */}
      <View style={styles.pickerBox}>
        <Icon name="location-on" size={20} color="#333" />
        <Picker
          selectedValue={destination}
          style={styles.picker}
          onValueChange={(itemValue) => setDestination(itemValue)}
        >
          <Picker.Item label="Select Destination" value="" />
          <Picker.Item label="Station" value="Station" />
          <Picker.Item label="Adajan" value="Adajan" />
          <Picker.Item label="Vesu" value="Vesu" />
        </Picker>
      </View>

      {/* See Fare Button */}
      <TouchableOpacity style={styles.buttonFare} onPress={calculateFare}>
        <Icon name="attach-money" size={22} color="#fff" />
        <Text style={styles.buttonText}>See Fare</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30
  },

  pickerBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10
  },

  picker: {
    flex: 1
  },

  buttonFare: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center"
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600"
  }

});