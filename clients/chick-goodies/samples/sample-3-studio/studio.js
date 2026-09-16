/* Published menu values; amounts are calculated in cents. No messages auto-send. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const rates = {grand:38, super:30, standard:26, graze:24};
  const money = cents => (cents / 100).toLocaleString('en-US', {style:'currency',currency:'USD'});
  function calculate(table, count) {
    const guests = Number(count);
    if (!Number.isSafeInteger(guests) || guests < 1) return {error:'Please enter a whole number of guests.'};
    if (table === 'holy' && ![75,150].includes(guests)) return {error:'Holy Grail has published prices for 75 or 150 guests only. Ask Tricia about other counts.'};
    if (table !== 'holy' && !(table in rates)) return {error:'Please choose a published table.'};
    if (table !== 'holy' && guests < 50) return {error:'Per-person grazing tables have a 50-guest minimum.'};
    const food = table === 'holy' ? (guests === 75 ? 200000 : 350000) : rates[table] * guests * 100;
    if (!Number.isSafeInteger(food) || food > 1e10) return {error:'Please contact Tricia to quote this guest count.'};
    const setup = 22900, tax = Math.round((food + setup) * .18);
    return {guests,food,setup,tax,total:food+setup+tax};
  }
  window.StudioQuote = {calculate};
  const table=$('table'), guests=$('guests'), sms=$('text-enquiry'), mail=$('email-enquiry');
  const phone=sms.getAttribute('href').slice(4), email=mail.getAttribute('href').slice(7);
  let message='';
  function paint() {
    const q=calculate(table.value,guests.value), valid=!q.error;
    $('quote-error').textContent=q.error || '';
    $('food').textContent=valid ? money(q.food) : '—';
    $('tax').textContent=valid ? money(q.tax) : '—';
    const title=table.selectedOptions[0].textContent;
    $('food-label').textContent=title+(valid ? ' · '+q.guests+' guests' : '');
    if (valid) {
      const [whole,cents]=money(q.total).split('.');
      $('total').replaceChildren(document.createTextNode(whole));
      const span=document.createElement('span');span.className='cents';span.textContent='.'+cents;$('total').append(span);
    } else $('total').textContent='Let’s talk';
    const lines=['Hi Tricia — I’d like to plan a gathering.','Table: '+title,'Guests requested: '+guests.value];
    if ($('name').value.trim()) lines.push('Name: '+$('name').value.trim());
    if ($('date').value) lines.push('Event date: '+$('date').value);
    if ($('notes').value.trim()) lines.push('Occasion / requests: '+$('notes').value.trim());
    if (valid) lines.push('90-minute estimate: food '+money(q.food)+' + setup '+money(q.setup)+' + 18% tax '+money(q.tax)+' = '+money(q.total)+'. Tax assumed on food plus setup; please confirm. Extra time excluded.');
    else lines.push('Please provide a custom quote for this guest count.');
    lines.push('Please confirm availability and the final quote. This is an enquiry, not a booking.');
    message=lines.join('\n');
    const ios=/iPad|iPhone|iPod/.test(navigator.userAgent);
    sms.href='sms:'+phone+(ios?'&':'?')+'body='+encodeURIComponent(message);
    mail.href='mailto:'+email+'?subject='+encodeURIComponent('A gathering with Charcuterie Chick')+'&body='+encodeURIComponent(message);
    $('message-preview').value=message;
    $('fewer').disabled=Number(guests.value) <= (table.value==='holy'?75:50);
    $('more').disabled=table.value==='holy' && Number(guests.value)>=150;
  }
  function setTable() {
    const holy=table.value==='holy'; guests.min=holy?'75':'50';guests.step=holy?'75':'1';
    if (holy) {guests.max='150';if (![75,150].includes(Number(guests.value))) guests.value='75';}
    else {guests.removeAttribute('max');if (Number(guests.value)<50) guests.value='50';}
    $('guest-hint').textContent=holy?'Holy Grail: published packages for 75 or 150 guests.':'50-guest minimum. Use the buttons or type your guest count.';
    paint();
  }
  table.addEventListener('change',setTable);
  ['guests','name','date','notes'].forEach(id=>$(id).addEventListener('input',paint));
  ['fewer','more'].forEach(id=>$(id).addEventListener('click',()=>{
    const direction=id==='more'?1:-1;
    guests.value=table.value==='holy'?(direction>0?'150':'75'):String(Math.max(50,(Number(guests.value)||50)+direction*5));paint();
  }));
  document.querySelectorAll('[data-table]').forEach(link=>link.addEventListener('click',()=>{table.value=link.dataset.table;setTable();}));
  const images={holy:['knot-hero.jpg',945,720],grand:['knot-2.jpg',945,720],super:['knot-3.jpg',945,720],standard:['table-01.jpg',480,640],graze:['wide-640.jpg',640,452]};
  document.querySelectorAll('.menu-list details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if (!detail.open) return;
    document.querySelectorAll('.menu-list details').forEach(other=>{if(other!==detail)other.open=false;});
    const [file,width,height]=images[detail.id.replace('menu-','')];
    const image=$('menu-photo');image.src='img/'+file;image.width=width;image.height=height;
  }));
  $('copy').hidden=false;
  $('copy').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(message);$('copy-status').textContent='Copied. Paste into a text or email.';}
    catch {const preview=$('message-preview');preview.hidden=false;preview.focus();preview.select();$('copy-status').textContent='Clipboard unavailable. Select and copy the enquiry below.';}
  });
  document.documentElement.classList.add('js-ready');setTable();
})();
