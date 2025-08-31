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
  return {
    code
  }
//   const clientId = '您的_CLIENT_ID';
//   const clientSecret = '您的_CLIENT_SECRET';
//   const redirectUri = '您的_REDIRECT_URI';

//   const tokenUrl = `https://graph.threads.com/v1.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`;

//   try {
//     const response = await fetch(tokenUrl, {
//       method: 'GET',
//     });

//     const data = await response.json();

//     if (response.ok) {
//       const accessToken = data.access_token;
//       return { success: true, accessToken, data };
//     } else {
//       return { success: false, error: data.error_message || 'Failed to get access token' };
//     }
//   } catch (err) {
//     return { success: false, error: 'Network request failed.' };
//   }
});