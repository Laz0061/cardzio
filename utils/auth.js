import axios from 'axios';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import { clearSession, getSession, saveSession } from './session';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = Constants.expoConfig.extra;

// ✅ Yeni kullanıcı kaydı (doğrulama odaklı)
export async function signUp(email, password, username) {
  // 🔎 Ön kontrol: username daha önce alınmış mı?
  const { data: existingUsername, error: usernameError } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username.toLowerCase())
    .maybeSingle();

  if (usernameError) {
    console.error('Username kontrol hatası:', usernameError.message);
    return {
      session: null,
      error: { message: 'Kullanıcı adı kontrol edilirken bir hata oluştu.' },
    };
  }

  if (existingUsername) {
    return {
      session: null,
      error: { message: 'Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı seçin.' },
    };
  }

  // 🔎 Ön kontrol: email daha önce kayıtlı mı?
  const { data: existingEmail, error: emailError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (emailError) {
    console.error('E-posta kontrol hatası:', emailError.message);
    return {
      session: null,
      error: { message: 'E-posta kontrol edilirken bir hata oluştu.' },
    };
  }

  if (existingEmail) {
    return {
      session: null,
      error: { message: 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.' },
    };
  }

  // ✅ Kayıt denemesi
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://cardzio.net/confirm.html',
      data: { username },
    },
  });

  if (error) {
    let message = error.message;

    if (message.toLowerCase().includes('user already registered')) {
      message = 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.';
    } else if (
      message.toLowerCase().includes('duplicate key value') &&
      message.toLowerCase().includes('username')
    ) {
      message = 'Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı seçin.';
    } else if (message.toLowerCase().includes('database error saving new user')) {
      message = 'Kayıt yapılamadı. Kullanıcı adı veya e-posta zaten kayıtlı olabilir.';
    }

    console.error('Signup error:', error.message);
    return { session: null, error: { message } };
  }

  // ✅ Kritik kontrol: error olmasa bile user null ise kayıt başarısızdır
  if (!data?.user || !data.user.id) {
    return {
      session: null,
      error: {
        message: 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.',
      },
    };
  }

  console.log('✅ Kayıt başarılı, doğrulama e-postası gönderildi:', data);

  // Kullanıcı doğrulandıysa profili ekle
  const user = data.user;
  if (user.email_confirmed_at || user.confirmed_at) {
    const { error: profileError } = await supabase.from('profiles').upsert([{
      id: user.id,
      email,
      username: username.toLowerCase(),
    }]);

    if (profileError) {
      console.error('❌ Profil insert hatası:', profileError.message);
    } else {
      console.log('✅ Profil başarıyla eklendi.');
    }
  } else {
    console.warn('⚠️ Kullanıcı henüz doğrulanmamış. Profil insert atlanıyor.');
  }

  return { session: null, error: null };
}

// ✅ Giriş işlemi
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return { session: null, error };
  }

  if (data?.session?.access_token) {
    await saveSession(data.session.access_token);
    console.log('✅ Session saved:', data.session.access_token);
  }

  return { session: data?.session, error: null };
}

// ✅ Oturum kontrolü
export async function checkUserSession() {
  const token = await getSession();
  return !!token;
}

// ✅ Çıkış işlemi
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error.message);
    return false;
  }

  await clearSession();
  console.log('🚪 Kullanıcı çıkış yaptı.');
  return true;
}

// ✅ Şifre sıfırlama (Netlify yönlendirmesi için)
export async function resetPassword(email) {
  try {
    const response = await axios.post(
  `${SUPABASE_URL}/auth/v1/recover`,
  {
    email,
    redirect_to: 'https://cardzio.net/reset.html',
  },
  {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
  }
);

    console.log('✅ Şifre sıfırlama e-postası gönderildi:', response.data);
    return { success: true };
  } catch (error) {
    console.error('❌ Şifre sıfırlama hatası:', error.response?.data || error.message);
    return { error };
  }
}

// ✅ Kullanıcı adı ile e-posta alma
export async function getEmailFromUsername(username) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .ilike('username', username.toLowerCase())
      .single();

    if (error || !data) {
      console.error('❌ Kullanıcı adı ile e-posta alınamadı:', error?.message || 'Kullanıcı bulunamadı');
      return null;
    }

    return data.email;
  } catch (err) {
    console.error('getEmailFromUsername Hatası:', err.message);
    return null;
  }
}

// ✅ Giriş sonrası profil oluşturma (gerekirse)
export async function createUserProfile(userId, email, username) {
  try {
    const payload = {
      id: userId,
      email,
    };

    if (username) {
      payload.username = username.toLowerCase();
    }

    const { error } = await supabase.from('profiles').upsert(payload);

    if (error) {
      console.error('❌ Profil oluşturulamadı:', error.message);
      return { error };
    }

    console.log('✅ Profil oluşturuldu.');
    return { success: true };
  } catch (err) {
    console.error('createUserProfile Hatası:', err.message);
    return { error: err };
  }
}

export async function updateUserPassword(accessToken, newPassword) {
  try {
    // access_token ile Supabase oturumu başlat
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '' // refresh_token gerekli değil
    });

    if (sessionError) {
      console.log('🔍 Gelen token:', accessToken); // ← burası eklensin
      console.error('⛔ Oturum kurulamadı:', sessionError.message);
      return { error: { message: 'Oturum kurulamadı. Link süresi dolmuş olabilir.' } };
    }

    // oturum kurulduktan sonra şifreyi değiştir
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('⛔ Şifre güncelleme hatası:', updateError.message);
      return { error: { message: updateError.message || 'Şifre güncellenemedi.' } };
    }

    console.log('✅ Şifre başarıyla güncellendi.');
    return { success: true };
  } catch (err) {
    console.error('⚠️ updateUserPassword Hatası:', err.message);
    return { error: { message: 'Beklenmeyen bir hata oluştu.' } };
  }
}







