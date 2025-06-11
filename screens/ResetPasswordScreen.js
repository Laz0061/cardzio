import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ResetPasswordScreen({ onResetComplete }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const getTokensFromUrl = async () => {
      const url = await Linking.getInitialURL();
      const parsed = Linking.parse(url);
      if (parsed?.queryParams?.access_token && parsed?.queryParams?.refresh_token) {
        setAccessToken(parsed.queryParams.access_token);
        setRefreshToken(parsed.queryParams.refresh_token);
      }
    };
    getTokensFromUrl();
  }, []);

  const handlePasswordReset = async () => {
    if (!accessToken || !refreshToken) {
      Alert.alert('Hata', 'Token bilgisi eksik. Bağlantınız geçersiz olabilir.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor. Lütfen tekrar deneyin.');
      return;
    }

    // Oturumu ayarla
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      console.error('Oturum kurulamadı:', sessionError.message);
      Alert.alert('Hata', 'Oturum kurulamadı. Lütfen bağlantıyı tekrar deneyin.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error('Şifre sıfırlama hatası:', error.message);
      Alert.alert('Hata', 'Şifre sıfırlanamadı. Lütfen geçerli bir şifre girin.');
    } else {
      Alert.alert('Tebrikler', 'Şifreniz başarıyla sıfırlandı!');
      onResetComplete(); // Giriş ekranına yönlendir
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🔐 Yeni Şifre Belirle</Text>
      <TextInput
        placeholder="Yeni Şifre"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        placeholder="Yeni Şifreyi Tekrar Gir"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Şifreyi Sıfırla" onPress={handlePasswordReset} color="#224B38" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#224B38',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
});
