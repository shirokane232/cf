import { defineEventHandler, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const clientId = config.public.threadsClientId;
  const redirectUri = config.public.threadsRedirectUri;

  // 檢查必要的環境變數是否已設定
  if (!clientId || !redirectUri) {
    return { error: 'Client ID or Redirect URI not configured.' };
  }

  // 產生 Threads 授權 URL
  // `scope` 參數指定您需要的權限，這裡以 `threads_basic` 和 `threads_content_publish` 為例
  const authUrl = `https://graph.threads.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=threads_basic,threads_content_publish&response_type=code`;

  // 執行重新導向到 Threads 授權頁面
  return sendRedirect(event, authUrl);
});