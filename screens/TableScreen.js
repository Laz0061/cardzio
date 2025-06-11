import { StyleSheet, Text, View } from 'react-native';

export default function TablesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🃏 Masalar</Text>
      <Text style={styles.description}>
        Burada katılabileceğin aktif oyun masaları listelenecek.
      </Text>
      {/* Buraya ileride aktif masalar dinamik olarak eklenecek */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#224B38',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
