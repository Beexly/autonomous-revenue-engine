- Products

- Solutions

- Developer

- Company

- Pricing

- News

Contact Sales

Try for free

Products

GrokBusinessGovernment

Download

iOSAndroidGrok on XGrok Bot

Developers

API ConsoleDocumentationGrok Build

Try for free

Back to newsJun 16, 2026

## Grok Imagine Video 1.5

Improved quality at even faster speeds.

Try it on GrokTry it on API

Grok Imagine Video 1.5 is now generally available on the Imagine API. We've also rolled out Video 1.5 Fast on grok.com/imagine and our iOS and Android apps. These are our best image-to-video models yet: better motion, better physics, better audio, at the fastest speeds. We’re also adding features to enhance your creative workflow in Grok Imagine.

Compared to the previous model, 1.5 improves across every dimension that matters for real creative work:

### Audio and speech

Sound effects, ambience, and dialogue are generated in the same pass and land on the action. Speech is clearer and better synced.

### Motion and physics

Movement holds together over the length of a clip — fewer warps, more believable weight and momentum.

### Speed

Grok Imagine Video 1.5 Fast almost doubles generation speed: it produces 6-second, 720p videos in about 25 seconds, down from 40+ seconds in our previous model.

0s

Previous model

0s

Grok Imagine Video 1.5

### Behind the Scenes - Odyssey

Take a look behind the scenes at how David Thompson (@heavypulp) made a trailer worthy of the big screen entirely with Grok Imagine 1.5:

### Enhanced productivity

Alongside Imagine Video 1.5, we're rolling out new features over the next few days to improve your creative workflow:

#### Projects

Organize your work into Projects that appear on the left sidebar.

0:00 / 0:00

#### Multiple agents

Kick off multiple agents in parallel on your projects. Instead of waiting for one generation to finish before starting the next, you can run several prompts at once and let them work for you.

0:00 / 0:00

#### Search

Find any image or video you've made by searching your library — no more scrolling to track down that one clip.

0:00 / 0:00

### Now out of preview in the API

Imagine Video 1.5 is out of preview and generally available in the xAI API as grok-imagine-video-1.5. Give it a starting image, describe the motion, and choose your resolution and duration.

Copy

import os import xai_sdk client = xai_sdk.Client(api_key=os.getenv("XAI_API_KEY")) response = client.video.generate( prompt="Slow cinematic push-in as embers drift across the battlefield and the helmet's crest stirs in the wind", model="grok-imagine-video-1.5", image_url="https://your-host.com/helmet.jpg", duration=10, resolution="720p", ) print(response.url)

python

### Try it today

We can't wait to see what you make.

Open

Grok.com

Build

Imagine API

Open

Grok on iOS

Open

Grok on Android

© 2026 SpaceXAI LLC

Built with Grok

Products

ChatBuildImagineVoiceBotGrokipedia

Download

grok.comiOSAndroidGrok on X

Solutions

BusinessGovernmentCustomer SupportLegalSecurityUse Cases

Grok Bot

OverviewMarketplaceGuidesUse Cases

Developers

API OverviewPricingModelsConsoleChangelogDocsStatus

Enterprise

Contact SalesFAQsBAADPA

Company

AboutColossusCareersNewsContact

Trust

SafetySecurityPrivacy PortalSubprocessorsHelp Center

Legal

TermsEnterprise TermsPrivacyCookiesAUPBrand

Social

@SpaceXAI@grokDiscord

Built with Grok
