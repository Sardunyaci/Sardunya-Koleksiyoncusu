/* Sardunya Koleksiyoncusu - medya duzeltmesi */
(() => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function start() {
    for (let i=0;i<40;i++) {
      if (typeof data !== 'undefined' && typeof sbUrl !== 'undefined' && typeof sbKey !== 'undefined' && typeof render === 'function') break;
      await wait(250);
    }
    if (typeof data === 'undefined' || typeof sbUrl === 'undefined' || typeof sbKey === 'undefined' || typeof render !== 'function') return;
let rows = [];
for (let i = 0; i < 80; i++) {
  rows = data.filter(p => p.fromSupabase);
  if (rows.length) break;
  await wait(250);
}
if (!rows.length) return;
    const headers={apikey:sbKey,Authorization:'Bearer '+sbKey};
    const productsResponse=await fetch(sbUrl+'/rest/v1/products?select=id,product_code&approval_status=eq.approved&limit=1000',{headers});
    if(!productsResponse.ok)return;
    const products=await productsResponse.json();
    const idByCode=new Map(products.map(p=>[String(p.product_code),p.id]));
    const ids=rows.map(p=>idByCode.get(String(p.code))).filter(Boolean);
    if(!ids.length)return;
    const q=ids.join(',');
    const response=await fetch(sbUrl+'/rest/v1/product_variant_media?select=product_id,variant_type,media_type,media_url&product_id=in.('+q+')&limit=2000',{headers});
    if(!response.ok)return;
    const media=await response.json();
    for(const p of rows){
      const id=idByCode.get(String(p.code));
      const items=media.filter(m=>m.product_id===id && m.media_url);
      const photos=[...new Set(items.filter(m=>m.media_type==='image').map(m=>m.media_url))];
      const videos=[...new Set(items.filter(m=>m.media_type==='video').map(m=>m.media_url))];
      if(photos.length){p.gallery=photos;p.img=photos[0];}
      p.videos=videos;
    }
    render();
    const grid=document.getElementById('grid');
    const lightbox=document.getElementById('lightbox');
    const big=document.getElementById('big');
    const caption=document.getElementById('caption');
    const controls=document.getElementById('gallery-controls');
    if(!grid||!lightbox||!big||!caption||!controls)return;
    const video=document.createElement('video');
    video.controls=true;video.playsInline=true;
    video.style.cssText='display:none;max-width:95vw;max-height:75vh';
    big.after(video);
    let items=[],idx=0,title='';
    function show(){
      const item=items[idx];video.pause();
      if(item.type==='video'){
        big.style.display='none';video.style.display='block';video.src=item.url;
      }else{
        video.style.display='none';video.removeAttribute('src');
        big.style.display='block';big.src=item.url;
      }
      caption.textContent=title+' · '+(idx+1)+' / '+items.length;
      controls.style.display=items.length>1?'flex':'none';
    }
    grid.addEventListener('click',e=>{
      const box=e.target.closest('.photo-box');
      if(!box)return;
      const p=rows.find(x=>String(x.code)===String(box.dataset.code));
      if(!p)return;
      items=[...(p.gallery||[]).map(url=>({type:'image',url})),...(p.videos||[]).map(url=>({type:'video',url}))];
      if(!items.length)return;
      e.preventDefault();e.stopImmediatePropagation();
      idx=0;title=p.name;show();lightbox.classList.add('open');
    },true);
    for(const [id,step] of [['prev-photo',-1],['next-photo',1]]){
      document.getElementById(id)?.addEventListener('click',e=>{
        if(!items.length)return;
        e.stopImmediatePropagation();idx=(idx+step+items.length)%items.length;show();
      },true);
    }
    document.getElementById('close')?.addEventListener('click',()=>video.pause());
    lightbox.addEventListener('click',e=>{if(e.target===lightbox)video.pause();});
  }
  start().catch(console.error);
})();
