// Render helpers para listings y páginas individuales
(function(){
  const $ = (s, d=document) => d.querySelector(s);
  const $$ = (s, d=document) => d.querySelectorAll(s);

  // Utilidades
  const slugify = (s) => (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  const toHTML = (text) => {
    // Soporte simple para Markdown (solo **negrita**, _itálica_, `code`, títulos #)
    if (!text) return '';
    return text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\_(.*?)\_/g, '<em>$1</em>')
      .replace(/\`(.*?)\`/g, '<code>$1</code>')
      .replace(/\n$/g, '<br>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  };

  // Capa de datos: JSON por defecto + overrides en localStorage
  async function getJSON(path, storageKey) {
    // 1) Base de los archivos estáticos
    let base = [];
    try {
      const res = await fetch(path, {cache:'no-store'});
      base = res.ok ? await res.json() : [];
    } catch(e){ base = []; }

    // 2) Merge con localStorage
    const local = JSON.parse(localStorage.getItem(storageKey) || '[]');
    // Merge por slug (local tiene prioridad)
    const map = new Map();
    [...base, ...local].forEach(item => {
      const slug = item.slug || slugify(item.title);
      map.set(slug, {...item, slug});
    });
    return Array.from(map.values()).sort((a,b)=> (b.date||'').localeCompare(a.date||''));
  }

  // Pintar tarjetas
  function cardPost(p){
    return `
      <article class="post-card reveal">
        <img src="${p.img || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop'}" alt="Portada de '${p.title}'">
        <div class="post-card__body">
          <div class="post-card__meta">${p.author || 'Olympus Theon'} · ${p.date || ''}</div>
          <h2 class="post-card__title">${p.title}</h2>
          <p>${p.excerpt || ''}</p>
          <div class="post-card__meta">${(p.tags||[]).map(t=>`#${t}`).join(' ')}</div>
          <a class="btn btn--ghost" href="post.html?id=${encodeURIComponent(p.slug || '')}">Leer más</a>
        </div>
      </article>`;
  }

  function stars(n=0){
    const full = Math.round(n*2)/2;
    const s = Array.from({length:5}, (_,i)=> i+1 <= full ? '★' : (i+0.5 === full ? '☆' : '☆')).join('');
    return `<span aria-label="Valoración ${n}/5">${s}</span>`;
  }

  function cardBook(b){
    return `
      <article class="book-card reveal">
        <img src="${b.img || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop'}" alt="Portada de '${b.title}'">
        <div class="book-card__body">
          <div class="book-card__meta">${b.author || ''} · ${b.date || ''}</div>
          <h2 class="book-card__title">${b.title}</h2>
          <p>${b.excerpt || ''}</p>
          <div class="book-card__meta">${(b.tags||[]).map(t=>`#${t}`).join(' ')} { ${stars(b.rating||0)} }</div>
          <a class="btn btn--ghost" href="libro.html?id=${encodeURIComponent(b.slug || '')}">Ver reseña</a>
        </div>
      </article>`;
  }

  // Render segun pagina
  window.addEventListener('DOMContentLoaded', async ()=>{
    const page = window.page;
    if (page === 'blog') {
      const list = $('#posts');
      const input = $('#search');
      const items = await getJSON('assets/data/posts.json','ot_posts');
      const render = (arr)=> list.innerHTML = arr.map(cardPost).join('');
      render(items);
      input.addEventListener('input', e=>{
        const q = e.target.value.toLowerCase();
        render(items.filter(p => [p.title, p.excerpt, ...(p.tags||[])].join(' ').toLowerCase().includes(q)));
      });
    }

    if (page === 'libros') {
      const list = $('#books');
      const input = $('#search');
      const items = await getJSON('assets/data/libros.json','ot_books');
      const render = (arr)=> list.innerHTML = arr.map(cardBook).join('');
      render(items);
      input.addEventListener('input', e=>{
        const q = e.target.value.toLowerCase();
        render(items.filter(b => [b.title, b.author, b.excerpt, ...(b.tags||[])].join(' ').toLowerCase().includes(q)));
      });
    }

    if (page === 'post') {
      const params = new URLSearchParams(location.search);
      const id = params.get('id') || '';
      const items = await getJSON('assets/data/posts.json','ot_posts');
      const p = items.find(x => (x.slug || '') === id);
      if (!p) { $('#post-title').textContent = 'Entrada no encontrada'; return; }
      $('#post-title').textContent = p.title;
      $('#post-meta').textContent = `${p.author||'Olympus Theon'} · ${p.date||''}`;
      if (p.img) $('#post-cover').innerHTML = `<img src="${p.img}" alt="Portada">`;
      $('#post-body').innerHTML = `<p>${toHTML(p.content || p.excerpt || '')}</p>`;
      document.title = `${p.title} — Olympus Theon`;
    }

    if (page === 'book') {
      const params = new URLSearchParams(location.search);
      const id = params.get('id') || '';
      const items = await getJSON('assets/data/libros.json','ot_books');
      const b = items.find(x => (x.slug || '') === id);
      if (!b) { $('#book-title').textContent = 'Libro no encontrado'; return; }
      $('#book-title').textContent = b.title;
      $('#book-meta').textContent = `${b.author||''} · ${b.date||''}`;
      if (b.img) $('#book-cover').innerHTML = `<img src="${b.img}" alt="Portada">`;
      $('#book-body').innerHTML = `<p>${toHTML(b.content || b.excerpt || '')}</p>`;
      document.title = `${b.title} — Olympus Theon`;
    }
  });
})();