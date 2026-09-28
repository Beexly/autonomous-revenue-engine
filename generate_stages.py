import os
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
        "filename": "stage2-artisan-board.png",
        "prompt": "Artisan dark walnut charcuterie board viewed from dramatic 45-degree angle in moody dark studio. Loaded with arranged prosciutto florets, wedges of creamy brie with honeycomb, aged manchego, fresh mission figs sliced open, clusters of dark champagne grapes, rosemary sprigs, scattered marcona almonds, soft warm directional candlelight, 8k luxury editorial food photography"
    },
    {
        "filename": "stage3-grand-banquet.png",
        "prompt": "Cinematic wide angle shot of an opulent 12-foot candlelit charcuterie grazing table feast stretching into a dark moody ballroom. Towering tiers of artisan breads, cured meats, cascades of exotic cheeses, dark berries, overflowing fruit towers, glowing beeswax taper candles flickering, crystal goblets, dramatic luxury catering masterpiece, 8k"
    },
    {
        "filename": "stage4-midnight-cart.png",
        "prompt": "Luxury vintage matte-black and brass mobile charcuterie cart illuminated with warm ambient Edison filament bulbs in an upscale candlelit evening event. Overflowing with charcuterie cones, artisan sliders, fresh beignets with powdered sugar, crystal champagne coupe glasses, moody luxury catering cart centerpiece, 8k"
    }
]

for t in tasks:
    out_path = dest_dir / t["filename"]
    print(f"Generating {t['filename']}...")
    try:
        res = higgsfield_client.subscribe(
            'higgsfield-ai/soul/v2/standard',
            arguments={'prompt': t["prompt"]}
        )
        if res.get('status') == 'completed':
            img_url = res['images'][0]['url']
            urllib.request.urlretrieve(img_url, str(out_path))
            print(f"Successfully saved {t['filename']} from {img_url}")
        else:
            print(f"Failed {t['filename']}: {res}")
    except Exception as e:
        print(f"Error generating {t['filename']}: {e}")
