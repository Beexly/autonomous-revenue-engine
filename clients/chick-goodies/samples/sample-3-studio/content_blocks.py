"""Static copy migration. Run once against the original sample layout."""
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).parent

def settext(page, selector, value):
    node=page.select_one(selector)
    assert node is not None, selector
    node.clear(); node.append(value)

def fragment(html):
    return BeautifulSoup(html, 'html.parser')

terms=["Every table runs 90 minutes. Need longer? $3 a person per half hour.","Tables are for 50 guests or more. The Holy Grail comes in two sizes, 75 or 150.","Setup is a flat $229 and tax is 18%. I'll confirm exactly what the tax applies to on your quote.","These are my published prices, not your quote. Your quote comes from me, after we talk."]
choices=["Eleven sliders: tuna salad, deviled chicken salad, chicken salad, BLT, turkey & gouda, Italian, ham & fontina, chicken & waffles, caprese, muffuletta, roasted vegetable.","Eleven dips: Tricia's corn dip, tzatziki, bruschetta, ground mustard, cold spinach, fig jam, pico de gallo, 7-layer Mexican, guacamole, Texas caviar, French onion.","Six salads: caprese, Mom's macaroni, Uncle Trey's potato, tomato & bleu cheese, cucumber, loaded baked potato.","Four meats: turkey, ham, salami, pepperoni.","How many of each you get depends on the table. Substitutions, ask me."]
sides=["Taco Cart $26.95 · Carts $24.50 · Slider Menu $2.95","Cakes and Shakes $9.50 · Candy Bar Chick $5.00 · Zeppole Beignet Chick $4.50","Bloody Mary Chick $6.50 · Mimosa Chick $4.00","Easy order boards, the Charcuterie Chick board, apple pie and the full catering menu: ask me for a price."]
faqs=[("Is this a booking?","No. You send me the note from your own email or phone. I check the date, we talk through the menu, and I send you a real quote. Nothing is held until we've agreed it."),("How much does a grazing table cost?","$24 to $38 a person depending on the table, for 50 guests or more. Add the $229 setup and 18% tax. The Holy Grail is $2,000 for 75 guests or $3,500 for 150."),("We're fewer than 50. What then?","Ask me about boards, the cart, sweets and sips. Boards are priced on request."),("Where do you go?","Tomball, The Woodlands, Spring and Conroe, and up to 100 miles out."),("Allergies?","Tell me in the note. I'll tell you honestly what I can and can't do. I don't promise allergen-free preparation.")]
copy={"Wedding":"The Holy Grail is the wedding table. Five cheeses, five meats, two sliders, guacamole and pico, for 75 or 150 guests. 5.0 on The Knot, Best of Weddings 2026.","Celebration":"Fifty guests or more, pick a table from $24 a person. Fewer than that, ask me about boards and the cart. The Candy Bar Chick is $5.00.","Work gathering":"Ninety minutes of service. Add the Bloody Mary Chick or the Mimosa Chick if it's a brunch."}

def paragraphs(page, target, values):
    for value in values:
        p=page.new_tag('p'); p.string=value; target.append(p)

for file in ROOT.glob('*.html'):
    page=BeautifulSoup(file.read_text(encoding='utf-8'),'html.parser')
    if file.stem=='menu':
        settext(page,'.page-head .eyebrow','MENUS AND PRICES')
        settext(page,'h1','The tables, with prices.')
        settext(page,'.page-head > p:last-child',terms[0])
        box=page.select_one('.menu-intro div'); box.clear(); paragraphs(page,box,terms[1:])
        lines={'graze':"My starter table. It still has two sliders, two salads and a dip.",'standard':"The starter plus pasta salad, a second hummus, two dips and chips.",'super':"Three sliders, three salads, three dips and the full vegetable spread.",'grand':"Five sliders, four salads, three dips, and pudding cups to finish. Oreo, butterscotch or banana.",'holy':"The wedding table. Five cheeses, five meats, two sliders, guacamole and pico, fruit and chips."}
        for key,value in lines.items():
            p=page.new_tag('p',attrs={'class':'table-note'});p.string=value;page.select_one('#'+key+' h2').insert_after(p)
        settext(page,'.closing h2','Under 50 guests?')
        settext(page,'.closing > p','Ask me about boards, the cart, sweets and sips. Boards are priced on request.')
        settext(page,'.closing a','Get a quote')
        paragraphs(page,page.select_one('.closing'),sides)
        box=page.new_tag('section',attrs={'class':'choices content-block'}); h=page.new_tag('h2');h.string='Pick your sliders, dips and salads.';box.append(h);paragraphs(page,box,choices);page.main.append(box)
    if file.stem=='enquire':
        settext(page,'.page-head .eyebrow','GET A QUOTE');settext(page,'h1','Price your party.')
        settext(page,'.page-head > p:last-child','Pick a table and a headcount and see the published total. Nothing is sent until you send it. Nothing is booked here.')
        labels={'date':'When? (optional)','guests':'How many guests?','occasion':"What's the party?",'table':'Which table?','notes':'Anything I should know? (optional)'}
        for key,label in labels.items():settext(page,'label[for="'+key+'"]',label)
        for o,label in zip(page.select('#occasion option'),['A wedding','A party','A work event','Something else']):o['value']=o.get('value',o.text);o.string=label
        page.select_one('#notes')['placeholder']='Venue, timing, allergies.'
        box=page.select_one('.planner-inputs')
        groups=[]
        for key in ['date','guests','occasion','table']:
            groups.append(page.select_one('label[for="'+key+'"]').extract())
            groups.append((page.select_one('.stepper') if key=='guests' else page.select_one('#'+key)).extract())
            if key=='guests':groups.append(page.select_one('#guest-hint').extract())
        for node in reversed(groups):box.insert(0,node)
        venue=fragment('<label for="venue">Where? (optional)</label><input id="venue" maxlength="200" autocomplete="off" placeholder="Town or venue" type="text">')
        page.select_one('label[for="notes"]').insert_before(venue)
        box.append(fragment('<label for="name">Your name (optional)</label><input id="name" maxlength="100" autocomplete="name" type="text">'))
        for value,label in [('unsure','Not sure, tell me what fits'),('other','Boards, the cart, sweets or sips')]:
            o=page.new_tag('option',value=value);o.string=label;page.select_one('#table').append(o)
        settext(page,'.planner-output .eyebrow','ESTIMATE FROM PUBLISHED PRICES · 90 MINUTES')
        settext(page,'.planner-output .fine',"This number comes from my published prices. It isn't your quote and it doesn't hold a date. In it: food for your guests, the $229 setup, and 18% tax estimated on both. I'll confirm exactly what the tax applies to on your quote. Not in it: extra time at $3 a person per half hour, the cart, sweets, sips or boards. Next: you send me the note. I check the date and reply with a real quote. Tables need 50 guests. The Holy Grail is 75 or 150 exactly.")
        settext(page,'#email-enquiry','Email me this');settext(page,'#text-enquiry','Text me this')
        a=page.select_one('.contact-actions a[href^="tel:"]');a.string='Or call: '+a['href'].split(':')[1]
        box=page.new_tag('section',attrs={'class':'faq content-block'});h=page.new_tag('h2');h.string='Good to know';box.append(h)
        for q,a in faqs:
            item=page.new_tag('div',attrs={'class':'faq-item'});h=page.new_tag('h3');h.string=q;item.append(h);paragraphs(page,item,[a]);box.append(item)
        page.main.append(box)
    if file.stem=='index':
        updates={'.hero-top .eyebrow':'CHARCUTERIE CHICK · TOMBALL, TEXAS','.hero-copy > p':"Grazing tables, Houston's largest charcuterie cart, boards, sweets and sips. Prices on the page. Breads, jellies and jams from scratch.",'.hero-actions .pill':'Get a quote','.hero-actions .line-link':'Menus and prices','.scene-label':'5.0 on The Knot · Best of Weddings 2026','.hero-bottom p':'5.0 on WeddingWire. 100% would recommend.','.hero-bottom a':'The tables','.intro .eyebrow':'01 / THE TABLES','.intro h2':"Fifty guests and up, that's a table. Fewer, that's the cart or a board.",'.intro-type > p':'Four tables from $24 to $38 a person, or the Holy Grail for 75 or 150 guests. Every table runs 90 minutes. Setup is $229, tax is 18%.','.intro-type a':'Menus and prices','.occasion .eyebrow':"02 / WHAT'S THE PARTY?",'#occasion-copy':copy['Wedding'],'#occasion-link':'Quote this party','.closing .eyebrow':'03 / ABOUT TRICIA','.closing > p':"More than 35 years in restaurants, front of the house and back. I run Houston's largest charcuterie cart and I take one party at a time.",'.closing a':'More about me'}
        for sel,value in updates.items():settext(page,sel,value)
        for b,label in zip(page.select('[data-occasion]'),["It's a wedding.","It's a party.","It's work."]):b.clear();b.append(label)
        page.select_one('.closing').append(fragment('<img class="owner-portrait" src="img/tricia-662.jpg" alt="Tricia Holfelder, owner of Charcuterie Chick" width="662" height="823" loading="lazy">'))
    if file.stem=='gallery':
        settext(page,'.page-head .eyebrow','PHOTOS');settext(page,'h1','From parties I catered.')
        settext(page,'.page-head > p:last-child','Every photo was taken at an event I catered. Tap one to see it larger.')
        for span in page.select('[data-lightbox] span'):span.string='See it larger'
    if file.stem=='story':
        settext(page,'.story-head .eyebrow','ABOUT TRICIA');settext(page,'h1',"Hi, I'm Tricia.")
        settext(page,'.story-letter .eyebrow','TOMBALL, TEXAS');settext(page,'.story-letter h2',"I've worked the floor and I've worked the line.")
        for node,value in zip(page.select('.story-letter > p:not(.eyebrow)'),["More than 35 years in restaurants, front of the house and back. Charcuterie Chick is the business I built out of all of it.","The breads, jellies and jams are made from scratch. The cart is Houston's largest. I take one party at a time.","Woman-owned. Tomball, The Woodlands, Spring and Conroe."]):node.string=value
        settext(page,'.story-letter a','Get a quote')
    cta=fragment('<section class="content-cta"><h2>Send me the date and the headcount. I’ll take it from there.</h2><a class="pill" href="enquire.html">Get a quote</a></section>')
    tel=page.select_one('footer a[href^="tel:"]').__copy__();tel.string='Call '+tel['href'].split(':')[1];cta.section.append(tel);page.main.append(cta)
    file.write_text(str(page),encoding='utf-8')
