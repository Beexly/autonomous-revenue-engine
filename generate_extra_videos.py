import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import urllib.request
import higgsfield_client

env_local = Path('.env.local')
if env_local.exists(): load_dotenv(dotenv_path=env_local, override=True)
if not os.getenv('HF_KEY') and os.getenv('HF_CREDENTIALS'): os.environ['HF_KEY'] = os.getenv('HF_CREDENTIALS')

dest_dir = Path(r'C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\img')

tasks = [
    {
        "filename": "micro-seed-720p.mp4",
        "prompt": "Macro extreme slow motion commercial food cinematography of a glowing amber golden honey droplet dripping onto folded prosciutto and fresh green rosemary needles on dark textured slate, dark moody candlelit background, shallow depth of field, photorealistic 8k luxury"
    },
    {
        "filename": "cart-cinematic-720p.mp4",
        "prompt": "Cinematic slow pan across a luxury matte-black vintage mobile charcuterie cart illuminated by warm glowing Edison filament bulbs in a lavish candlelit evening gala, crystal champagne glasses, decadent beignets, elegant party atmosphere, 8k commercial cinematography"
    }
]

for t in tasks:
    out_file = dest_dir / t["filename"]
    print(f"Starting Seedance 2.5 for {t['filename']}...")
    try:
        result = higgsfield_client.subscribe(
            "bytedance/seedance-2.5/text-to-video",
            arguments={
                "prompt": t["prompt"],
                "duration": 5,
                "resolution": "720p",
                "aspect_ratio": "16:9",
                "generate_audio": False,
            }
        )
        if result.get("status") == "completed":
            video_url = result.get("video", {}).get("url") if isinstance(result.get("video"), dict) else result.get("url")
            print(f"Downloading {t['filename']} from {video_url}...")
            urllib.request.urlretrieve(video_url, str(out_file))
            print(f"Saved {t['filename']} ({out_file.stat().st_size} bytes)")
        else:
            print(f"Failed {t['filename']}: {result}")
    except Exception as e:
        print(f"Error on {t['filename']}: {e}")

print("All extra video generations complete!")
