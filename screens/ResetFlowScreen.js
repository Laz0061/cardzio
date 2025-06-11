import { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ResetFlowScreen({ accessToken, onResetComplete }) {
  const access = accessToken?.access_token;
  const refresh = accessToken?.refresh_token;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  // ✅ accessToken ile Supabase'e oturum tanımla
  useEffect(() => {
    if (!accessToken) {
      Alert.alert('Hata', 'Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş olabilir.');
      return;
    }

    const establishSession = async () => {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '', // refresh_token boş olabilir, reset akışında gerekmiyor
      });

      if (error) {
        console.error('⛔ Oturum ayarlanamadı:', error.message);
        Alert.alert('Hata', 'Oturum kurulamadı. Link süresi dolmuş olabilir.');
      } else {
        console.log('✅ Oturum başarıyla kuruldu.');
        setSessionReady(true);
      }
    };

    establishSession();
  }, [accessToken]);

  // ✅ Şifre güncelleme işlemi
  const handlePasswordUpdate = async () => {
    if (!sessionReady) {
      Alert.alert('Hata', 'Oturum kurulamadı. Lütfen bağlantıyı kontrol edin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    const { error, success } = await updateUserPassword(accessToken, newPassword);

    if (error) {
      console.error('⛔ Şifre güncellenemedi:', error.message);
      Alert.alert('Hata', 'Şifre güncellenemedi. Lütfen tekrar deneyin.');
    } else {
      Alert.alert('Başarılı', 'Şifreniz başarıyla sıfırlandı!');
      onResetComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🔒 Yeni Şifreni Belirle</Text>
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
      <Button
        title="Şifreyi Güncelle"
        onPress={handlePasswordUpdate}
        color="#224B38"
        disabled={!sessionReady}
      />
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
