
(function(){
  const $=s=>document.querySelector(s);
  const slugify=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  async function getJSON(path,key){
    let base=[]; try{const r=await fetch(path,{cache:'no-store'}); base=r.ok?await r.json():[]}catch(e){base=[]}
    const local=JSON.parse(localStorage.getItem(key)||'[]');
    const map=new Map(); [...base,...local].forEach(it=>{const slug=it.slug||slugify(it.title); map.set(slug,{...it,slug})}); 
    return Array.from(map.values()).sort((a,b)=> (b.date||'').localeCompare(a.date||''));
  }
  function card(p){return `<article class="post-card"><div class="post-card__body"><div class="post-card__meta">${p.author||'OT'} · ${p.date||''}</div><h2>${p.title}</h2><p>${p.excerpt||''}</p><a class="btn btn--ghost" href="post.html?id=${encodeURIComponent(p.slug||'')}">Leer más</a></div></article>`}
  function cardB(p){return `<article class="book-card"><div class="book-card__body"><div class="post-card__meta">${p.author||''} · ${p.date||''}</div><h2>${p.title}</h2><p>${p.excerpt||''}</p><a class="btn btn--ghost" href="libro.html?id=${encodeURIComponent(p.slug||'')}">Ver reseña</a></div></article>`}
  window.addEventListener('DOMContentLoaded',async()=>{
    if(window.page==='blog'){ const list=$('#posts'); const items=await getJSON('assets/data/posts.json','ot_posts'); list.innerHTML=items.map(card).join(''); }
    if(window.page==='libros'){ const list=$('#books'); const items=await getJSON('assets/data/libros.json','ot_books'); list.innerHTML=items.map(cardB).join(''); }
    if(window.page==='post'){ const id=new URLSearchParams(location.search).get('id'); const items=await getJSON('assets/data/posts.json','ot_posts'); const p=items.find(x=>x.slug===id); if(p){document.title=p.title+' — Olympus Theon'; document.getElementById('post').innerHTML+=`<h2>${p.title}</h2><p>${p.content||p.excerpt||''}</p>`}}
    if(window.page==='book'){ const id=new URLSearchParams(location.search).get('id'); const items=await getJSON('assets/data/libros.json','ot_books'); const p=items.find(x=>x.slug===id); if(p){document.title=p.title+' — Olympus Theon'; document.getElementById('book').innerHTML+=`<h2>${p.title}</h2><p>${p.content||p.excerpt||''}</p>`}}
  });
})();