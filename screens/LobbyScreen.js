import { Button, StyleSheet, Text, View } from 'react-native';
import { signOut } from '../utils/auth';

export default function LobbyScreen({ onLogout }) {
  const handleLogout = async () => {
    await signOut();
    onLogout(); // App.js'de oturum durumunu false yapar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎮 Lobby Screen</Text>
      <Button title="Çıkış Yap" onPress={handleLogout} color="#D9534F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#224B38',
  },
});
