import { useState } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import { updateUserPassword } from '../utils/auth';

export default function ResetFlowScreen({ accessToken, onResetComplete }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor.');
      return;
    }

    setLoading(true);

    const result = await updateUserPassword(accessToken, newPassword); // ✅ refreshToken çıkarıldı

    setLoading(false);

    if (result?.error) {
      Alert.alert('Şifre Güncelleme Hatası', result.error.message);
    } else {
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi!');
      onResetComplete(); // ✅ App.js içindeki yönlendirmeyi tetikler
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Yeni Şifre Belirleyin</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="Yeni Şifre"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="Şifreyi Onaylayın"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button
        title={loading ? 'Şifre Güncelleniyor...' : 'Şifreyi Güncelle'}
        onPress={handleReset}
        disabled={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
});
