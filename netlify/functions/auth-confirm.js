const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  const params = event.queryStringParameters
  const token_hash = params.token_hash
  const type = params.type
  const next = params.next || '/'

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type
  })

  if (error) {
    console.error('OTP Doğrulama Hatası:', error.message)
    return {
      statusCode: 302,
      headers: {
        Location: '/auth/auth-code-error'
      }
    }
  }

  return {
    statusCode: 302,
    headers: {
      Location: next
    }
  }
}
