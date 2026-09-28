import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import higgsfield_client

env_local = Path(".env.local")
if env_local.exists():
    load_dotenv(dotenv_path=env_local, override=True)
else:
    load_dotenv(override=True)

if not os.getenv("HF_KEY") and os.getenv("HF_CREDENTIALS"):
    os.environ["HF_KEY"] = os.getenv("HF_CREDENTIALS")

prompt = (
    "Cinematic slow tracking shot over an ultra-luxury candlelit charcuterie banquet table in a moody dark room. "
    "Opulent grazing display with artisan folded prosciutto, wheels of brie and aged cheese, fresh dark figs, "
    "golden honeycomb dripping, glowing taper candles with warm ambient flicker, crystal wine glasses, "
    "photorealistic 8k, shallow depth of field, commercial food cinematography, elegant and dramatic atmosphere."
)

print("Starting Higgsfield Seedance 2.5 generation for Charcuterie Feast...")
print(f"Prompt: {prompt}")

def on_queue_update(status):
    print(f"Queue status: {type(status).__name__}")

result = higgsfield_client.subscribe(
    "bytedance/seedance-2.5/text-to-video",
    arguments={
        "prompt": prompt,
        "duration": 5,
        "resolution": "720p",
        "aspect_ratio": "16:9",
        "generate_audio": True,
    },
    on_queue_update=on_queue_update,
)

print("Final Result:", result)
status = result.get("status")
if status == "completed":
    video_url = result.get("video", {}).get("url") if isinstance(result.get("video"), dict) else result.get("url")
    print("SUCCESS_VIDEO_URL=" + str(video_url))
else:
    print(f"Generation ended with status: {status}")
