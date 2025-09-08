// /server/api/threads/post.ts
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const { user_id, access_token, image_urls, text } = await readBody(event);
    const publishPost = async (creationId: string) => {
      const publishUrl = `https://graph.threads.net/v1.0/${user_id}/threads_publish`;
      const publishParams = new URLSearchParams({
        creation_id: creationId,
        access_token: access_token,
      });

      const response = await fetch(`${publishUrl}?${publishParams.toString()}`, {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false }
      }
      return { success: response.ok, id: data.id };
    };

    const createMediaContainer = async (url: string, isCarouselItem = false) => {
      const createUrl = `https://graph.threads.net/v1.0/${user_id}/threads`;
      const createParams = new URLSearchParams({
        image_url: url,
        media_type: "IMAGE",
        access_token: access_token,
      });

      if (isCarouselItem) {
        createParams.append("is_carousel_item", "true");
      }

      const response = await fetch(`${createUrl}?${createParams.toString()}`, {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to create media container.");
      }
      return data.id;
    };

    let creation_id;

    if (image_urls && image_urls.length > 0) {
      // Handle carousel posts
      const containerIds = [];
      for (const url of image_urls) {
        const containerId = await createMediaContainer(url, true);
        containerIds.push(containerId);
      }

      const carouselUrl = `https://graph.threads.net/v1.0/${user_id}/threads`;
      const carouselParams = new URLSearchParams({
        media_type: "CAROUSEL",
        children: containerIds.join(','),
        access_token: access_token,
      });
      if (text) {
        carouselParams.append("text", text);
      }
      
      const response = await fetch(`${carouselUrl}?${carouselParams.toString()}`, {
        method: "POST",
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to create carousel container.");
      }
      creation_id = data.id;

    } else {
      // Handle text-only posts
      const textPostUrl = `https://graph.threads.net/v1.0/${user_id}/threads`;
      const textPostParams = new URLSearchParams({
        media_type: "TEXT",
        text: text,
        access_token: access_token,
      });

      const response = await fetch(`${textPostUrl}?${textPostParams.toString()}`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to create text container.");
      }
      creation_id = data.id;
    }

    // Publish the post
    const publishResult = await publishPost(creation_id);
    return publishResult;

  } catch (err) {
    console.error("Error creating or publishing Threads post:", (err as Error).message);
    return { success: false, error: (err as Error).message || "An unexpected error occurred." };
  }
});