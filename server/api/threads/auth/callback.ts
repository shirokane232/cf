import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let code = query.code as string;

  if (!code) {
    return { error: 'No code provided.' };
  }

  if (code.endsWith('#_')) {
    code = code.slice(0, -2);
  }
  
  const config = useRuntimeConfig();
  const clientId = config.public.threadsClientId as string;
  const clientSecret = config.threadsClientSecret as string;
  const redirectUri = config.public.threadsRedirectUri as string;

  const body = new URLSearchParams();
  body.append('client_id', clientId);
  body.append('client_secret', clientSecret);
  body.append('grant_type', 'authorization_code');
  body.append('redirect_uri', redirectUri);
  body.append('code', code);

  try {
    const response = await fetch('https://graph.threads.net/oauth/access_token', {
      method: 'POST',
      body,
    });

    const data = await response.json();

    if (response.ok) {
      return data
    } else {
      return { success: false, error: data.error_message || 'Failed to get access token' };
    }
  } catch (err) {
    return { success: false, error: 'Network request failed.' };
  }
});