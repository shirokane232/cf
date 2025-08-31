import { defineEventHandler, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const clientId = config.public.threadsClientId;
  const redirectUri = config.public.threadsRedirectUri;

  if (!clientId || !redirectUri) {
    return { error: 'Client ID or Redirect URI not configured.' };
  }

  const authUrl = `https://threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=threads_basic,threads_content_publish,threads_read_replies,threads_manage_replies,threads_manage_insights&response_type=code&state=test`;
  return sendRedirect(event, authUrl);
});