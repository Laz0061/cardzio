import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { updateUserPassword } from '../utils/auth';

export default function ResetFlowScreen({ accessToken, refreshToken, onResetComplete }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    const result = await updateUserPassword(accessToken, refreshToken, newPassword);

    if (result?.error) {
      Alert.alert('Hata', result.error.message);
    } else {
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.');
      onResetComplete();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Yeni Şifre"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Şifreyi Onayla"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />
      <Button title="Şifreyi Güncelle" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
  },
});
