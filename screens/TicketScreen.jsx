import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { Picker } from "@react-native-picker/picker";

export default function TicketScreen() {
  const [from, setFrom] = useState("Surat railway station");
  const [to, setTo] = useState("Dindoli");
  const [distance, setDistance] = useState(null);
  const [fare, setFare] = useState(null);

  const calculateFare = () => {
    let dist = 0;

    if (from === "Surat" && to === "Ahmedabad") dist = 270;
    else if (from === "Ahmedabad" && to === "Surat") dist = 270;
    else if (from === "Surat" && to === "Vadodara") dist = 150;
    else if (from === "Vadodara" && to === "Ahmedabad") dist = 110;
    else dist = 100;

    const price = dist * 2; // ₹2 per km

    setDistance(dist);
    setFare(price);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Bus M Ticket</Text>

      <Text style={styles.label}>From</Text>
      {/* <Picker selectedValue={from} onValueChange={(item) => setFrom(item)}>
        <Picker.Item label="Surat" value="Surat" />
        <Picker.Item label="Ahmedabad" value="Ahmedabad" />
        <Picker.Item label="Vadodara" value="Vadodara" />
      </Picker>

      <Text style={styles.label}>To</Text>
      <Picker selectedValue={to} onValueChange={(item) => setTo(item)}>
        <Picker.Item label="Ahmedabad" value="Ahmedabad" />
        <Picker.Item label="Surat" value="Surat" />
        <Picker.Item label="Vadodara" value="Vadodara" />
      </Picker> */}

      <TouchableOpacity style={styles.button} onPress={calculateFare}>
        <Text style={styles.buttonText}>Calculate Ticket</Text>
      </TouchableOpacity>

      {distance && (
        <View style={styles.ticketBox}>
          <Text style={styles.ticket}>🎫 Ticket Details</Text>
          <Text>From: {from}</Text>
          <Text>To: {to}</Text>
          <Text>Distance: {distance} KM</Text>
          <Text style={styles.fare}>Fare: ₹{fare}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  ticketBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  ticket: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fare: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginTop: 5,
  },
});