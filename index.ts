import { config, higgsfield } from "@higgsfield/client/v2";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load .env.local if present, else fallback to standard dotenv
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
} else {
  dotenv.config({ override: true });
}

// Support either HF_CREDENTIALS or HF_KEY without exposing values
const credentials = process.env.HF_CREDENTIALS || process.env.HF_KEY;

if (!credentials || credentials.trim() === "" || credentials.includes("your_key_id")) {
  console.error("ERROR: Higgsfield credentials not configured.");
  console.error("Please update .env.local with your real API key (HF_CREDENTIALS=key-id:key-secret).");
  console.error("Obtain your API key from: https://console.higgsfield.ai/api-keys");
  process.exit(1);
}

config({
  credentials,
});

async function generateSunsetVideo(): Promise<void> {
  const modelId = "bytedance/seedance-2.5/text-to-video";
  const input = {
    prompt: "A cinematic scene at sunset",
    duration: 5,
    resolution: "720p",
    aspect_ratio: "16:9",
  };

  console.log(`Submitting request to model: ${modelId}`);
  console.log(`Parameters: prompt='${input.prompt}', duration=${input.duration}, resolution='${input.resolution}', aspect_ratio='${input.aspect_ratio}'`);

  try {
    const result: any = await higgsfield.subscribe(modelId, {
      input,
      withPolling: true,
    });

    console.log(`\nFinal status: ${result.status}`);

    if (result.status === "completed") {
      const videoUrl =
        result.video?.url ||
        (Array.isArray(result.videos) && result.videos[0]?.url) ||
        result.url;

      if (videoUrl) {
        console.log("Generation successful!");
        console.log(`Video URL: ${videoUrl}`);
      } else {
        console.log("Generation reported completed, but no video URL found in response payload:");
        console.dir(result, { depth: null });
      }
    } else if (result.status === "failed") {
      const errorMsg = result.error || result.message || "Unknown error";
      console.error(`Generation FAILED: ${errorMsg}`);
      process.exit(2);
    } else if (result.status === "canceled" || result.status === "cancelled") {
      console.error("Generation CANCELED before processing started.");
      process.exit(3);
    } else if (result.status === "nsfw") {
      console.error("Generation REJECTED: Content moderation flagged the prompt or output (NSFW/moderated).");
      process.exit(4);
    } else {
      console.error(`Unexpected terminal status: ${result.status}`, result);
      process.exit(5);
    }
  } catch (error: any) {
    console.error("Higgsfield API Error:", error?.message || error);
    process.exit(1);
  }
}

generateSunsetVideo();
