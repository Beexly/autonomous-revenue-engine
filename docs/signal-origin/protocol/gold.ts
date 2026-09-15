export function goldEmail(store: string, combo: string) {
  const name = store.trim() || "[Store]";
  const tags = combo.trim() || "Shopify's Facebook pixel and a Google tag";
  return (
    name +
    "'s product pages are firing " +
    tags +
    " on the same view. That is two origins. If they do not share one event_id, Ads Manager will count the view twice and the purchase once, or the other way around. I cannot see checkout from outside. I can send the outside view, free. If you want the written diagnostic after that, it is $250 and 48 hours.\n\nGarrett"
  );
}

export function kitHtml(input: {
  name: string;
  where: string;
  a: string;
  ap: string;
  b: string;
  bp: string;
  c: string;
  cp: string;
  phone: string;
}) {
  const digits = input.phone.replace(/\D/g, "") || "0000000000";
  const tel = "+1" + digits.slice(-10);
  const parts = [
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    "<title>" + esc(input.name) + "</title>",
    "<style>",
    ":root{--bg:#111;--fg:#f4f1ea;--muted:#9a9588;--line:#2c2b26;--btn:#f4f1ea}",
    "*{box-sizing:border-box}",
    "html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.45 ui-sans-serif,system-ui,sans-serif}",
    "main{min-height:100dvh;max-width:28rem;margin:0 auto;padding:2.5rem 1.25rem 6rem}",
    "h1{font-family:ui-serif,Georgia,serif;font-size:2rem;font-weight:600;letter-spacing:-.03em;margin:.6rem 0 0}",
    ".where{color:var(--muted);margin:.5rem 0 1.75rem}",
    "ul{list-style:none;padding:0;margin:0 0 1.75rem;border-top:1px solid var(--line)}",
    "li{padding:.9rem 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:1rem}",
    "li span{color:var(--muted)}",
    ".stick{position:fixed;left:0;right:0;bottom:0;padding:.75rem 1.25rem;background:var(--bg);border-top:1px solid var(--line);display:flex;gap:.5rem}",
    ".stick a{flex:1;text-align:center;text-decoration:none;font-weight:650;padding:.9rem .5rem;min-height:44px}",
    ".call{background:var(--btn);color:#111}",
    ".txt{border:1px solid var(--fg);color:var(--fg)}",
    "</style></head><body><main>",
    "<h1>" + esc(input.name) + "</h1>",
    '<p class="where">' + esc(input.where) + "</p><ul>",
    "<li>" + esc(input.a) + " <span>" + esc(input.ap) + "</span></li>",
    "<li>" + esc(input.b) + " <span>" + esc(input.bp) + "</span></li>",
    "<li>" + esc(input.c) + " <span>" + esc(input.cp) + "</span></li>",
    '</ul></main><div class="stick">',
    '<a class="call" href="tel:' + tel + '">Call</a>',
    '<a class="txt" href="sms:' + tel + '">Text a photo</a>',
    "</div></body></html>",
  ];
  return parts.join("");
}

function esc(s: string) {
  return s
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}
