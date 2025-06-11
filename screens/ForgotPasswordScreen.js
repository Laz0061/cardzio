import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { resetPassword } from '../utils/auth';

export default function ForgotPasswordScreen({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
  if (!email.includes('@')) {
    Alert.alert('Geçersiz E-posta', 'Lütfen geçerli bir e-posta adresi girin.');
    return;
  }

  setLoading(true);
  const result = await resetPassword(email);
  setLoading(false); // HATA OLSA DA false yapılmalı!

  if (result?.error) {
    Alert.alert('Gönderim Hatası', result.error.message || 'E-posta gönderilemedi.');
  } else {
    Alert.alert('Başarılı', 'Şifre sıfırlama e-postası gönderildi.');
    onBackToLogin(); // ekranı geri döndür
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Şifre Sıfırlama</Text>
      <Text style={styles.subtitle}>
        Kayıtlı e-posta adresinizi girin. Size bir sıfırlama bağlantısı göndereceğiz.
      </Text>
      <TextInput
        placeholder="E-posta adresiniz"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title={loading ? 'Gönderiliyor...' : 'Şifreyi Sıfırla'} onPress={handleResetPassword} color="#F5A623" disabled={loading} />
      <View style={{ marginTop: 12 }} />
      <Button title="Girişe Dön" onPress={onBackToLogin} color="#ccc" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#224B38',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
