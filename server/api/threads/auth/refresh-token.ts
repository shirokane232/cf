// /server/api/threads/refresh.ts
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const { access_token, user_id } = await readBody(event);
  if (!access_token || !user_id) {
    return { success: false, error: "Missing access_token or user_id." };
  }
  
  const params = new URLSearchParams();
  params.append("grant_type", "th_refresh_token");
  params.append("access_token", access_token);

  const requestUrl = `https://graph.threads.net/refresh_access_token?${params.toString()}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
    });

    const refreshedTokenData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: refreshedTokenData.error_message || "Failed to refresh token.",
      };
    }

    return {
      access_token: refreshedTokenData.access_token,
      user_id: user_id,
    };
  } catch (err) {
    return { success: false, error: "Network request failed." };
  }
});
