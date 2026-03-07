import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function PlannerScreen() {
  const [startStop, setStartStop] = useState('');
  const [endStop, setEndStop] = useState('');

  return (
    // <>
    //   <Text>hello</Text>
    // </>
    <View style={styles.container}>
      <TextInput
        placeholder=" Enter Start Stop"
        placeholderTextColor="black"
        value={startStop}
        onChangeText={setStartStop}
        style={styles.input}
      />
      <TextInput
        placeholder=" Enter End Stop"
        placeholderTextColor="black"
        value={endStop}
        onChangeText={setEndStop}
        style={styles.input}
      />
      {/* <Button
        title="Get routes"
        // onPress={() => alert(`From: ${startStop} To: ${endStop}`)}
        // disabled={!startStop || !endStop}
        // nextFocusForward={true}
        testID='getroute'
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
