import { useState } from 'react';
import {
  Alert,
  Button,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { signUp } from '../utils/auth';

export default function RegisterScreen({ onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Eksik Bilgi', 'Tüm alanları doldurun.');
      return;
    }

    const result = await signUp(email, password, username);

    if (result?.error) {
      Alert.alert('Kayıt Hatası', result.error.message);
    } else {
      Alert.alert(
        'Başarılı',
        'Kayıt tamamlandı. Lütfen e-posta adresinize gelen doğrulama bağlantısını tıklayın ve ardından giriş yapın.'
      );
      onBackToLogin(); // Giriş ekranına yönlendir
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login-background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.form}>
          <TextInput
            placeholder="Kullanıcı Adı"
            placeholderTextColor="#999"
            style={styles.input}
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="E-posta"
            placeholderTextColor="#999"
            style={styles.input}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Şifre"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="KAYIT OL" onPress={handleSignUp} color="#224B38" />
          <View style={styles.buttonSpacing} />
          <Button title="GİRİŞ EKRANINA DÖN" onPress={onBackToLogin} color="#224B38" />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 200
  },
  form: {
    backgroundColor: '#F5A623',
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
  }
});
