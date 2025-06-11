import { NavigationContainer } from '@react-navigation/native';
import * as LinkingExpo from 'expo-linking';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text } from 'react-native';

import TabNavigator from './navigation/TabNavigator';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetFlowScreen from './screens/ResetFlowScreen';

import { supabase } from './lib/supabase';

// ✅ Deep Link ayarları
const linking = {
  prefixes: ['cardzio://', 'https://cardzio.net'],
  config: {
    screens: {
      onay: 'onay',
      'reset-password': 'reset-password',
    },
  },
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deepLinkChecked, setDeepLinkChecked] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login'); // login | register | forgot | reset
  const [resetToken, setResetToken] = useState(null);

  // ✅ Deep Link yakalama
  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log('🔥 URL geldi:', event.url);
      const data = LinkingExpo.parse(event.url);
      console.log('📩 Deep Link alındı:', data);

      const rawPath = data.path || data.hostname;

      if (rawPath === 'onay') {
        setCurrentScreen('login');
      }

      if (rawPath === 'reset-password') {
        const access = data.queryParams?.access_token;
const refresh = data.queryParams?.refresh_token;

if (access && refresh) {
  setResetToken({ access_token: access, refresh_token: refresh });
  setCurrentScreen('reset');
  setIsLoggedIn(false);
  setLoading(false);
} else {
  console.warn('❗ reset-password için token bulunamadı');
}
      }
    };

    const subscription = Linking.addListener('url', handleDeepLink);

    // ✅ Uygulama kapalıyken açılıyorsa
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log('🌐 InitialURL:', initialUrl);
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
      setDeepLinkChecked(true);
    })();

    return () => {
      subscription.remove();
    };
  }, []);

  // ✅ Oturum kontrolü (resetToken varsa önce reset ekranına yönlendir)
  useEffect(() => {
    async function fetchSession() {
      if (resetToken) {
        setCurrentScreen('reset');
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setLoading(false);
    }

    fetchSession();
  }, [resetToken]);

  // ✅ Debug için log
  useEffect(() => {
    console.log('🧪 isLoggedIn:', isLoggedIn);
    console.log('🧪 currentScreen:', currentScreen);
    console.log('🧪 resetToken:', resetToken);
  }, [isLoggedIn, currentScreen, resetToken]);

  // ✅ Yükleniyor ekranı
  if (loading || !deepLinkChecked) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#F5A623" />
        <Text style={styles.loadingText}>Oturum kontrol ediliyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {currentScreen === 'reset' ? (
        <ResetFlowScreen
          accessToken={resetToken}
          onResetComplete={() => {
            setCurrentScreen('login');
            setResetToken(null);
          }}
        />
      ) : isLoggedIn ? (
        <TabNavigator
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentScreen('login');
          }}
        />
      ) : currentScreen === 'register' ? (
        <RegisterScreen onBackToLogin={() => setCurrentScreen('login')} />
      ) : currentScreen === 'forgot' ? (
        <ForgotPasswordScreen onBackToLogin={() => setCurrentScreen('login')} />
      ) : (
        <LoginScreen
          onLogin={() => setIsLoggedIn(true)}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToForget={() => setCurrentScreen('forgot')}
        />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#224B38',
  },
  loadingText: {
    marginTop: 12,
    color: '#fff',
  },
});
