# PLAN: content + strategy, Charcuterie Chick (three concepts)

Written 2026-09-17 from STATE.md, FACTS.md, QUOTE.md, GAPS.md and one rendered
pass over all fifteen live pages (five per concept, headless Chromium, 1366px).
Every price and claim below traces to FACTS.md and is marked `[F: section]`.
A claim I wanted and could not trace is marked `[NEEDS TRICIA]`. A caption a
builder must check against the actual photo is marked `[VERIFY PHOTO]`.
This is a plan. Nothing here is code. Builders execute it.

## 1. Decision snapshot

Three sites are live and pass QA. The words are the gap. All three speak
about Tricia in the third person and none uses her strongest facts: Houston's
largest charcuterie cart, 5.0 on The Knot and on WeddingWire, Best of Weddings
2026, elegance without the cost. None of it is on any page.

Concept 1, Garden Atelier, communicates calm refinement and wins the couple
comparing caterers on The Knot. Concept 2, Midnight Supper, communicates
evening drama and wins company parties and milestone birthdays. Concept 3,
The Gathering, communicates a fair price stated plainly and wins the local
host who wants a number before a conversation.

The client's choice answers one question: does she want to be found as a
wedding vendor, an evening caterer, or the neighborhood caterer with prices on
the page? The copy below moves all three toward that last answer. Her own
tagline says so.

## 2. Content strategy per concept

### 2.0 Shared blocks (used by all three; register notes per concept follow)

**S1 Proof block** (new, on index and story pages)
- "5.0 on The Knot from 13 reviews. Best of Weddings 2026." `[F: Identity, The Knot]`
- "5.0 on WeddingWire from 11 reviews. 100% would recommend." `[F: WeddingWire]`
- Small line: "Listed there as The Chick Goodies." `[F: Also used]`
- Quotes, names as published `[F: Reviews]`:
  - Lucas Willis: "The charcuterie board was fresh, well-balanced, and beautifully arranged."
  - Jacob Hernandez: "Beautifully balanced, incredibly fresh, and full of rich flavors."
  - Amina Khalid: "Wonderfully seasoned, warm, and comforting."
- Link text: "Read them on The Knot" and "Read them on WeddingWire", to the listing URLs in FACTS.md.
- Re-verify the two review counts against the listings on build day. FACTS.md verified them 2026-09-15.
- Never print a star total, an event count or an average spend. `[F: Not verified]`

**S2 Terms block** (menu page; replaces "BEFORE WE SET THE TABLE", "BEFORE THE FIRST BITE" and the two intro paragraphs on concept 3)
- "Every table runs 90 minutes. Need longer? $3 a person per half hour." `[F: Grazing tables]`
- "Tables are for 50 guests or more. The Holy Grail comes in two sizes, 75 or 150." `[F: Grazing tables]`
- "Setup is a flat $229 and tax is 18%. I'll confirm exactly what the tax applies to on your quote." `[F: Grazing tables; keeps the unconfirmed tax-base caveat in her words]`
- "These are my published prices, not your quote. Your quote comes from me, after we talk."

**S3 Choices block** (menu page; concept 1 hides it in accordions, concepts 2 and 3 do not have it)
- Heading: "Pick your sliders, dips and salads."
- "Eleven sliders: tuna salad, deviled chicken salad, chicken salad, BLT, turkey & gouda, Italian, ham & fontina, chicken & waffles, caprese, muffuletta, roasted vegetable." `[F: Choices]`
- "Eleven dips: Tricia's corn dip, tzatziki, bruschetta, ground mustard, cold spinach, fig jam, pico de gallo, 7-layer Mexican, guacamole, Texas caviar, French onion." `[F: Choices]`
- "Six salads: caprese, Mom's macaroni, Uncle Trey's potato, tomato & bleu cheese, cucumber, loaded baked potato." `[F: Choices]`
- "Four meats: turkey, ham, salami, pepperoni." `[F: Choices]`
- Closing line: "How many of each you get depends on the table. Substitutions, ask me." `[F: package-specific choices confirmed with Tricia]`
- Keep "Tricia's corn dip" as written inside the list. It is the menu name.

**S4 Carts, sweets and sips block** (menu page)
- "Taco Cart $26.95 · Carts $24.50 · Slider Menu $2.95" `[F: Menu prices]`
- "Cakes and Shakes $9.50 · Candy Bar Chick $5.00 · Zeppole Beignet Chick $4.50" `[F: Menu prices]`
- "Bloody Mary Chick $6.50 · Mimosa Chick $4.00" `[F: Menu prices]`
- "Easy order boards, the Charcuterie Chick board, apple pie and the full catering menu: ask me for a price." `[F: Price on request]`
- Do not add "each", "per person" or "per guest" to these eight prices. FACTS.md carries no unit for them. `[NEEDS TRICIA]`

**S5 Footer and NAP** (every page)
- "Charcuterie Chick · Tricia Holfelder · 11931 Brantley Haven Drive, Tomball, TX 77375" `[F: Identity]` Confirm she wants the street address printed. Her Shopify prints it today. `[NEEDS TRICIA]`
- "832-458-8180 · charcuteriechick@outlook.com · @charcuteriechickhtx" `[F: Identity]`
- "Tomball · The Woodlands · Spring · Conroe" `[F: Markets]`
- "English and Spanish spoken." `[F: Knot bio]`
- "A quote request, not a booking. Dates and prices are confirmed by Tricia." `[FACTS rules]`
- Never print hours. `[F: Not verified]`

**S6 FAQ** (quote page; concept 1 has three questions, concepts 2 and 3 have none; also feeds FAQPage structured data)
- "Is this a booking?" "No. It sends me a note. I check the date, we talk through the menu, and I send you a real quote. Nothing is held until we've agreed it."
- "How much does a grazing table cost?" "$24 to $38 a person depending on the table, for 50 guests or more. Add the $229 setup and 18% tax. The Holy Grail is $2,000 for 75 guests or $3,500 for 150." `[F: Grazing tables]`
- "We're fewer than 50. What then?" "Ask me about boards, the cart, sweets and sips. Boards are priced on request." `[F: Price on request]`
- "Where do you go?" "Tomball, The Woodlands, Spring and Conroe, and up to 100 miles out." `[F: Markets; The Knot travel 100 miles]`
- "Allergies?" "Tell me in the note. I'll tell you honestly what I can and can't do. I don't promise allergen-free preparation."

**S7 CTA band** (every page; replaces "Shall we gather?", "LET'S MAKE AN EVENING." and "There's a place for your people.")
- "Send me the date and the headcount. I'll take it from there."
- Button: "Get a quote". Secondary: "Call 832-458-8180". `[F: Identity]`

**S8 Captions and alt text.** Rule: name what is in the frame. No mood words.
- knot-hero.jpg: "Grazing table: tortilla chips, guacamole, pico de gallo, sliced meats, cheeses and fall flowers on a wood table." `[VERIFY PHOTO]`
- cart-640.jpg: "The cart, logo on the front, candy jars on top, set up outside before guests arrive." `[VERIFY PHOTO]`
- graze-02.jpg: "Charcuterie cups: cheese, salami, blackberries and pineapple on picks." `[VERIFY PHOTO]`
- sips-01.jpg: "Mimosa Chick: three glasses with orange, strawberry and a berry pick." `[VERIFY PHOTO]` `[F: Menu prices, item name]`
- tricia-662.jpg: "Tricia Holfelder, owner of Charcuterie Chick." `[F: Identity]`
- Every other file: the builder writes it from the photo. What food, what surface, what moment of the party. Provenance is in ASSETS.md.

### 2.1 Concept 1, Garden Atelier (sample-1-editorial)

**Identity.** The quiet wedding caterer. A light, serif, botanical site that reads like a good stationery suite.
**Wins.** The couple or planner comparing three caterers on The Knot for a Woodlands or Tomball wedding, and the shower or brunch host who wants pretty and calm.

**What the live copy gets wrong (from the pages).**
- The conceit is about the site, not about her. Nav says THE ATELIER and THE COLLECTION. Eyebrows say "01 / WELCOME TO THE GARDEN" and "THE COLLECTION / A STUDY IN TOGETHERNESS". There is no garden and no atelier. She has a cart and a kitchen in Tomball.
- Hero: "A table worth lingering at." then "Good food brings us together. A little artistry makes us stay." A mirrored pair that fits any caterer anywhere.
- Section headlines are abstractions: "Some occasions deserve more than a place setting.", "A reason to pause. A reason to pass the plate.", "Abundance, your way.", "A feast for the eyes.", "Pick your kind of plenty.", "The details are delicious.", "Good company. Beautiful evidence.", "Hospitality is a way of being.", "Your people. Our pleasure."
- The CTA on every page is "Shall we gather?" A caterer in Tomball does not ask that.
- The story page carries the most facts of the three (35 years, both sides of the kitchen door, scratch-made breads, jellies and jams, woman-owned, one party at a time) but it is written about her, not by her, and it never says Houston's largest charcuterie cart or English and Spanish.
- The menu page hides its best material. Eleven sliders, eleven dips and six salads sit in closed accordions under "The details are delicious."
- Gallery captions are moods: "Something to share", "A toast to together", "Company, beautifully kept".
- Nothing on the site says 5.0, 13 reviews or Best of Weddings 2026, and no review is quoted.
- QA note: in the headless capture the five table blocks on menu.html were hidden on load and the screenshot shows a blank band under the tab row. Builders verify they render without a scroll trigger.

**Voice target.** Tricia, unhurried, talking to a bride's mother at a Woodlands venue walkthrough. The serif stays. First person. Short sentences, real nouns.

**Rewrite map**

index.html
- Nav: THE ATELIER becomes "Home". THE MENU becomes "Menus and prices". THE COLLECTION becomes "Photos". MEET TRICIA becomes "About Tricia". ENQUIRE becomes "Get a quote". Filenames unchanged.
- Eyebrow (now "01 / WELCOME TO THE GARDEN"): "Charcuterie Chick · Tomball, Texas" `[F: Identity]`
- H1 (now "A table worth lingering at."):
  1. "Grazing tables, boards and Houston's largest charcuterie cart." `[F: Knot bio]`
  2. "Thirty-five years in restaurants. Now I set the table at your wedding." `[F: Experience]`
- Hero sub (now "Good food brings us together. A little artistry makes us stay."):
  1. "Elegance without the cost. Tomball, The Woodlands, Spring and Conroe." `[F: taglines; Markets]`
  2. "Breads, jellies and jams from scratch. Prices on the menu page." `[F: Knot bio]`
- Hero link (now "Find your gathering"): "See the menus and prices"
- Hero figcaption (now "Food for company. Made with care."): S8 caption for knot-hero.jpg `[VERIFY PHOTO]`
- Block 02 (now "A GENEROUS POINT OF VIEW" / "Some occasions deserve more than a place setting." / "A reason to pause. A reason to pass the plate."):
  - Eyebrow: "What I do"
  - H2: "I set it, I serve it for 90 minutes, you talk to your guests." `[F: 90 minutes]`
  - Body: "Grazing tables for 50 guests and up. The cart, boards, sweets and sips for everything else. I worked front of house and back of house for more than 35 years, so the food and the service come from the same person." `[F: 50-guest minimum; Experience]`
  - Link (now "The person behind the table"): "About Tricia"
- Block 03 (now "SOMETHING FOR YOUR TABLE" / "Abundance, your way." / "Start with a graze. Make it a gathering."):
  - Eyebrow: "The tables"
  - H2: "Five tables, from $24 a person." `[F: Graze Me, Craze Me]`
  - Body: "The smallest has two sliders, meat and cheese, seasonal fruit, hummus, almonds, two salads, roasted and raw vegetables and a dip. The Holy Grail has five cheeses, five meats and two sliders for 75 or 150 guests." `[F: Grazing tables]`
  - Link (now "Explore the published menu"): "Menus and prices"
- Block 04 (now "FROM OUR COLLECTION" / "A feast for the eyes." / "Real food. Real gatherings."):
  - Eyebrow: "Photos"
  - H2: "From parties I catered."
  - Body: "No stock photos. If it's on this site, it was on a table I set." `[STATE: her photos only]`
- Proof: one small serif line under the hero: "5.0 on The Knot · Best of Weddings 2026" `[F: The Knot]`, and S1 in full above the CTA band.
- CTA band (now "A LITTLE CONVERSATION. A BEAUTIFUL BEGINNING." / "Shall we gather?"): S7.
- Footer (now "FOOD & HOSPITALITY, BY TRICIA HOLFELDER." / "Enquiries, not confirmed bookings."): S5.

menu.html
- Eyebrow (now "THE MENU / AN INVITATION TO GRAZE"): "Menus and prices"
- H1 (now "Pick your kind of plenty."):
  1. "Five grazing tables. Prices included."
  2. "The tables, priced."
- Sub (now "Five ways to set the table. One very good reason to gather."): "Fifty guests or more. Ninety minutes of service. Setup and tax below." `[F: Grazing tables]`
- Table blocks: name, price and contents stay verbatim from FACTS.md. Eyebrow "Grazing table / 01" becomes "Table 01". One line from Tricia per table:
  - Graze Me, Craze Me, $24: "My starter table. It still has two sliders, two salads and a dip." `[F]`
  - Grazing Standard, $26: "The starter plus pasta salad, a second hummus, two dips and chips." `[F]`
  - Super Graze, $30: "Three sliders, three salads, three dips and the full vegetable spread." `[F]`
  - Grand Graze, $38: "Five sliders, four salads, three dips, and pudding cups to finish. Oreo, butterscotch or banana." `[F]`
  - Holy Grail of Grazing, $2,000 for 75 or $3,500 for 150: "The wedding table. Five cheeses, five meats, two sliders, guacamole and pico, fruit and chips." `[F]`
  - Per-table link (now "Enquire about this table"): "Quote this table"
- "BEFORE WE SET THE TABLE" paragraphs: S2.
- "A LITTLE MORE POSSIBILITY / Beyond the graze.": eyebrow "Carts, sweets and sips", H2 "Carts, sweets and sips.", body S4. Link (now "Ask about carts, boards & more"): "Ask me about boards and carts".
- "MAKE IT YOURS / The details are delicious.": S3, open by default, no accordions. Eyebrow "Your choices". H2 "Pick your sliders, dips and salads."

gallery.html
- Eyebrow (now "THE COLLECTION / A STUDY IN TOGETHERNESS"): "Photos"
- H1 (now "Good company. Beautiful evidence."):
  1. "Real tables. Real parties."
  2. "From parties I catered."
- Sub (now "An arrangement of moments from the client collection. Choose a photograph to take a closer look."): "Every photo here was taken at an event I catered. Click one to see it larger."
- Captions 01 to 08: S8 literal captions `[VERIFY PHOTO]`.
- Closing note (now "Arrangements are inspiration, not guarantees of package contents."): "Your table will follow the menu you pick, not a photo. Tell me which one you like and we'll talk about it."
- Link (now "Find a table for your occasion"): "Menus and prices"

story.html
- Eyebrow (now "MEET TRICIA / THE HEART OF THE TABLE"): "About Tricia"
- H1 (now "Hospitality is a way of being."):
  1. "Thirty-five years on both sides of the kitchen door." `[F: Experience]`
  2. "I'm Tricia. I've fed people for a living for more than 35 years." `[F: Experience]`
- Sign-off stays: "Tricia Holfelder, owner, Charcuterie Chick" `[F: Identity]`
- Portrait caption (now "A life in food. A love of bringing people together."): "Tricia Holfelder" `[F: Identity]`
- Block 2 (now "FROM THE KITCHEN TO YOUR COMPANY" / "It starts with food. It stays with people." / lede / two paragraphs):
  - Eyebrow: "How I got here"
  - H2: "Front of the house, then the back, then both." `[F: Experience]`
  - Body 1: "I spent more than 35 years in restaurants. I've worked the floor and I've worked the line. Charcuterie Chick is what I do with all of that." `[F: Experience]`
  - Body 2: "Now I run Houston's largest charcuterie cart. The breads, jellies and jams are made from scratch. I take one party at a time." `[F: Knot bio]`
  - Body 3: "Woman-owned. English and Spanish. Based in Tomball, cooking for The Woodlands, Spring and Conroe." `[F: Knot bio; Markets]`
  - Link (now "Tell Tricia what you have in mind"): "Get a quote"
- Block 3 (now "THE LITTLE THINGS, THOUGHTFULLY DONE" / "Pass the bread. Stay a while."): keep "Pass the bread. Stay a while." as the H2. It is the one line on this site that sounds like a person. Body (now "Scratch-made breads, jellies and jams are part of Tricia's story..."): "The bread on the table is mine. So are the jellies and the jams. Ask me what's in season." `[F: Knot bio; seasonal fruit]`
- S1 proof block after block 3.

enquire.html
- Eyebrow (now "ENQUIRE / LET'S BEGIN WITH HELLO"): "Get a quote"
- H1 (now "Your people. Our pleasure."):
  1. "Tell me about the party."
  2. "Date, headcount, venue. I'll do the rest of the asking."
- Sub (now "A date, an idea, a reason to gather. Tell Tricia a little about it."): "This writes a note you send me from your own email or phone. Nothing is booked here. I confirm the date, the menu and the price with you."
- Contact card H2 (now "A note to Tricia."): "Or just call." Body: "832-458-8180, or charcuteriechick@outlook.com. English or Spanish." `[F: Identity; Knot bio]`
- Form intro (now "Compose a note here. Nothing is stored or sent by this website."): "Nothing here is stored or sent until you send it."
- Field order and labels: section 5. Occasion options: "A wedding", "A party", "A work event", "Something else". Menu interest options: the five table names, then "Not sure, tell me what fits", then "Boards, the cart, sweets or sips".
- Allergy line: "Tell me about allergies in the note. I don't promise allergen-free preparation."
- Button (now "Prepare my enquiry"): "Write my note". After: "Your note is ready. Send it from your email or by text. Nothing has gone anywhere yet."
- "GOOD TO KNOW" FAQ: S6.

### 2.2 Concept 2, Midnight Supper (sample-2-after-dark)

**Identity.** The evening caterer. Dark, cinematic, big type, the cart as the centerpiece.
**Wins.** The office manager planning the holiday party, the 50th birthday, the rehearsal dinner. Anyone whose event starts after six.

**What the live copy gets wrong (from the pages).**
- The title tag is "Midnight Supper | The Chick Goodies". That is the concept's codename, not a search term.
- Theatre words carry the whole site: "ACT I — A GENEROUS BEGINNING", "ACT II — CHOOSE YOUR SCENE", "ADMIT ONE", "THE SUPPORTING CAST", "SCROLL TO SET THE SCENE", nav "The scenes", gallery "SIX FRAMES", quote page "LET'S SET THE SCENE." and "NO. 005". The metaphor belongs to the designer. A woman with a cart does not put on a play.
- Hero "GOOD FOOD. GREAT COMPANY." with "For the moments that deserve more than a meal." is the same mirrored pair as concept 3 with one adjective changed.
- Display headlines lean on an emphasis word with nothing behind it: "A TABLE THAT BRINGS YOU CLOSER.", "SMALL BITES. BIG ENTRANCE.", "AND A LITTLE EXTRA.", "WORTH A CLOSER LOOK.", "THE HEART OF THE PARTY.", "GOOD COMPANY STARTS WITH GOOD CARE.", "YOU BRING THE OCCASION.", "LET'S MAKE AN EVENING."
- The eyebrow "TOMBALL, TEXAS & THE SURROUNDING TABLE" does not mean anything.
- The menu page has no slider, dip or salad names. Its terms paragraph speaks as an engineer: "the planner explicitly assumes tax on food, setup and extra time."
- Gallery captions: "The gathering", "The details", "The occasion", "The sips", "The board", "The sweet finish".
- British spelling: "centrepiece" in the cart caption.
- No proof block, no review quote, no Best of Weddings.
- Worth keeping: the story page facts, the "Where Flavor Takes The Lead" blockquote, the estimate breakdown on the quote page, and "No stand-ins." on the gallery.

**Voice target.** Tricia at seven in the evening, cart already in the room, telling the host what is about to happen. Confident. Uppercase display type can stay when the words are facts.

**Rewrite map**

index.html
- Nav: "01 The table" becomes "Home", "02 The menus" becomes "Menus and prices", "03 The scenes" becomes "Photos", "04 Meet Tricia" becomes "About Tricia", "05 Enquire" becomes "Get a quote". The numerals can stay as a device.
- Eyebrow (now "TOMBALL, TEXAS & THE SURROUNDING TABLE"): "TOMBALL · THE WOODLANDS · SPRING · CONROE" `[F: Markets]`
- H1 (now "GOOD FOOD. GREAT COMPANY."):
  1. "HOUSTON'S LARGEST CHARCUTERIE CART." `[F: Knot bio]`
  2. "ELEGANCE WITHOUT THE COST." `[F: taglines]`
- Sub (now "For the moments that deserve more than a meal."):
  1. "Thirty-five years of restaurant cooking roll in with it." `[F: Experience]`
  2. "Grazing tables from $24 a person. The cart for the rest." `[F: Grazing tables]`
- Hero figcaption (now "01 / THE GATHERING Real food. Real occasions."): S8 caption for knot-hero.jpg `[VERIFY PHOTO]`
- Scroll note (now "SCROLL TO SET THE SCENE"): "MENUS AND PRICES BELOW"
- Block "ACT I" (now "A TABLE THAT BRINGS YOU CLOSER." and two paragraphs):
  - Eyebrow: "WHAT I BRING"
  - H2: "A TABLE FOR 50 OR MORE. THE CART FOR EVERYTHING ELSE." `[F: 50-guest minimum]`
  - Body 1: "Grazing tables run 90 minutes and I serve them the whole time. Breads, jellies and jams are made from scratch." `[F: 90 minutes; Knot bio]`
  - Body 2: "I worked front of house and back of house for more than 35 years. One party at a time." `[F: Experience; Knot bio]`
  - Link (now "Meet the woman behind the table"): "About Tricia"
- Cart figcaption (now "THE CART / A DIFFERENT KIND OF CENTREPIECE"): "THE CART. HOUSTON'S LARGEST." `[F: Knot bio]`
- Block "ACT II" (now "SMALL BITES. BIG ENTRANCE." with body and the ticket "Explore the menus / ADMIT ONE"):
  - Eyebrow: "THE MENUS"
  - H2: "PICK A TABLE. I'LL PRICE IT."
  - Body: "Five tables from $24 a person with 50 guests, up to the Holy Grail for 150. Taco cart, candy bar, Bloody Mary and mimosa stations on the side." `[F: Grazing tables; Menu prices]`
  - Ticket CTA: the face reads "Menus and prices", the stub reads "50 GUESTS MIN · 90 MIN" `[F]`. The ticket stays as a visual device only while it carries a fact.
  - Link (now "A look at the real thing"): "Photos from real parties"
- Proof: S1 as a band between the two blocks: "5.0 ON THE KNOT · 13 REVIEWS · BEST OF WEDDINGS 2026" and the Jacob Hernandez quote. `[F: The Knot; Reviews]`
- Closing band (now "YOUR OCCASION. HER TABLE." / "LET'S MAKE AN EVENING."): eyebrow "GET A QUOTE", link "SEND ME THE DATE AND THE HEADCOUNT."
- Fineprint (now "All enquiries are subject to confirmation; this is not a booking."): "A quote request, not a booking. I confirm every date and every price myself."

menu.html
- Eyebrow (now "THE EVENING / 02"): "MENUS AND PRICES / 02"
- H1 (now "SET THE TABLE."):
  1. "THE MENUS. WITH PRICES."
  2. "FIVE TABLES. PRICED."
- Sub (now "Five ways to graze. One very good place to start."): "Ninety minutes of service. Fifty guests or more. Setup and tax below." `[F: Grazing tables]`
- Table tabs keep the Holy Grail first. This concept sells up. One line from Tricia per table:
  - Holy Grail of Grazing: "THE WEDDING TABLE. Five cheeses, five meats, two sliders, guacamole and pico, fruit and chips. $2,000 for 75 guests, $3,500 for 150." `[F]`
  - Grand Graze: "Five sliders, four salads, three dips, pudding cups to finish. $38 a person." `[F]`
  - Super Graze: "Three sliders, three salads, three dips, the full vegetable spread. $30 a person." `[F]`
  - Grazing Standard: "The starter plus pasta salad, a second hummus, two dips and chips. $26 a person." `[F]`
  - Graze Me, Craze Me: "Two sliders, meat and cheese, fruit, hummus, two salads, vegetables, one dip. $24 a person." `[F]`
  - The line "Published food price · before setup, extra time & tax" stays. It is right. `[F]`
  - Per-table ticket (now "Make this your starting point"): "Price this table"
- "BEFORE THE FIRST BITE" paragraphs: S2, plus one line that replaces the planner sentence: "The estimate on the quote page adds 18% to food, setup and extra time. I confirm the exact tax on your quote." `[F: 18% tax; STATE calculator math]`
- "THE SUPPORTING CAST / AND A LITTLE EXTRA.": eyebrow "ON THE SIDE", H2 "CARTS, SWEETS AND SIPS.", body S4.
- S3 choices block after it. It is missing on this concept. H2 "PICK YOUR SLIDERS, DIPS AND SALADS."

gallery.html
- Eyebrow (now "THE EVENING / 03"): "PHOTOS / 03"
- H1 (now "WORTH A CLOSER LOOK."):
  1. "THE REAL THING."
  2. "FROM PARTIES I CATERED."
- Sub (now "No stand-ins. Food, tables and details from The Chick Goodies."): "No stand-ins, no stock. Every photo is from an event I catered."
- Filmstrip eyebrow (now "SIX FRAMES / A TASTE OF THE OCCASION"): "SIX PHOTOS"
- Captions FRAME 01 to 06: S8 literal captions, numbered 01 to 06 `[VERIFY PHOTO]`.
- Closing H2 (now "YOUR OCCASION. ITS OWN CHARACTER."): "YOURS WILL LOOK LIKE YOUR PARTY." Body (now "These are real arrangements, not a fixed template for your event..."): "The table follows the menu you pick, not a photo. Tell me what you liked here and I'll tell you what it takes." Ticket (now "Tell us what you're imagining"): "Get a quote"

story.html
- Eyebrow (now "THE EVENING / 04 — TRICIA HOLFELDER"): "ABOUT TRICIA / 04"
- H1 (now "THE HEART OF THE PARTY."):
  1. "35 YEARS. BOTH SIDES OF THE KITCHEN DOOR." `[F: Experience]`
  2. "I WORKED RESTAURANTS FOR 35 YEARS. NOW I WORK YOUR PARTY." `[F: Experience]`
- Lede (now "A lifetime in hospitality. One occasion at a time."): "One party at a time." `[F: Knot bio]`
- Portrait caption (now "TRICIA HOLFELDER / THE WOMAN BEHIND THE TABLE"): "TRICIA HOLFELDER, OWNER" `[F: Identity]`
- Block "MEET YOUR HOST" (now "GOOD COMPANY STARTS WITH GOOD CARE." and three paragraphs):
  - Eyebrow: "FROM TRICIA"
  - H2: "I KNOW WHAT A TABLE NEEDS BEFORE IT RUNS OUT."
  - Body 1: "Front of the house, back of the house, more than 35 years of it. I've seated the room and I've worked the line." `[F: Experience]`
  - Body 2: "Houston's largest charcuterie cart is mine. So are the breads, jellies and jams, all scratch-made." `[F: Knot bio]`
  - Body 3: "Woman-owned. English and Spanish. Tomball, The Woodlands, Spring and Conroe." `[F: Knot bio; Markets]`
  - Link (now "Start a conversation with Tricia"): "Get a quote"
- Second figcaption (now "FROM THE KITCHEN TO YOUR OCCASION"): S8 caption for catering-1000.jpg `[VERIFY PHOTO]`
- Blockquote stays: "Where Flavor Takes The Lead", attributed to Charcuterie Chick `[F: taglines]`. S1 proof lines under it.

enquire.html
- Eyebrow (now "THE EVENING / 05"): "GET A QUOTE / 05"
- H1 (now "YOU BRING THE OCCASION."):
  1. "PRICE YOUR TABLE."
  2. "SEE THE NUMBER BEFORE WE TALK."
- Sub (now "We'll start with the table. An invitation to talk, not a booking."): "Published prices only. Not a quote, not a booking. I confirm the date, the tax and the total with you."
- Card eyebrow (now "AN OCCASION IN THE MAKING" / "NO. 005"): "YOUR ESTIMATE". Drop NO. 005, or make the stub read "50 GUESTS MIN". `[F]`
- Card H2 (now "LET'S SET THE SCENE."): "START WITH A TABLE."
- Card body (now "Choose a starting point to explore published costs. Then write a draft for Tricia to review with you."): "Pick a table and a headcount. Then write me a note. I reply with a real quote."
- Contact line (now "Prefer to talk? Call or email directly. Availability, menu details and all final charges require confirmation."): "Prefer to talk? Call me. 832-458-8180." `[F: Identity]`
- Labels: "Your starting menu" becomes "Table". "Number of guests" becomes "Guests". "Extra service time" becomes "Extra time (90 minutes are included)". `[F: 90 minutes]`
- Estimate eyebrow (now "ESTIMATED PUBLISHED COSTS"): "ESTIMATE FROM PUBLISHED PRICES"
- Tax note (now "Estimate only. Published 18% tax is calculated on food + $229 setup + extra time here. The tax base is not confirmed..."): the reassurance lines in section 5.2.
- Details legend (now "A few details, if you like"): "A few details help." Notes placeholder (now "What are you imagining?"): "Venue, timing, allergies, anything I should know."
- Draft button (now "Prepare my enquiry draft"): "Write my note". Draft title (now "YOUR ENQUIRY. NOT SENT."): "YOUR NOTE. NOT SENT YET."
- S6 FAQ at the bottom. It is missing on this concept.

### 2.3 Concept 3, The Gathering (sample-3-studio)

**Identity.** The neighborhood caterer with the price on the page. Warm paper, cobalt type, the 3D table scene, the calculator up front.
**Wins.** The local family host, the repeat customer, the office admin with a budget. Anyone who wants a number before a phone call. It is the concept closest to her own tagline.

**What the live copy gets wrong (from the pages).**
- One word does the work of every noun. Nav "Gather", H1 "Good food. Better company.", "A reason to gather", "Made for your people", "Something to gather around", "THE ART OF COMING TOGETHER", "More to come together for.", "A different kind of gathering?", "A little heart. In every gathering.", "YOUR GATHERING STARTS HERE", "90-MINUTE GATHERING", footer "Food. Company. A reason to gather." Twenty-plus uses across five pages.
- "Not just something to eat. Something to gather around." is live on the home page. That construction argues with an objection nobody raised.
- Hero "Good food. Better company." and story "The food matters. So do the people." are the mirrored pairs. "A little occasion. A lot of goodness." is the same trick with an italic.
- The occasion picker is the best mechanic on any of the three sites and carries the weakest copy: "We're saying 'I do.'", "Just because.", "Out of office.", then "A wedding brings everyone to one table. Let's make it yours."
- The meta description is identical on all five pages.
- The menu page has no slider, dip or salad names and prints no cart, sweets or sips prices. Gallery captions are moods: "Good things on wheels", "Raise a glass", "Wish you were here".
- No proof block, no review quote, no Best of Weddings.
- Worth keeping: "Hi, I'm Tricia." (the only first-person line on any of the three sites), "Explore an estimate. Then talk to Tricia. No payment, no booking, no message sent automatically.", the calculator breakdown, the occasion picker mechanic, and "This is our table" as the per-table link.

**Voice target.** Tricia across the counter, quoting your party straight, a little playful. This is the concept where "Graze Me, Craze Me" and "Candy Bar Chick" sound at home. First person throughout.

**Rewrite map**

index.html
- Nav: "Gather" becomes "Home", "The menu" becomes "Menus and prices", "In good company" becomes "Photos", "Meet Tricia" becomes "About Tricia", "Make it yours" becomes "Get a quote".
- Eyebrow (now "TOMBALL, TEXAS / MADE FOR YOUR PEOPLE"): "CHARCUTERIE CHICK · TOMBALL, TEXAS" `[F: Identity]`
- H1 (now "Good food. Better company."):
  1. "Elegance without the cost." `[F: taglines]` If the design wants an italic word, it is "without".
  2. "Grazing tables from $24 a person." `[F: Grazing tables]`
- Sub (now "Grazing tables, charcuterie carts and boards. Made for your people, in Tomball, Texas."): "Grazing tables, Houston's largest charcuterie cart, boards, sweets and sips. Prices on the page. Breads, jellies and jams from scratch." `[F: Knot bio; Menu prices]`
- Buttons: "Plan your gathering" becomes "Get a quote". "Explore the menu" becomes "Menus and prices".
- Figcaption (now "Real food. A reason to gather."): S8 caption for knot-hero.jpg `[VERIFY PHOTO]`. Scene label (now "A place for everyone."): "5.0 on The Knot · Best of Weddings 2026" `[F: The Knot]`
- Kill line (now "Not just something to eat. Something to gather around."): "5.0 on WeddingWire. 100% would recommend." `[F: WeddingWire]`
- Scroll link (now "Pull up a chair"): "The tables"
- Block 01 (now "THE ART OF COMING TOGETHER" / "A little occasion. A lot of goodness." and body):
  - Eyebrow: "01 / THE TABLES"
  - H2: "Fifty guests and up, that's a table. Fewer, that's the cart or a board." `[F: 50-guest minimum; Price on request]`
  - Body: "Five tables from $24 to $38 a person, or the Holy Grail for 75 or 150 guests. Every table runs 90 minutes. Setup is $229, tax is 18%." `[F: Grazing tables]`
  - Link (now "Find your kind of feast"): "Menus and prices"
  - Figcaption (now "From Tricia's table, to yours."): S8 caption `[VERIFY PHOTO]`
- Block 02, the occasion picker (now "WHAT BRINGS YOU TOGETHER?" / "We're saying 'I do.'" / "Just because." / "Out of office."):
  - Eyebrow: "02 / WHAT'S THE PARTY?"
  - Buttons: "It's a wedding." / "It's a party." / "It's work."
  - Wedding copy (now "A wedding brings everyone to one table. Let's make it yours."): "The Holy Grail is the wedding table. Five cheeses, five meats, two sliders, guacamole and pico, for 75 or 150 guests. 5.0 on The Knot, Best of Weddings 2026." `[F: Grazing tables; The Knot]`
  - Party copy: "Fifty guests or more, pick a table from $24 a person. Fewer than that, ask me about boards and the cart. The Candy Bar Chick is $5.00." `[F: Grazing tables; Menu prices]`
  - Work copy: "Ninety minutes of service, set up before your guests walk in. Add the Bloody Mary Chick or the Mimosa Chick if it's a brunch." `[F: 90 minutes; setup fee; Menu prices]`
  - Button (now "Plan this gathering"): "Quote this party"
- Block 03 (now "THE WOMAN BEHIND THE WELCOME" / "Hi, I'm Tricia." / "More than 35 years in the restaurant industry. One party at a time."):
  - Keep the H2 "Hi, I'm Tricia."
  - Body: "More than 35 years in restaurants, front of the house and back. I run Houston's largest charcuterie cart and I take one party at a time. English and Spanish." `[F: Experience; Knot bio]`
  - Link (now "Come meet your host"): "More about me"
- Footer (now "There's a place for your people." / "Food. Company. A reason to gather."): S7 and S5. The footer invite line reads "Send me the date and the headcount."

menu.html
- Eyebrow (now "THE MENU / A LITTLE OF EVERYTHING"): "MENUS AND PRICES"
- H1 (now "More to come together for."):
  1. "The tables, with prices."
  2. "Five tables. Prices included."
- Sub lines (now "Start with the table. Make it your occasion." and the two fact paragraphs): S2.
- Table blocks stay. One line from Tricia per table, as in 2.1. Per-table link (now "This is our table"): keep it, on all five.
- "A different kind of gathering?" block: H2 "Under 50 guests?" Body: "Ask me about boards, the cart, sweets and sips. Boards are priced on request." `[F: Price on request]` Then S4 with the eight prices. This concept prints none of them today. Button (now "Let's make a plan"): "Get a quote"
- S3 choices block. It is missing on this concept.

gallery.html
- Eyebrow (now "REAL FOOD / REAL OCCASIONS"): "PHOTOS"
- H1 (now "Wish you were here."):
  1. "From parties I catered."
  2. "Real tables. No stock."
- Sub (now "A few moments from the table. Explore the photographs."): "Every photo was taken at an event I catered. Tap one to see it larger."
- Captions 01 to 06 (now "The gathering table", "A closer look", "Good things on wheels", "Raise a glass", "A generous welcome", "Something sweet"): S8 literal captions `[VERIFY PHOTO]`. The "View photograph" link becomes "See it larger".

story.html
- Eyebrow (now "YOUR HOST / TRICIA HOLFELDER"): "ABOUT TRICIA"
- H1 (now "A little heart. In every gathering."):
  1. "Hi, I'm Tricia." The index block links here, so the greeting is the H1.
  2. "Thirty-five years in restaurants. Both sides of the kitchen door." `[F: Experience]`
- Block (now "A WELCOME FROM TOMBALL, TEXAS" / "The food matters. So do the people." and three paragraphs):
  - Eyebrow: "TOMBALL, TEXAS"
  - H2: "I've worked the floor and I've worked the line." `[F: Experience]`
  - Body 1: "More than 35 years in restaurants, front of the house and back. Charcuterie Chick is the business I built out of all of it." `[F: Experience]`
  - Body 2: "The breads, jellies and jams are made from scratch. The cart is Houston's largest. I take one party at a time." `[F: Knot bio]`
  - Body 3: "Woman-owned. English and Spanish. Tomball, The Woodlands, Spring and Conroe." `[F: Knot bio; Markets]`
  - Button (now "Tell Tricia what you're planning"): "Get a quote"
- S1 proof block with all three review quotes. `[F: Reviews]`

enquire.html
- Eyebrow (now "YOUR GATHERING STARTS HERE"): "GET A QUOTE"
- H1 (now "Pull up a few chairs."):
  1. "Price your party."
  2. "See the number, then talk to me."
- Sub (now "Explore an estimate. Then talk to Tricia. No payment, no booking, no message sent automatically."): "Pick a table and a headcount and see the published total. Nothing is sent until you send it. Nothing is booked here."
- Labels: "THE OCCASION" becomes "What's the party?" with options "A wedding", "A party", "A work event", "Something else". "YOUR TABLE" becomes "Which table?". "HOW MANY PEOPLE?" becomes "How many guests?" with the hint (now "Holy Grail: published packages for 75 or 150 guests.") "The Holy Grail comes in two sizes, 75 or 150. The others start at 50." `[F: Grazing tables]` "YOUR DATE (OPTIONAL)" becomes "When? (optional)". "ANYTHING TRICIA SHOULD KNOW? (OPTIONAL)" becomes "Anything I should know? (optional)" with placeholder "Venue, timing, allergies."
- Estimate card eyebrow (now "90-MINUTE GATHERING / ESTIMATED TOTAL"): "ESTIMATE FROM PUBLISHED PRICES · 90 MINUTES" `[F: 90 minutes]`
- Fine print (now "Tax is estimated on food + setup; this basis needs confirmation. Extra time excluded. Published prices are subject to Tricia's final quote and availability."): the reassurance lines in section 5.2.
- Buttons: "Open email enquiry" becomes "Email me this". "Open text enquiry" becomes "Text me this". "Or call Tricia" becomes "Or call: 832-458-8180". `[F: Identity]`
- Prefilled email and text body, in the sender's voice: "Hi Tricia, I'd like a quote for a wedding. Table: Holy Grail of Grazing. Guests: 75. Date: to be decided. The estimate on your site came to $2,630.22 with the $229 setup and 18% tax on food and setup, extra time not included. Please confirm the date, the tax and the final quote. This is a quote request, not a booking." `[F: Grazing tables; STATE verified total]`
- S6 FAQ at the bottom.

## 3. Voice bible

Her verbatim material, the only ground truth for tone `[F: Identity]`:
- Claims: "Houston's largest charcuterie cart". "scratch-made breads, jellies and jams". "one party at a time". "woman-owned". "English and Spanish".
- Taglines: "elegance without the cost". "Where Flavor Takes The Lead". "Deliciously crafted food & beverages made with passion and purpose". Blog title: "Making high-quality catering affordable for every event".
- Menu names: Graze Me, Craze Me. Holy Grail of Grazing. Candy Bar Chick. Zeppole Beignet Chick. Bloody Mary Chick. Mimosa Chick. Cakes and Shakes. Tricia's corn dip. Mom's macaroni. Uncle Trey's potato.
- Her reviewers' words `[F: Reviews]`: fresh, well-balanced, beautifully arranged, incredibly fresh, full of rich flavors, wonderfully seasoned, warm, comforting.

What is not her voice: the "About Tricia Holfelder" paragraph on her Shopify ("seasoned professional known for her passion, precision, and unwavering commitment to hospitality", "began her culinary journey") is theme boilerplate. Do not copy it. Her voice lives in the menu names and the one-line claims above. She rhymes (Graze Me, Craze Me), she names dishes after family, she brags about size in one plain clause, and she talks about money without embarrassment.

Rules:
1. Tricia speaks. First person singular on every page. "I set the table." Third person only in the sign-off line and in structured data.
2. Say party. Her word is party ("one party at a time"). Also wedding, event, table, cart, board, guests. Not gathering, occasion, moment, celebration, experience.
3. Name the food. A sentence about food carries a menu item: muffuletta slider, Texas caviar, Mom's macaroni, mini pudding cups. Never "delicious", "flavorful", "abundance", "goodness". `[F: Choices]`
4. Numbers are the copy, not the fine print. 35 years. 50 guests. 90 minutes. $24. $229. Largest cart in Houston. Put them in headlines.
5. Say money once, plainly, early. "Elegance without the cost" is her position. A price hidden behind three screens of mood contradicts it.
6. Short sentences, one idea each. Most under twelve words. No semicolons. No em-dashes. Periods do the work.
7. No mirrors, no triads, no "not just". If a second sentence exists only to rhyme with the first, cut it.
8. No stage set. No acts, scenes, frames, ateliers, collections, studies, evidence, invitations. The site is about a cart and a table in Tomball.
9. Adjectives come from her reviews: fresh, balanced, seasoned, warm, comforting, beautifully arranged. Never curated, elevated, bespoke, artisanal, nestled. "Crafted" only inside her own tagline, quoted.
10. Captions say what is in the picture. "Charcuterie cups with salami, cheese and blackberries" beats "Something to share".
11. The reader is the host. "Your guests", "your date", "your budget", "your venue". Never "your people".
12. Keep every honesty line and say it like a person. "This isn't a booking. I confirm the date and the price with you myself." Not "The taxable base is not confirmed."
13. Spanish is a fact, printed once per page in the footer: "English and Spanish spoken." `[F: Knot bio]` First-person "Hablo español" only if she confirms she speaks it herself. `[NEEDS TRICIA]`
14. American spelling and Texas words. Center, color, neighborhood. "Get a quote", not "Enquire". Keep the enquire.html filenames, change the labels. Ampersand only in names she uses it in (turkey & gouda, ham & fontina), never in prose. No exclamation marks anywhere, even though her Knot listing uses one.
15. Read it aloud in a kitchen. If it sounds like a brochure, cut it. If it sounds like a woman telling you what she is bringing to your party, keep it.

## 4. SEO + GEO

### 4.1 Title tags and meta descriptions (155-character cap on metas; titles kept near 60)

Concept 1, Garden Atelier

| Page | Title | Meta description |
|---|---|---|
| index | Grazing Tables & Charcuterie Cart, Tomball TX \| Charcuterie Chick | Grazing tables from $24 a person and Houston's largest charcuterie cart. Tricia Holfelder, 35 years in restaurants. Tomball, The Woodlands, Spring, Conroe. |
| menu | Grazing Table Menus & Prices \| Charcuterie Chick, Tomball | Five grazing tables, $24 to $38 a person, 50-guest minimum, 90 minutes of service. Holy Grail for 75 or 150 guests. Carts, sweets and sips priced too. |
| gallery | Photos from Real Events \| Charcuterie Chick, The Woodlands | Grazing tables, boards, the cart and mimosas from parties Tricia catered around Tomball and The Woodlands. Every photo is from a real event, none is stock. |
| story | About Tricia Holfelder \| Charcuterie Chick, Tomball TX | Tricia Holfelder, front and back of house for more than 35 years. Woman-owned. Scratch-made breads, jellies and jams. English and Spanish. Tomball, TX. |
| enquire | Get a Grazing Table Quote \| Charcuterie Chick, Tomball TX | Send Tricia your date, headcount and venue for a grazing table or charcuterie cart quote in Tomball, The Woodlands, Spring or Conroe. Not a booking. |

Concept 2, Midnight Supper

| Page | Title | Meta description |
|---|---|---|
| index | Houston's Largest Charcuterie Cart \| Charcuterie Chick, Tomball | Evening parties, weddings and company events. Houston's largest charcuterie cart and grazing tables from $24 a person. Tricia Holfelder, Tomball TX. |
| menu | Grazing Table Prices, 50 to 150 Guests \| Charcuterie Chick | Holy Grail of Grazing, $2,000 for 75 guests or $3,500 for 150. Four more tables from $24 a person. Taco cart, candy bar, Bloody Mary and mimosa stations. |
| gallery | Event Photos \| Charcuterie Chick, Spring & The Woodlands TX | Real grazing tables and the cart at parties Tricia catered in Tomball, Spring and The Woodlands. No stock photography, no stand-ins. |
| story | Tricia Holfelder, 35 Years in Restaurants \| Charcuterie Chick | Front and back of house, more than 35 years. Houston's largest charcuterie cart, scratch-made breads, jellies and jams, one party at a time. Tomball TX. |
| enquire | Price a Grazing Table \| Charcuterie Chick, Tomball TX | Pick a table and a headcount to see a published-price estimate, then send Tricia a note. Estimates only. No booking, no date held. Final quote from Tricia. |

Concept 3, The Gathering

| Page | Title | Meta description |
|---|---|---|
| index | Elegance Without the Cost \| Charcuterie Chick, Tomball TX | Grazing tables from $24 a person, Houston's largest charcuterie cart, prices on the page. Tricia Holfelder, 35 years in restaurants. Tomball, TX. |
| menu | Menus & Prices \| Charcuterie Chick, Tomball & Conroe TX | Five grazing tables from $24 to $38 a person, 50-guest minimum, $229 setup, 18% tax. Holy Grail for 75 or 150. Carts, sweets and sips priced. |
| gallery | Real Party Photos \| Charcuterie Chick, Tomball TX | Grazing tables, boards, the cart and sips from parties Tricia catered around Tomball, Spring and Conroe. Every photo is from a real event. |
| story | Hi, I'm Tricia \| Charcuterie Chick, Tomball TX | Tricia Holfelder, 35 years in restaurants, front and back of house. Woman-owned. Scratch-made breads, jellies and jams. English and Spanish. Tomball TX. |
| enquire | Price Your Party \| Charcuterie Chick, Tomball TX | See a published-price estimate for a grazing table for 50 to 150 guests, then send Tricia the date and headcount. No payment, no booking, no date held. |

All figures in these tables trace to FACTS.md (Grazing tables, Identity, The Knot bio).

### 4.2 Local keyword plan (Tomball, The Woodlands, Spring, Conroe)

- Terms people type: "grazing table Tomball", "charcuterie catering Tomball TX", "charcuterie cart Houston", "grazing table The Woodlands", "wedding charcuterie The Woodlands", "charcuterie board catering Spring TX", "grazing table Conroe", "taco cart catering Tomball", "mimosa bar catering The Woodlands", "candy bar catering Houston".
- Page ownership. index owns "charcuterie catering Tomball TX" and "grazing tables". menu owns "grazing table prices" and "charcuterie cart Houston". gallery owns "wedding charcuterie table The Woodlands" (image search; literal alt text is the lever). story owns "Tricia Holfelder", "Charcuterie Chick" and "woman-owned caterer Tomball". enquire owns "grazing table quote" and "charcuterie catering quote Tomball".
- City rotation. One city per title. Index, story and enquire carry Tomball. Menu and gallery carry a second city, varied per concept as in the tables above. All four cities appear in the footer NAP line and in the FAQ answer "Where do you go?". No city lists in any H1 or H2.
- Houston. Her own claim is Houston-scale. Use "Houston" in the cart line and nowhere else in headlines, so the site does not read as a Houston business with a Tomball address.
- No city pages. No new pages of any kind.
- Business name. "Charcuterie Chick" in titles and prose, because the domain is charcuteriechick.ai. "The Chick Goodies" stays in the wordmark and in the proof block ("listed as The Chick Goodies on The Knot and WeddingWire") so the listings and the site corroborate each other. `[F: Identity; Also used]`

### 4.3 GEO (answer engines: Google AI Overviews, ChatGPT, Gemini, Perplexity)

- Answer engines quote plain declarative sentences. The first 100 words of each page state who, what, where and the price floor as plain sentences. The rewrite maps do this.
- The FAQ answers (S6) are the literal answer to a literal question. Mirror them word for word in FAQPage structured data.
- NAP identical to the character across the site, The Knot, WeddingWire, Google Business Profile and Instagram. One phone string, one email, one address. `[F: Identity]`
- Menus as text, never as images. The five tables, the eight priced items and the choices lists are crawlable text.
- Proof with a source link. "5.0 on The Knot, 13 reviews" sits next to a link to the listing so an engine can corroborate it.
- Never emit hours or coordinates until verified. An engine will state a wrong opening time as fact. `[F: Not verified]`
- `sameAs` to The Knot, WeddingWire and Instagram URLs from FACTS.md.

### 4.4 Structured data (spec for the coding agent; one JSON-LD block per page; no code in this document)

- Every page: type FoodEstablishment (a LocalBusiness subtype). `name` "Charcuterie Chick". `alternateName` "The Chick Goodies". `founder` a Person, Tricia Holfelder. `telephone`, `email`, `address` as PostalAddress from FACTS.md. `areaServed` four City entries: Tomball, The Woodlands, Spring, Conroe. `priceRange` "$24 to $38 per guest". `knowsLanguage` en and es. `sameAs` the three listing URLs. `image` her own photo. `url` the deployed host. `[F: Identity; Markets; Grazing tables; Knot bio]`
- Every page: `makesOffer` with one Offer per grazing table. Per-person tables: `price` 24, 26, 30, 38, `priceCurrency` USD, `priceSpecification` UnitPriceSpecification with `unitText` "per person", `eligibleQuantity` QuantitativeValue `minValue` 50, `unitText` "guests". Holy Grail: two Offers, price 2000 with eligibleQuantity value 75, and price 3500 with value 150. One Offer "Setup fee" price 229. One Offer "Extra service time" price 3, unitText "per person per half hour". `valueAddedTaxIncluded` false on every Offer. `[F: Grazing tables]`
- menu.html: `hasMenu` a Menu with MenuSection "Grazing tables" (five MenuItems, each with its Offer as above), "Carts and stations" (three items, prices from FACTS.md), "Sweets" (three), "Sips" (two), and a section "Price on request" whose four items carry no `offers` property at all. Never a price of 0. `[F: Menu prices; STATE hard rule]`
- enquire.html: FAQPage with the S6 questions and answers verbatim.
- story.html: Person Tricia Holfelder, `jobTitle` "Owner", `worksFor` the business, `knowsLanguage` en and es. `[F: Identity; Knot bio]`
- Omit on every page: `openingHours`, `openingHoursSpecification`, `geo`, `aggregateRating`, `review`. Hours and coordinates are unverified. Ratings and reviews from third-party sites are not allowed in LocalBusiness markup and Google does not show self-serving ratings. Print the Knot and WeddingWire numbers as visible text with a link instead. `[F: Not verified]`
- `potentialAction`: none. No ReserveAction, no OrderAction. The site does not book. `[FACTS rules]`
- Sitemap: five URLs per site, absolute on the deployed host (or the final domain once chosen), `lastmod` from git, no hreflang. One language. Canonical on every page. OG title, description and image on every page. All fifteen pages currently ship without OG tags.

## 5. Conversion strategy

### 5.1 What the quote flow asks, in this order, and why

1. Date. First, because it is the first thing she checks, and a host without a date is not ready to price. Optional, with "not sure yet" allowed.
2. Guest count. Second, because it routes: 50 and up means a table, under 50 means boards and the cart, 75 or 150 means the Holy Grail sizes. `[F: Grazing tables]`
3. What's the party. Wedding, party, work event, something else. Sets the default table (wedding defaults to the Holy Grail) and the tone of her reply.
4. Table, or "Not sure, tell me what fits". Pre-filled by the ?menu=, ?table= and ?occasion= links that already exist. `[STATE]`
5. Where. Town or venue. She travels, and distance goes into her quote. `[F: The Knot, travel 100 miles]`
6. Anything I should know. Allergies, timing, extra time, the cart, sips.
7. Name. Last, and optional for email because the email carries it. Written into the text draft.

Nothing else. No phone-number field (they text or email her from their own phone). No budget field (her prices are on the page). No "how did you hear about us".

### 5.2 Reassurance copy next to the calculator (concepts 2 and 3; concept 1 has no calculator, use the first three lines beside the form)

- "This number comes from my published prices. It isn't your quote and it doesn't hold a date."
- "In it: food for your guests, the $229 setup, and 18% tax on both." `[F: Grazing tables; STATE calculator math]`
- "Not in it: extra time at $3 a person per half hour, the cart, sweets, sips or boards." `[F: Grazing tables]`
- "Next: you send me the note. I check the date and reply with a real quote."
- "Tables need 50 guests. The Holy Grail is 75 or 150 exactly." `[F: Grazing tables]`
- For the builders' sanity check only, not for the page: the Holy Grail for 75 shows $2,630.22. `[STATE verified total]`

### 5.3 What must not be claimed, on any concept, anywhere

- No booking, reservation, hold, or "we'll save your date". No "check availability". No calendar widget. `[FACTS rules; STATE]`
- No response-time promise such as "within 24 hours".
- No "from $500" or "starting at $500". That is The Knot's field, not her menu. No "couples spend $2,350". `[F: The Knot fields, do not print]`
- No "$150 per person for stations". That figure sits in her WeddingWire FAQ and contradicts the published menu. `[NEEDS TRICIA to correct the listing]`
- No star totals, event counts, years beyond 35, or "hundreds of weddings". `[F: Not verified]`
- No hours. No map pin beyond the street address. `[F: Not verified]`
- No units on the eight cart, sweets and sips prices. `[NEEDS TRICIA]`
- No dietary promises: vegan, vegetarian, gluten-free, halal, allergen-free. Her WeddingWire listing claims some of these. None is in FACTS.md. `[NEEDS TRICIA]`
- No "one event per day", "delivery and cleanup included", "licensed and insured", or a team size. `[NEEDS TRICIA]`
- Never $0.00. Never "25+ years". Never "Gallery Title". `[STATE hard rules]`
- No Beexly, no pitch copy, no $150 or $600 anywhere on her pages. `[STATE]`

## 6. Executed handoff

Both builders: static HTML, CSS and JS only. No Tailwind (no concept has it), no React, no build step, no new dependencies, no WebGL on the 480px photos. Edit only inside `clients/chick-goodies/samples/`. Run the QA commands in STATE.md before every deploy. `[STATE constraints]`

### 6.1 GLM-5.2 (UI/UX): blocks to realize

All three concepts:
- S1 proof block as a designed element on index and story: the numbers as type, the quotes as pull-quotes, names as published, links to the listings.
- "Hi, I'm Tricia" first-person block with tricia-662.jpg on the index. The story page opens with the same greeting.
- S3 choices block visible by default. On concept 1 it becomes a typographic feature (the names are the design). On concepts 2 and 3 it is a new block on the menu page.
- S8 literal captions on every photo.
- Nav relabel on every page: Home / Menus and prices / Photos / About Tricia / Get a quote. Filenames unchanged.
- S7 CTA band and S5 footer on every page.
- S6 FAQ on the quote page (exists on concept 1, new on 2 and 3).
- Photo work under the owner's rule: restore, clean, upscale and recompose her own files only. Priorities: knot-hero.jpg (hero on all three), cart-640.jpg (hero candidate on concept 2, 640×480 today), tricia-662.jpg (portrait on every story page). Never generate food. Never use the four quarantined hashes or her Shopify stock files. Originals stay in git history. `[STATE; ASSETS]`

Concept 1:
- Replace the garden and atelier words everywhere: nav, eyebrows, section labels. Keep the serif, the botanical rules and the light palette.
- Menu tables open on load. The headless capture showed all five hidden and a blank band under the tab row.
- The proof line under the hero as one small serif line.
- "Pass the bread. Stay a while." keeps its place on the story page.

Concept 2:
- Remove the ACT, ADMIT ONE, SUPPORTING CAST, SCENES, FRAME and NO. 005 labels. The ticket motif stays only where it carries a fact (stub: "50 GUESTS MIN · 90 MIN").
- Hero becomes the fact: "HOUSTON'S LARGEST CHARCUTERIE CART." with the restored cart photo, or "ELEGANCE WITHOUT THE COST." with knot-hero.jpg.
- Uppercase display with one emphasis word stays only when the emphasized word is the fact: LARGEST, 35 YEARS, $24.
- Keep the SVG watermark digits. `[STATE: do not revert]`
- Replace "centrepiece" and any other British spelling.

Concept 3:
- Hero swap to "Elegance without the cost." Keep the 3D table scene and the paper and cobalt palette.
- Remove every use of "gather" as a noun, verb or nav label. The 3D scene is design and stays.
- Occasion picker: three buttons "It's a wedding." / "It's a party." / "It's work." with the copy in 2.3.
- Proof line under the hero where "Not just something to eat..." sits now.
- Calculator: the 5.2 reassurance lines replace the fine print. Labels per 2.3.

### 6.2 Core-coding agent (Hermes / DeepSeek Flash): mechanical tasks, in this order

1. Copy swaps from section 2, exact strings, per concept per page. Where two options are given, the first is the default. Do not paraphrase.
2. Title and meta swaps from 4.1. This fixes concept 3's duplicated meta description.
3. Canonical and OG tags (title, description, image as her own photo, type website) on all fifteen pages. No page has OG tags today.
4. JSON-LD per 4.4. Omit hours, geo, ratings, reviews, and any Offer with a price of 0. Validate with Google's Rich Results test before deploy.
5. Sitemap: five URLs each, lastmod, no hreflang. robots.txt points at it.
6. Alt-text pass per S8: literal, food named, no mood words. ASSETS.md gives provenance. `[VERIFY PHOTO]` against the actual file.
7. Keep the ?menu=, ?table= and ?occasion= prefills working after the label changes. Values unchanged, labels changed.
8. S6 FAQ markup on all three quote pages, with the FAQPage JSON-LD matching it word for word.
9. S5 footer on every page. "English and Spanish spoken." as text. No language switch, no hreflang, no second-language pages.
10. QA items from this pass: concept 1 menu tables visible without a scroll trigger (hidden in the headless capture); concepts 1 and 2 footer market line renders a separator between "The Woodlands" and "Spring" (the text capture showed "The Woodlands Spring").
11. Run the QA commands in STATE.md before every deploy. Push after every cycle.
12. Nothing on her Shopify changes. `[QUOTE terms]`

## 7. Kill list

Each entry: the pattern, where it is live (concept number), why it reads synthetic, what replaces it.

1. **Mirrored pair.** "Good food. Better company." (3), "GOOD FOOD. GREAT COMPANY." (2), "Good company. Beautiful evidence." (1), "Your people. Our pleasure." (1), "SMALL BITES. BIG ENTRANCE." (2). The second half exists to echo the first, not to say anything. Language models produce these by the yard because they scan as headlines. Nobody who cooks talks like this. Replace with a fact: "Elegance without the cost." or "Houston's largest charcuterie cart."
2. **"Made for" plus an abstract noun.** "Made for your people" (3), "Made to gather" (1, hidden tagline). Passive and subjectless. It could be a candle brand. Replace with what is actually made: "Breads, jellies and jams, made from scratch."
3. **"Not just X. Y."** "Not just something to eat. Something to gather around." (3). It argues with an objection nobody made. Replace with the proof line: "5.0 on The Knot. Best of Weddings 2026."
4. **Abstract triad.** "Food. Company. A reason to gather." (3 footer), "Real food. Real gatherings." (1), "Real food. Real occasions." (2). Three nouns pretending to be a sentence. Rhythm without content. Replace with the NAP line or one sentence with a number.
5. **Anaphora pair.** "A reason to pause. A reason to pass the plate." (1), "It starts with food. It stays with people." (1), "The food matters. So do the people." (3), "A little occasion. A lot of goodness." (3). Repetition standing in for a thought. Replace with one first-person sentence with a number: "I set it, I serve it for 90 minutes, you talk to your guests."
6. **Stage and gallery metaphor.** THE ATELIER, THE COLLECTION, A STUDY IN TOGETHERNESS (1). ACT I, ACT II, ADMIT ONE, THE SUPPORTING CAST, THE SCENES, SIX FRAMES, SET THE SCENE, NO. 005 (2). The conceit belongs to the template and tells the reader about the designer. Replace with plain labels: Menus and prices, Photos, About Tricia, Get a quote.
7. **Invitation-speak CTA.** "Shall we gather?" (1), "LET'S MAKE AN EVENING." (2), "There's a place for your people." (3), "Find your gathering" (1), "Pull up a chair" (3), "Tell us what you're imagining" (2). Coy, and silent about what happens next. Replace with the ask: "Send me the date and the headcount." Button: "Get a quote".
8. **Mood caption.** "Something to share", "A toast to together", "Company, beautifully kept" (1). "The gathering", "The sweet finish" (2). "Good things on wheels", "Raise a glass", "Wish you were here" (3). A caption that fits any photo is a caption for no photo. Replace with what is in the frame.
9. **Abstract-noun headline.** "Abundance, your way.", "Pick your kind of plenty.", "The details are delicious.", "Hospitality is a way of being." (1). "A little heart. In every gathering.", "More to come together for." (3). Plenty, abundance, goodness and heart are the vocabulary of stock copy. Replace with a menu fact: "Five tables, from $24 a person."
10. **"Your people", "your occasion", "the moments you make together".** All three. Template intimacy. It presumes a closeness the reader has not offered. Replace with "your guests", "your wedding", "your party".
11. **Third-person bio.** "Tricia brings more than 35 years...", "Tricia's experience spans...", "Her approach is personal". All three. It is her website. A bio in the third person on your own site reads as written by an agency. Replace with first person.
12. **Engineer caveat in client copy.** "The taxable base is not confirmed." (1, 2). "the planner explicitly assumes tax on food, setup and extra time" (2). "this basis needs confirmation" (3). True, necessary, and phrased for a code reviewer. Replace with "I'll confirm exactly what the tax applies to on your quote."
13. **Emphasis word with nothing behind it.** "A TABLE THAT BRINGS YOU CLOSER.", "AND A LITTLE EXTRA.", "WORTH A CLOSER LOOK." (2). Italic "lot", "Better company.", "were here." (3). The typographic trick lands the eye on a word that carries no information. Replace by emphasizing the fact: LARGEST, 35 YEARS, $24.
14. **"Enquire" and "enquiry".** All three. British, and it names the form instead of the outcome. Replace with "Get a quote" and "Quote this table". Filenames stay.
15. **"Gather" as the universal verb.** Concept 3, twenty-plus uses. A crutch word. The reader stops hearing it by the third use. Replace with party, table, wedding, event, guests.

## Appendix A. Seen on her listings on 2026-09-17, not in FACTS.md. Do not print until added.

From The Knot (search snippet of the listing, which blocks direct fetches):
- Headline under the name: "Charcuterie Cart, Tables, & Exquisite Catering".
- "The Chick Goodies offers flexible and budget-friendly menus for weddings in Tomball, TX."
- "with her team, it's your budget, your taste, your way."
- The cart "doubles as a taco and candy cart as well".
- Review fragments: "We used Tricia and her team for my mother's 80th birthday." and "We've seen her charcuterie cart at another event."

From WeddingWire (vendor description and FAQ):
- "works only one event per day".
- Dietary: "vegan, vegetarian, gluten-free, and halal". Cuisine: "BBQ, Italian, Asian, or American". Services: "Delivery, Set Up, Clean Up".
- "$150 per person for stations" in the FAQ. It contradicts the published menu.
- One sentence in the description calls the business "The Catering Chick". A listing error for Tricia to fix.
- Reviewers as published: Abigail, Crystal, Lauren, Tiffni, Darrell, Stacey, Shelby. One calls her "Trish". `[NEEDS TRICIA: does she go by Trish?]`

Action for Garrett: ask Tricia which of these are true today, add the confirmed ones to FACTS.md, and have her fix the two listing errors. "Your budget, your taste, your way" is the best line she has written and belongs on the site the day it is in FACTS.md.

## 8. Design bar (added 2026-09-17, second pass)

The owner's bar is EMP, Noma and Floema: restaurant sites where one photograph carries the screen, one typeface family does all the work, the air is the design, and the reservation is the only loud thing. The 48-site corpus Garrett supplied (Lusion, Unseen, Locomotive, North Kingdom and the rest) is a motion-agency corpus. It is used here for discipline and pacing, never for effects. Tokens already extracted from EMP and Noma live in `docs/research/emp-noma/PLAN.md` and still apply.

### 8.1 Rules (each one is testable)

1. One display face and one text face per concept. No third family anywhere. The italic emphasis word is allowed once per screen.
2. One accent color per concept. Backgrounds are fields, not accents. A second accent is a bug.
3. Photographs are objects. `object-fit: contain` on a void, at or under native pixels, in a frame that belongs to the grid. Never absolutely positioned over copy. Never cover-stretched to fill a viewport. Never upscaled until the restore pass under the owner's photo rule.
4. One spacing scale per concept, applied to every section. Desktop 120/80/48, mobile 72/48/32, or the concept's own scale used everywhere. No section chooses its own padding.
5. Air, not objects. The hero holds one headline, one line, one primary action, one photograph. Rings, threads, botanical glyphs, rotated labels and 3D plates are allowed only where they never touch text or a photo at 360, 390, 768, 1024, 1440 and 1920. If a decoration touches anything at any width, it goes.
6. Hairlines at 0.67 to 1px. No box-shadow, no gradients, no glass, no grain, no marquee, no custom cursor, no Ken Burns. (Owner verdicts in HANDOFF.md and DESIGN_REFS.md.)
7. Chrome small and quiet. Nav 14 to 16px, one row at 390 or a menu button. One button style per concept. No candy buttons.
8. The number is the design. On the quote page the total is set in the display face and the breakdown is small.
9. Numbered sequencing 01 to 05 (Floema) only where the concept already uses it (2 and 3), in one numeral style across the site.
10. Motion: one reveal per section, opacity plus a translate of 12px or less, 400ms or less, `prefers-reduced-motion` honored. Nothing else moves on scroll. No parallax on photos.
11. Captions are literal (S8) and set in one style per concept.
12. Type sizes come from a scale, not from the element. Body copy measures 60 to 75 characters per line.
13. Every page at every width: no horizontal scroll, nothing clipped, nothing overlapping, every button reachable, axe WCAG AA clean.

### 8.2 From the corpus: take and refuse

Take: the hero states the proposition before any effect; all content stays in semantic HTML; mobile and reduced-motion degrade cleanly; payload and frame rate are measured, not assumed; at most one signature element, and only in the hero.

Refuse for this quote: WebGL heroes, shaders, particle scenes and food-film video. There is no footage, her photos top out at 945px, and STATE.md bans WebGL on 480px photos. Adding any of it would be the AI feel the client named in BRIEF.md. Revisit on the winner only, with original photography in hand.

### 8.3 What each hero must be

- Concept 1 (EMP register). The photograph as an object with air around it. Headline in the serif at display size, set in three lines in a copy column wide enough for seven words a line. The pistachio eyebrow. One link. The proof line on its own row with 24px above it. No ring, no thread, no rotated label in the hero.
- Concept 2 (Noma dark). Already closest to the bar. Keep the composition. Fix the caption leftovers only.
- Concept 3 (Floema plus The Platter). A two-column hero grid: copy left, about 55%; photo right, about 45%, as a framed in-flow object. The 3D table scene sits under the photo column only, never under copy or buttons, and drops below the action row or hides at 768px and under. Both proof lines upright in the copy column under the sub copy.

## 9. Correction pass: verified defects on the live builds (2026-09-17 evening)

Method: all 15 live pages rendered in headless Chromium at 390, 1440 and 1920, copy dumped in DOM order, screenshots inspected, assets checked for HTTP 200. Only defects that reproduce are listed. Garrett's two screenshots (sample 1 gallery, sample 3 home at about 2000px) match what is below.

### 9.1 Cross-site

- C1. Meta descriptions from 4.1 were not applied on any page. Repo and live carry the old text on all 15 pages, and sample 3 still repeats one meta across its five pages. The new text went into `og:description` instead. Fix: replace the `description` meta on all 15 pages from the 4.1 tables. Sample 3's tag has a different attribute order, so match by attribute name, not by string.
- C2. Kill-list copy still live. Sample 1: all eight gallery captions ("Gathered around the table", "The small details", "An occasion on wheels", "Room for a little more", "Something to share", "A toast to together", "A sweet ending", "Company, beautifully kept"), the hero label "THE ART OF GATHERING · TEXAS", the hero caption "Food for company. Made with care.", the oval caption "From a cart to a full table." Sample 2: the hero caption "01 / THE GATHERING Real food. Real occasions." and the cart caption with "CENTREPIECE". Sample 3: the hero caption "Real food. A reason to gather.", the six gallery captions ("The gathering table", "A closer look", "Good things on wheels", "Raise a glass", "A generous welcome", "Something sweet"), and "gather" 14 times plus "occasion" 8 times across the five pages, mostly in captions, labels and option text. Fix: S8 captions everywhere, then a string sweep per kill-list item 15.
- C3. "enquiry" survives in visible text (sample 1 twice, sample 2 once, sample 3 twice). Fix per voice rule 14.
- C4. The builders omitted the street address from the footer pending approval. Correct. It stays out until Tricia confirms.

### 9.2 Sample 1, Garden Atelier (the most work)

- S1-1. Page intros have no horizontal padding. `.page-intro` sets only `padding-top`, so the gallery and menu H1s sit at x=0 at 1440 and 1920, and at about 2000px the eyebrow clips to "HOTOS". Fix: put every page intro inside the same centered container (max-width and side padding) as `.content-block`.
- S1-2. The gallery wall collapses. `.specimen-wall` is a 12-track grid; wide, tall and landscape figures span 8, 5 and 9 tracks, but `.specimen.oval` has no span, so both ovals fall into one 1/12 track and render 30 to 40px wide with captions wrapping letter by letter. The wall's parent panel is also only about 450px wide at 1440, so even spanned figures are thumbnails. Fix: give the wall the full content width, give the oval a span of 4 or 5, cap figure heights, and let the eight photos read as a wall.
- S1-3. Masthead nav wraps at 390 into two rows with "GET A QUOTE" orphaned. Fix: two even rows or a menu button at 480px and under.
- S1-4. `.scroll-note` is `position: fixed` and prints "Menus and prices ↓" over the hero photo on phones. Fix: static under the hero copy, or hidden under 768px.
- S1-5. The hero copy column is too narrow at 1440: the seven-word H1 breaks into six lines in a column of about 240px, and the proof line collides with the scroll note. Fix: copy column at about 560px so the H1 sets in three lines, proof line on its own row.
- S1-6. The purple ring sits over the hero photo (with white blobs inside it) and the diagonal thread runs through content on phones. Fix: remove both from the hero, or keep one as a hairline in empty space only (rule 5).
- S1-7. The oval cart photo on the home page clips its own caption. Fix: caption outside the oval, or a rectangular frame with the literal caption.
- S1-8. Menu page: to cure the hidden-on-load bug the builder set every table panel to display, so all five now stack under a tab row that still looks like tabs. Also "PUBLISHED PRICE$24 per person" has no space between label and price. Fix: either make the tabs switch panels without hiding content before JS runs, or drop the tab row; put the label on its own line.
- S1-9. Menu page intro paragraph sits at x=0 (same cause as S1-1).

### 9.3 Sample 2, Midnight Supper (closest to presentable)

- S2-1. Hero caption "01 / THE GATHERING Real food. Real occasions." becomes the S8 caption for knot-hero.jpg.
- S2-2. Cart caption "THE CART / A DIFFERENT KIND OF CENTREPIECE" becomes "THE CART. HOUSTON'S LARGEST." (2.2).
- S2-3. Nav at 390: "Menus and prices" wraps under its numeral. Low priority: shorten to "Menus" under 480px.
- S2-4. C1 and C3 apply. Nothing else blocks the presentation.

### 9.4 Sample 3, The Gathering

- S3-1. Hero at 1440 and 1920: the photo frame overlaps the sub copy and the "Menus and prices" link. The proof line lives in `.scene-label` (absolute, rotated -8°, bottom 20%, right 5%) and `.hero{overflow:hidden}` clips it to "not · Best of Weddings 2026". Fix per 8.3: two-column grid, photo in flow, proof line upright in the copy column, no rotation.
- S3-2. Hero at 390: `.scene-fallback` (the butter table with plate rings, absolute inset 18% 15%) sits behind the "Get a quote" button and the "Menus and prices" link. Fix: scene below the action row or hidden at 768px and under. Nothing decorative under a button.
- S3-3. "5.0 on WeddingWire. 100% would recommend." floats at the bottom left of the hero, detached from the Knot line. Fix: both proof lines together under the sub copy.
- S3-4. Hero caption "Real food. A reason to gather." and block 01 caption "From Tricia's table, to yours." become S8 captions.
- S3-5. Gallery: the "See it larger" pill on every photo renders as a blank white pill because the label has no contrast against it. Fix: ink text on the pill, or drop the pill and keep the caption as the link. Captions 01 to 06 become S8 captions.
- S3-6. Menu page: each table shows the italic one-line note and then the full contents, which repeat each other. Low priority: keep the note as the lede and set the contents smaller.
- S3-7. The builder changed "Five tables" to "Four tables from $24 to $38 a person, or the Holy Grail". That is correct (four per-person tables plus the Holy Grail). Keep.

### 9.5 Gates: what "presentable" means, per site

- G1. All 15 pages at 390, 768, 1440 and 1920: no horizontal scroll, no element overlapping another element's text box, no clipped text, no decoration touching a photo or text.
- G2. Zero kill-list strings from C2 on any page. "gather" at most once per site. "enquire" and "enquiry" absent from visible text.
- G3. 15 unique titles and 15 unique metas, matching 4.1.
- G4. Existing gates green: `tools/quality-gate.py` (samples 2 and 3), `samples/sample-1-editorial/qa_garden_pw.py`, the `test_content.py` and `test_content_browser.py` suites, and a live crawl extended from `tools/e2e-live-sample3.py` to all three hosts.
- G5. Quote flow: prefill links work, the draft carries table, guests and date, the six verified totals in STATE.md reproduce, and tel, sms and mailto links open.
- G6. Deployed, then re-crawled live after deploy. Screenshots at 390 and 1440 for all 15 pages committed under each sample's `test-output/`.

### 9.6 Presentation gate for Garrett (five minutes per site, phone and laptop)

Open the five pages. Read the hero aloud; it should sound like Tricia. Tap Get a quote and run one estimate. Confirm nothing overlaps and nothing is clipped. Confirm the Photos captions name food. If any of that fails, the site is not ready to send, whatever the reports say.
