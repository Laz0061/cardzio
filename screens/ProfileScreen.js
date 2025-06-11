import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Kullanıcı bilgisi alınamadı:', userError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profil alınamadı:', error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#224B38" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>Profil bilgileri yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profil Bilgileri</Text>
      <Text style={styles.info}>Kullanıcı Adı: {profile.username}</Text>
      <Text style={styles.info}>E-posta: {profile.email}</Text>
      <Text style={styles.info}>Rol: {profile.role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#224B38',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
