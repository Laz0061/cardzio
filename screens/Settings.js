import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { signOut } from '../utils/auth';

export default function Settings({ onLogout }) {
  const handleLogout = async () => {
    const result = await signOut();
    if (result) {
      onLogout(); // App.js içinde setIsLoggedIn(false) tetiklenir
    } else {
      Alert.alert('Hata', 'Çıkış yapılamadı. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Ayarlar</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Hesap Ayarları</Text>
        <Button title="Çıkış Yap" onPress={handleLogout} color="#224B38" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#224B38',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
});
