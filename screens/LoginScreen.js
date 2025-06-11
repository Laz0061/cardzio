import { useState } from 'react';
import {
  Alert,
  Button,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';
import { createUserProfile, getEmailFromUsername, signIn } from '../utils/auth';

export default function LoginScreen({ onLogin, onNavigateToRegister, onNavigateToForget }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (usernameOrEmail.trim() === '' || password.trim() === '') {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const isEmail = usernameOrEmail.includes('@');
      const input = usernameOrEmail.toLowerCase();

      let emailToLogin = input;

      if (!isEmail) {
        const foundEmail = await getEmailFromUsername(input);
        if (!foundEmail) {
          Alert.alert('Giriş Hatası', 'Kullanıcı adı sistemde kayıtlı değil.');
          return;
        }
        emailToLogin = foundEmail;
      }

      const result = await signIn(emailToLogin, password);
if (result?.error) {
  const msg = result.error.message?.toLowerCase();

  // Eğer şifre ya da kullanıcı hatalıysa, özelleştirilmiş mesaj göster
  if (msg.includes('invalid login credentials')) {
    Alert.alert('Giriş Hatası', 'Kullanıcı adı, e-posta veya şifre hatalı. Lütfen tekrar deneyiniz.');
  } else {
    Alert.alert('Giriş Hatası', result.error.message); // diğer hata türlerini normal göster
  }

  return;
}

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error('Kullanıcı verisi alınamadı:', userError?.message);
        Alert.alert('Hata', 'Kullanıcı verisi alınamadı.');
        return;
      }

      const { id, email } = userData.user;
      const usernameValue = isEmail ? null : input;

      const profileCheck = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!profileCheck.data || !profileCheck.data.username) {
        await createUserProfile(id, email, usernameValue);
      }

      onLogin(); // Giriş başarılıysa devam et
    } catch (err) {
      console.error('Giriş sırasında hata:', err.message);
      Alert.alert('Giriş Hatası', 'Bilinmeyen bir hata oluştu.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../assets/images/login-background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.form}>
          <TextInput
            placeholder="Kullanıcı adı veya E-posta"
            placeholderTextColor="#999"
            style={styles.input}
            autoCapitalize="none"
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
          />
          <TextInput
            placeholder="Şifre"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="GİRİŞ YAP" onPress={handleSignIn} color="#224B38" />
          <View style={styles.buttonSpacing} />
          <Button title="KAYIT OL" onPress={onNavigateToRegister} color="#224B38" />
          <TouchableOpacity style={styles.forgotPassword} onPress={onNavigateToForget}>
            <Text style={styles.forgotPasswordText}>Şifrenizi mi unuttunuz?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  form: {
    backgroundColor: '#F5A623',
    marginHorizontal: 10,
    marginBottom: 195,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  input: {
    backgroundColor: '#cecaca',
    borderWidth: 1,
    borderColor: '#224B38',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  buttonSpacing: {
    height: 12
  },
  forgotPassword: {
    marginTop: 12,
    alignItems: 'flex-end'
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#007AFF'
  }
});
