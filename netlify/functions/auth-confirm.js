const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async function (event, context) {
  const { token_hash, type, next } = event.queryStringParameters;

  if (!token_hash || !type || !next) {
    return {
      statusCode: 400,
      body: '❗ Eksik parametreler: token_hash, type ve next gerekli.',
    };
  }

  try {
    // ✅ Token doğrulama
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (error) {
      console.error('⛔ Doğrulama hatası:', error.message);
      return {
        statusCode: 401,
        body: '⛔ Token doğrulaması başarısız.',
      };
    }

    const accessToken = data?.session?.access_token;

    if (!accessToken) {
      return {
        statusCode: 500,
        body: '⛔ Oturum alınamadı: access_token yok.',
      };
    }

    // ✅ next parametresine access_token eklenerek yönlendirme yapılır
    const redirectUrl = `${next}?access_token=${accessToken}`;

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl,
      },
      body: '',
    };
  } catch (err) {
    console.error('⚠️ Beklenmeyen hata:', err.message);
    return {
      statusCode: 500,
      body: '⚠️ Sunucu hatası oluştu.',
    };
  }
};
