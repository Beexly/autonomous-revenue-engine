
## 6. Live outreach staged 2026-08-25 (no invented Upwork IDs)

Upwork job search is JS-gated from here. Do not paste fake job IDs. After
you log in, paste 3 live URLs and I will rewrite A/B/C against their words
same sitting. Until then, send these against real public threads (comments
are public — type APPROVE HN before posting).

**Thread A — Shopify community, Purchase missing dedup params**
https://community.shopify.com/t/help-please-error-purchase-event-missing-some-deduplication-parameters-for-fb-pixel/400965/6
> Missing `event_id` on Purchase/ATC/InitiateCheckout/PageView is the usual
> double-count: Pixel and CAPI both fire, Meta cannot merge them. Shopify
> native F&I with data sharing = Maximum usually sends matching ids. If you
> also have theme.liquid or Additional Scripts pixel code, remove one path.
> Test Events: one test order, confirm browser + server rows share one
> `event_id`. If you want it done with a written before/after, I run a $250
> diagnostic (Events Manager read-only). Is CAPI coming from the F&I app or
> a second app?

**Thread B — Shopify community, Pixel "Connected" but Purchase not firing**
https://community.shopify.com/t/meta-pixel-shows-connected-in-shopify-but-purchase-event-is-not-firing-in-events-manager-ads-manager/588255
> "Connected" in Shopify does not mean Purchase is arriving. Check F&I data
> sharing is Maximum (that is what turns CAPI on), then Test Events with a
> real test order. Duplicate pixel in theme.liquid plus native F&I is the
> other common kill. I do a 15-point Events Manager diagnostic for $250 if
> you want the inventory + fix list in writing. Which checkout are you on
> (Shopify checkout vs a custom redirect)?

**Warm note (kit §3)** is still the fastest first-dollar send that is not
public. Twenty people from your phone tonight.
