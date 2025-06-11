import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function ShopScreen() {
  const handlePurchase = () => {
    Alert.alert('Satın Alım', 'CT (CardToken) satın alma işlemi şu anda devrede değil.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 CardToken Satın Al</Text>
      <Text style={styles.description}>
        Oyunlarda kullanmak üzere CT (CardToken) satın alabilirsin.
      </Text>
      <View style={styles.ctBox}>
        <Text style={styles.ctAmount}>100 CT</Text>
        <Button title="Satın Al - 29,99₺" onPress={handlePurchase} color="#224B38" />
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
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctBox: {
    backgroundColor: '#F5A623',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
