import * as SecureStore from 'expo-secure-store';

export async function saveSession(token) {
  await SecureStore.setItemAsync('userSession', token);
  console.log('Session saved securely.');
}

export async function getSession() {
  const session = await SecureStore.getItemAsync('userSession');
  return session;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync('userSession');
  console.log('Session cleared.');
}