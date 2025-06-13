const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const params = new URLSearchParams(event.rawUrl.split('?')[1]);
  const token_hash = params.get('token_hash');
  const type = params.get('type');
  const next = params.get('next') || '/';

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      return {
        statusCode: 302,
        headers: {
          Location: next,
        },
      };
    }
  }

  return {
    statusCode: 302,
    headers: {
      Location: '/auth/auth-code-error',
    },
  };
};
