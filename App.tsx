import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import CheckFirebaseScreen from './src/screens/CheckFirebaseScreen';

export default function App() {
  return (
    <View style={styles.container}>
          <Text style={{ fontSize: 20, marginBottom: 20 }}>Firebase Connection Test</Text>
          <CheckFirebaseScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
