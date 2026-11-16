/* Sardunya Koleksiyoncusu — tek pencere, üç adım, ödemesiz WhatsApp sipariş talebi. */
(()=>{
'use strict';
const PRODUCTS=new Map([["34","YuV Elbrus"],["150","SiM Charisma"],["149","SiM Praline"],["154","TS Maya"],["105","DiaZ Madrugada"],["81","Good Vibration"],["10","Bold Diamond Wedding"],["35","Tamara"],["38","IV Maya Plisetskaya"],["31","Red Pandora"],["192","Odensjo Madame Bovary"],["250","Jagershus Borre"],["254","OCh Madpearl White"],["264","Sweet Orha"],["251","YuG Princess Grace"],["82","TA Emmanuel"],["110","BY Coral Reef"],["125","DiaZ Faramira"],["94","ShiK Grand Prix"],["121","Nika Esmeralda"],["147","Lara Delight"],["49","MD Lyubochka"],["270","Yu Nastasya Filippovna"],["194","YuV White Magic"],["1704","LiA Eteriya"],["1243","LiA Freya"],["33","IV Galina Ulanova"]]);
const COVERS={"10":"https://images.prom.ua/1932751504_pelargoniya-zonalna-bold.jpg","31":"https://qhhvhuomfqhkrvcwxwgp.supabase.co/storage/v1/object/public/product-images/sardunya-arsiv/Kod_31/red_pandora1.jpg","33":"https://qhhvhuomfqhkrvcwxwgp.supabase.co/storage/v1/object/public/product-images/sardunya-arsiv/Kod_33/galina-33-1.jpg","34":"https://images.prom.ua/6620857703_yuv-elbrus-34.jpg","35":"https://images.prom.ua/1933486320_pelargoniya-tamara-geran.jpg","38":"https://images.prom.ua/6395593527_iv-maja-pliska.jpg","49":"https://images.prom.ua/7425435565_md-lyubochka-.jpg","81":"https://images.prom.ua/1934279425_pelargoniya-good-vibration.jpg","82":"https://images.prom.ua/6450625216_ta-emmanuel-82.jpg","94":"https://qhhvhuomfqhkrvcwxwgp.supabase.co/storage/v1/object/public/product-images/sardunya-arsiv/Kod_94/ShYK_Grand_Prix.jpg","105":"https://images.prom.ua/6758569505_diaz-madrugada-105.jpg","110":"https://images.prom.ua/6758327919_by-karalovij-rif.jpg","121":"https://images.prom.ua/6574379756_nika-esmeralda-121.jpg","125":"https://images.prom.ua/6454369016_diaz-faramira-125.jpg","147":"https://images.prom.ua/6758153050_lara-delight-147.jpg","149":"https://images.prom.ua/7341982570_sim-praline-149.jpg","150":"https://images.prom.ua/7341902277_sim-harizma-150.jpg","154":"https://images.prom.ua/7601883615_ts-maya-154.jpg","192":"https://images.prom.ua/2697729416_odensjo-madame-bovary.jpg","194":"https://images.prom.ua/3612069060_194-yuv-bila.jpg","250":"https://qhhvhuomfqhkrvcwxwgp.supabase.co/storage/v1/object/public/product-images/sardunya-arsiv/Kod_250/jogerhus_1.jpg","251":"https://images.prom.ua/3097729969_yug-printsesa-grejs.jpg","254":"https://images.prom.ua/3109433705_och-madpearl-white.jpg","264":"https://images.prom.ua/3615677864_pelargoniya-svit-orha.jpg","270":"https://images.prom.ua/6758333968_270-yu-nastasya.jpg","1243":"https://qhhvhuomfqhkrvcwxwgp.supabase.co/storage/v1/object/public/product-images/sardunya-arsiv/Kod_1243/1243-26.jpg","1704":"https://qhhvhuomfqhkrvcwxwgp.supabase.co/storage/v1/object/public/product-images/sardunya-arsiv/Kod_1704/1704-25.jpg"};
const PHONE='905322606088';
const $=id=>document.getElementById(id);
const escapeText=s=>String(s??'');
let phase=1,code='',address='',lastFocus=null,priorOverflow='';
function make(){
 const wrap=document.createElement('div');
 wrap.id='sk-order-backdrop';wrap.className='sk-order-backdrop';wrap.hidden=true;
 wrap.innerHTML=`
 <section class="sk-order-box" role="dialog" aria-modal="true" aria-labelledby="sk-order-title">
  <button id="sk-order-close" class="sk-order-close" type="button" aria-label="Sipariş ekranını kapat">×</button>
  <aside class="sk-order-photo">
   <img id="sk-order-image" alt="Çeşidin genel çiçek fotoğrafı" referrerpolicy="no-referrer">
   <div id="sk-order-noimage" class="sk-order-fallback" hidden>Çeşit fotoğrafı yakında</div>
   <div><h2 id="sk-order-product">Sardunya Koleksiyoncusu</h2>
   <div id="sk-order-photo-code" class="sk-order-chip">Ürün kodunu yazın</div>
   <p class="sk-order-note">Bu görsel çeşidin genel çiçek fotoğrafıdır. Gönderilecek Fide bitkisinin güncel fotoğrafı olmayabilir.</p></div>
  </aside>
  <div class="sk-order-panel">
   <h2 id="sk-order-title">Tek Ekranda Sipariş</h2>
   <p>Sipariş, adres ve ödeme bilgisi aynı pencerede.</p>
   <div class="sk-order-steps" aria-label="Sipariş aşamaları">
    <span id="sk-order-mark-1">1. Sipariş</span>
    <span id="sk-order-mark-2">2. Adres</span>
    <span id="sk-order-mark-3">3. Ödeme</span>
   </div>
   <div class="sk-order-step" id="sk-order-phase-1">
    <h3>1. Sipariş</h3>
    <p class="sk-order-muted">Sipariş vermek istediğiniz sardunyanın kodunu yazın.</p>
    <label class="sk-order-label" for="sk-order-code">Ürün Kodu</label>
    <input id="sk-order-code" type="text" inputmode="numeric" autocomplete="off" placeholder="Örneğin 105" list="sk-order-codes" maxlength="5">
    <datalist id="sk-order-codes"></datalist>
    <div id="sk-order-picked" class="sk-order-card" aria-live="polite">Ürün kodu bekleniyor.</div>
    <p class="sk-order-muted"><b>Ürün formu:</b> Fide (1 adet). Çelik ve Anaç siparişleri şu anda kapalıdır; stok satıcı tarafından teyit edilir.</p>
    <p id="sk-order-code-error" class="sk-order-warning" hidden>Geçerli bir katalog ürün kodu girin.</p>
    <div class="sk-order-actions"><button class="sk-order-primary" id="sk-order-next1" type="button">Adres Bilgisine Geç →</button></div>
   </div>
   <div class="sk-order-step" id="sk-order-phase-2" hidden>
    <h3>2. Teslimat Adresi</h3>
    <p class="sk-order-muted">Sadece ürün kodu ve teslimat adresi yeterli. Üyelik gerekmiyor.</p>
    <label class="sk-order-label" for="sk-order-address">Gönderilmesini İstediğiniz Açık Adres</label>
    <textarea id="sk-order-address" placeholder="Mahalle, sokak, bina/daire, ilçe ve il bilgisi" maxlength="650" required></textarea>
    <p id="sk-order-address-error" class="sk-order-warning" hidden>Lütfen gönderim için yeterli açıklıkta adres yazın (en az 10 karakter).</p>
    <div class="sk-order-actions">
     <button class="sk-order-secondary" id="sk-order-back2" type="button">← Sipariş</button>
     <button class="sk-order-primary" id="sk-order-next2" type="button">Ödeme Adımına Geç →</button>
    </div>
   </div>
   <div class="sk-order-step" id="sk-order-phase-3" hidden>
    <h3>3. Ödeme / Sipariş Talebi</h3>
    <div class="sk-order-paybox"><b>Ödeme seçenekleri ikinci aşamada etkinleştirilecek.</b>
     <label><input type="radio" disabled name="sk-pay"> Kredi Kartı — Yakında</label>
     <label><input type="radio" disabled name="sk-pay"> IBAN / Havale — Yakında</label>
    </div>
    <div class="sk-order-card"><b>Sipariş Özeti</b>
     <div id="sk-order-summary" class="sk-order-summary"></div></div>
    <p class="sk-order-muted">Henüz ödeme alınmaz. Aşağıdaki düğme ürün kodunu ve açık adresinizi WhatsApp mesajına aktarır. Sipariş ve fiyat satıcıyla teyit edilir.</p>
    <div class="sk-order-actions">
     <button class="sk-order-secondary" id="sk-order-back3" type="button">← Adres</button>
     <a id="sk-order-whatsapp" class="sk-order-primary" target="_blank" rel="noopener noreferrer" href="#">WhatsApp ile Sipariş Talebi Gönder</a>
    </div>
   </div>
  </div>
 </section>`;
 document.body.append(wrap);
 for(const [c,n] of PRODUCTS){
  const option=document.createElement('option');option.value=c;option.label=n;$('sk-order-codes').append(option);
 }
 $('sk-order-code').addEventListener('input',refreshProduct);
 $('sk-order-address').addEventListener('input',()=>{$('sk-order-address-error').hidden=true;});
 $('sk-order-next1').onclick=()=>{
  if(!PRODUCTS.has($('sk-order-code').value.trim())){$('sk-order-code-error').hidden=false;return}
  code=$('sk-order-code').value.trim();setPhase(2);$('sk-order-address').focus();
 };
 $('sk-order-back2').onclick=()=>{setPhase(1);$('sk-order-code').focus()};
 $('sk-order-next2').onclick=()=>{
  const value=$('sk-order-address').value.trim();
  if(value.length<10){$('sk-order-address-error').hidden=false;$('sk-order-address').focus();return}
  address=value;updateSummary();setPhase(3);$('sk-order-whatsapp').focus();
 };
 $('sk-order-back3').onclick=()=>{setPhase(2);$('sk-order-address').focus()};
 $('sk-order-close').onclick=close;
 wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
 document.addEventListener('keydown',e=>{if(!wrap.hidden&&e.key==='Escape'){e.preventDefault();close()}});
 document.addEventListener('click',e=>{
   const button=e.target.closest('[data-sk-order-open]');
   if(button){e.preventDefault();open({code:button.dataset.skOrderCode||'',name:button.dataset.skOrderName||'',image:button.dataset.skOrderImage||''});return}
   const legacy=e.target.closest('#order-link');
   if(legacy&&!legacy.hidden){
     e.preventDefault();
     const paramCode=new URLSearchParams(location.search).get('code')||'';
     open({code:paramCode,name:$('product-name')?.textContent||'',image:$('hero')?.src||''});
   }
 });
 const oldLink=$('order-link');
 if(oldLink)oldLink.textContent='Ürün Kodu ve Adresle Hızlı Sipariş';
}
function setPhase(p){
 phase=p;
 for(let i=1;i<=3;i++){
  $('sk-order-phase-'+i).hidden=i!==p;
  const mark=$('sk-order-mark-'+i);
  mark.dataset.active=String(i===p);mark.dataset.done=String(i<p);
 }
 const box=$('sk-order-backdrop').querySelector('.sk-order-box');
 box.scrollTop=0;$('sk-order-backdrop').scrollTop=0;
}
function refreshProduct(){
 code=$('sk-order-code').value.trim();
 const name=PRODUCTS.get(code);
 $('sk-order-code-error').hidden=true;
 $('sk-order-picked').textContent=name?'Seçilen ürün: '+name+' (Kod '+code+') · Fide, 1 adet':'Ürün kodunu girin veya listeden seçin.';
 $('sk-order-next1').disabled=!name;
 $('sk-order-product').textContent=name||'Sardunya Koleksiyoncusu';
 $('sk-order-photo-code').textContent=name?'Kod: '+code:'Ürün kodunu yazın';
 const img=$('sk-order-image'),fallback=$('sk-order-noimage');
 const src=name?COVERS[code]:'';
 if(src&&/^https:\/\//.test(src)){
  img.hidden=false;fallback.hidden=true;img.onerror=()=>{img.hidden=true;fallback.hidden=false};
  if(img.getAttribute('src')!==src)img.src=src;
 }else{img.hidden=true;fallback.hidden=false;img.removeAttribute('src')}
}
function updateSummary(){
 const message='Merhaba, Sardunya Koleksiyoncusu sipariş talebim:\n'+
 'Ürün: '+PRODUCTS.get(code)+'\nÜrün kodu: '+code+'\nÜrün formu: Fide\nAdet: 1\nTeslimat adresi:\n'+address+
 '\nFiyat, stok ve gönderim koşullarını teyit etmek istiyorum.';
 $('sk-order-summary').textContent='Ürün: '+PRODUCTS.get(code)+'\nKod: '+code+'\nForm: Fide · 1 adet\nAdres: '+address+'\nÖdeme: Henüz alınmadı';
 $('sk-order-whatsapp').href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(message);
}
function open(options={}){
 const root=$('sk-order-backdrop');if(!root)return;
 lastFocus=document.activeElement;
 $('sk-order-code').value=escapeText(options.code||'').trim();
 $('sk-order-address').value='';address='';code='';
 $('sk-order-code-error').hidden=true;$('sk-order-address-error').hidden=true;
 refreshProduct();setPhase(1);
 priorOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
 root.hidden=false;
 $('sk-order-code').focus();
}
function close(){
 const root=$('sk-order-backdrop');if(!root||root.hidden)return;
 root.hidden=true;document.body.style.overflow=priorOverflow;
 if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus();
}
window.SardunyaCheckout={open,close};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',make,{once:true});else make();
})();
