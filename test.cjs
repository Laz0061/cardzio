import('dotenv').then(dotenv => {
  dotenv.config();

  const axios = require('axios');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Hata: SUPABASE_URL veya SUPABASE_ANON_KEY değerleri .env dosyasında bulunamadı.');
    process.exit(1);
  }

  const email = 'tokluakgenclik@gmail.com'; // burada test etmek istediğin email adresini yaz
  const redirectTo = 'https://laz0061.github.io/cardzio-pages/reset-success.html';

  axios.post(`${SUPABASE_URL}/auth/v1/recover`, {
    email,
    options: {
      redirectTo
    }
  }, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('✅ Şifre sıfırlama e-postası başarıyla gönderildi.');
  })
  .catch(error => {
    console.error('❌ Gönderim hatası:', error.response?.data || error.message);
  });
});
