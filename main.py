import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import higgsfield_client
from higgsfield_client.exceptions import CredentialsMissedError, HiggsfieldClientError


def load_credentials() -> None:
    """Load credentials from .env.local (or .env) without exposing their values."""
    # Look for .env.local in current directory or parent directory
    env_local = Path(".env.local")
    if env_local.exists():
        load_dotenv(dotenv_path=env_local, override=True)
    else:
        load_dotenv(override=True)

    # Normalize HF_CREDENTIALS into HF_KEY if only HF_CREDENTIALS was set
    if not os.getenv("HF_KEY") and os.getenv("HF_CREDENTIALS"):
        os.environ["HF_KEY"] = os.getenv("HF_CREDENTIALS")


def generate_sunset_video() -> None:
    """
    Subscribes to ByteDance Seedance 2.5 text-to-video model on Higgsfield API.
    Waits for completion and handles completed, failed, canceled, and moderated statuses.
    """
    load_credentials()

    # Verify credentials existence without printing or logging their values
    hf_key = os.getenv("HF_KEY")
    if not hf_key or hf_key.strip() in ("", "your_key_id:your_key_secret"):
        print("ERROR: Higgsfield credentials not configured.")
        print("Please update .env.local with your real API key (HF_KEY=key-id:key-secret).")
        print("Obtain your API key from: https://console.higgsfield.ai/api-keys")
        sys.exit(1)

    model_id = "bytedance/seedance-2.5/text-to-video"
    arguments = {
        "prompt": "A cinematic scene at sunset",
        "duration": 5,
        "resolution": "720p",
        "aspect_ratio": "16:9",
    }

    print(f"Submitting request to model: {model_id}")
    print(f"Parameters: prompt='{arguments['prompt']}', duration={arguments['duration']}, resolution='{arguments['resolution']}', aspect_ratio='{arguments['aspect_ratio']}'")

    def on_enqueue(request_id: str) -> None:
        print(f"Request accepted! Request ID: {request_id}")

    def on_queue_update(status) -> None:
        status_name = type(status).__name__
        print(f"Progress update: status is {status_name}")

    try:
        # Submit and wait for completion using official SDK subscribe
        result = higgsfield_client.subscribe(
            model_id,
            arguments=arguments,
            on_enqueue=on_enqueue,
            on_queue_update=on_queue_update,
        )

        status = result.get("status")
        print(f"\nFinal status: {status}")

        if status == "completed":
            # Extract video URL
            video_url = None
            if isinstance(result.get("video"), dict):
                video_url = result["video"].get("url")
            elif isinstance(result.get("video"), str):
                video_url = result["video"]
            elif isinstance(result.get("videos"), list) and len(result["videos"]) > 0:
                first = result["videos"][0]
                video_url = first.get("url") if isinstance(first, dict) else first
            elif "url" in result:
                video_url = result["url"]

            if video_url:
                print(f"Generation successful!")
                print(f"Video URL: {video_url}")
            else:
                print("Generation reported completed, but no video URL found in response payload:")
                print(result)

        elif status == "failed":
            error_details = result.get("error") or result.get("message") or "Unknown error"
            print(f"Generation FAILED: {error_details}")
            sys.exit(2)

        elif status in ("canceled", "cancelled"):
            print("Generation CANCELED before processing started.")
            sys.exit(3)

        elif status == "nsfw":
            print("Generation REJECTED: Content moderation flagged the prompt or output (NSFW/moderated).")
            sys.exit(4)

        else:
            print(f"Unexpected terminal status: {status}")
            print("Response:", result)
            sys.exit(5)

    except CredentialsMissedError as e:
        print(f"Authentication Error: {e}")
        print("Please ensure HF_KEY is set in .env.local as key-id:key-secret")
        sys.exit(1)
    except HiggsfieldClientError as e:
        print(f"Higgsfield API Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Execution Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    generate_sunset_video()
