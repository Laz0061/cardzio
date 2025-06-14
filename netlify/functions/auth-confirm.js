const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const { token_hash, type, next } = event.queryStringParameters;

  if (!token_hash || !type || !next) {
    return {
      statusCode: 400,
      body: 'Eksik parametre: token_hash, type, next gereklidir.',
    };
  }

  // 🔐 Supabase istemcisini service role key ile başlatıyoruz
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 🧠 OTP doğrulama
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (error || !data.session) {
      console.error('⛔ Oturum alınamadı:', error?.message);
      return {
        statusCode: 401,
        body: 'Oturum doğrulanamadı. Link süresi dolmuş olabilir.',
      };
    }

    const access_token = data.session.access_token;
    const refresh_token = data.session.refresh_token;

    // ✅ Başarılı doğrulama sonrası yönlendirme linkini oluştur
    const redirectUrl = `${next}?access_token=${access_token}&refresh_token=${refresh_token}`;

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl,
      },
    };
  } catch (err) {
    console.error('⚠️ Sunucu hatası:', err.message);
    return {
      statusCode: 500,
      body: 'Sunucu hatası oluştu.',
    };
  }
};
