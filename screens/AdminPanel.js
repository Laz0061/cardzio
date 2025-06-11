import { StyleSheet, Text, View } from 'react-native';

export default function AdminPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Admin Panel</Text>
      <Text style={styles.description}>
        Buraya sadece admin kullanıcılar erişebilir. Geliştirme sırasında buraya özel kontroller, kullanıcı yönetimi, sistem logları vb. ekleyebilirsin.
      </Text>
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
    fontWeight: 'bold',
    color: '#224B38',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
});
