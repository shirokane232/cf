import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let code = query.code as string;

  if (!code) {
    return { error: "No code provided." };
  }

  if (code.endsWith("#_")) {
    code = code.slice(0, -2);
  }
  const host =
    event.headers.get("x-forwarded-host") || event.headers.get("host");
  const protocol = event.headers.get("x-forwarded-proto") || "http";
  const serverDomain = `${protocol}://${host}`;
  const config = useRuntimeConfig();
  const clientId = config.public.threadsClientId as string;
  const clientSecret = config.threadsClientSecret as string;
  const redirectPath = config.public.threadsRedirectPath as string;
  const redirectUri = `${serverDomain}${redirectPath}`;

  const body = new URLSearchParams();
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);
  body.append("grant_type", "authorization_code");
  body.append("redirect_uri", redirectUri);
  body.append("code", code);

  try {
    const response = await fetch(
      "https://graph.threads.net/oauth/access_token",
      {
        method: "POST",
        body,
      }
    );
    // {"access_token": ..., "user_id": ...}
    const shortLiveAccessToken = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error:
          shortLiveAccessToken.error_message || "Failed to get access token",
      };
    }
    const params = new URLSearchParams();
    params.append("grant_type", "th_exchange_token");
    params.append("client_secret", clientSecret);
    params.append("access_token", shortLiveAccessToken.access_token);

    const requestUrl = `https://graph.threads.net/access_token?${params.toString()}`;

    const longLiveTokenResponse = await fetch(requestUrl, {
      method: "GET",
    });
    const longLiveToken = await longLiveTokenResponse.json();
    if (!response.ok) {
      return {
        success: false,
        error: longLiveToken.error_message || "Failed to get access token",
      };
    }

    return {
      access_token: longLiveToken.access_token,
      user_id: shortLiveAccessToken.user_id,
    };
  } catch (err) {
    return { success: false, error: "Network request failed." };
  }
});
