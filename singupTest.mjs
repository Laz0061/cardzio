import { createClient } from '@supabase/supabase-js';

// 🔐 Supabase bağlantısı
const supabase = createClient(
  'https://hkjyktpxcbmqjfaapdju.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhranlrdHB4Y2JtcWpmYWFwZGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTI0MTIsImV4cCI6MjA2NDM4ODQxMn0.vcBWZ2EMv5hNs3byWo5nMc6Ilv4gK43Hgr_5ubabEys'
);

(async () => {
  const email = 'cardziodeneme@gmail.com';
  const password = '142651796';
  const username = 'CardzioDeneme';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // 🔁 Supabase auth metadata'ya username ekleniyor
    },
  });

  if (error) {
    console.error('❌ Signup error:', error.message);
    return;
  }

  console.log('✅ Kayıt başarılı:', data);

  // ⏳ Kullanıcı doğrulanmamışsa user null döner
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.warn('⚠️ Kullanıcı henüz doğrulanmamış. Profil insert atlanıyor.');
    return;
  }

  const { error: insertError } = await supabase.from('profiles').insert([
    {
      id: user.id,
      email: user.email,
      username: username
    }
  ]);

  if (insertError) {
    console.error('❌ Profil insert hatası:', insertError.message);
  } else {
    console.log('✅ Profil başarıyla eklendi.');
  }
})();
