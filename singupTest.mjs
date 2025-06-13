import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hkjyktpxcbmqjfaapdju.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhranlrdHB4Y2JtcWpmYWFwZGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTI0MTIsImV4cCI6MjA2NDM4ODQxMn0.vcBWZ2EMv5hNs3byWo5nMc6Ilv4gK43Hgr_5ubabEys'
);

// 🔑 Buraya geçerli bir access_token yapıştır:
const access_token = '5a75af2128995c1d5188e7b3b9c4ef7ee684cd2d5701efb3e1cd1134';
const refresh_token = ''; // refresh_token opsiyonel ama varsa koyabilirsin

const testUpdatePassword = async () => {
  // 🔐 Elle session kur
  const { error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token
  });

  if (sessionError) {
    console.error('🚫 Session kurulamadı:', sessionError);
    return;
  }

  // 📦 Session durumunu kontrol et
  const { data: sessionData, error: sessionGetError } = await supabase.auth.getSession();
  console.log('🧠 Oturum verisi:', sessionData);
  if (sessionGetError) {
    console.log('❗Session çekme hatası:', sessionGetError);
  }

  // 🛠️ Şifre güncelle
  const { data, error } = await supabase.auth.updateUser({ password: 'yeniŞifre123' });

  if (error) {
    console.error('🔥 Şifre güncellenemedi:', error);
    console.log('📄 Hata Kodu:', error.status);
    console.log('📄 Mesaj:', error.message);
    console.log('📄 Detay:', error.details);
  } else {
    console.log('✅ Şifre başarıyla güncellendi:', data);
  }
};

testUpdatePassword();