// CMS front-end (localStorage + import/export JSON + GitHub opcional)
(function(){
  const $ = (s, d=document) => d.querySelector(s);
  const $$ = (s, d=document) => d.querySelectorAll(s);
  const today = new Date().toISOString().slice(0,10);

  const slugify = (s) => (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  const storage = {
    posts: 'ot_posts',
    books: 'ot_books',
    subs:  'ot_subscribers',
    github: 'ot_github_cfg'
  };

  function getAll(key){ return JSON.parse(localStorage.getItem(key) || '[]'); }
  function setAll(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  function toArray(str){ return (str||'').split(',').map(s=>s.trim()).filter(Boolean); }

  // Admin only
  if (window.page === 'admin') {
    const postForm = $('#form-post');
    const bookForm = $('#form-book');
    const preview = $('#preview-area');

    function previewCard(html){ preview.innerHTML = html + preview.innerHTML; }

    if (postForm) postForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const fd = new FormData(postForm);
      const item = {
        title: fd.get('title'),
        author: fd.get('author') || 'Olympus Theon',
        date: fd.get('date') || today,
        img: fd.get('img') || '',
        tags: toArray(fd.get('tags')),
        excerpt: fd.get('excerpt') || '',
        content: fd.get('content') || '',
      };
      item.slug = slugify(item.title);
      const all = getAll(storage.posts);
      const idx = all.findIndex(p => p.slug === item.slug);
      if (idx >= 0) all[idx] = item; else all.unshift(item);
      setAll(storage.posts, all);
      alert('Entrada guardada en tu navegador.');
      postForm.reset();
    });

    $('#preview-post')?.addEventListener('click', ()=>{
      const fd = new FormData(postForm);
      previewCard(`
        <article class="post-card">
          <img src="${fd.get('img') || ''}" alt="Portada">
          <div class="post-card__body">
            <div class="post-card__meta">${fd.get('author') || 'Olympus Theon'} · ${fd.get('date') || today}</div>
            <h2 class="post-card__title">${fd.get('title') || '(Sin título)'}</h2>
            <p>${fd.get('excerpt') || ''}</p>
            <div class="post-card__meta">${toArray(fd.get('tags')).map(t=>`#${t}`).join(' ')}</div>
          </div>
        </article>`);
    });

    if (bookForm) bookForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const fd = new FormData(bookForm);
      const item = {
        title: fd.get('title'),
        author: fd.get('author'),
        date: fd.get('date') || '',
        img: fd.get('img') || '',
        tags: toArray(fd.get('tags')),
        rating: parseFloat(fd.get('rating') || '0'),
        excerpt: fd.get('excerpt') || '',
        content: fd.get('content') || '',
      };
      item.slug = slugify(item.title);
      const all = getAll(storage.books);
      const idx = all.findIndex(b => b.slug === item.slug);
      if (idx >= 0) all[idx] = item; else all.unshift(item);
      setAll(storage.books, all);
      alert('Libro guardado en tu navegador.');
      bookForm.reset();
    });

    $('#preview-book')?.addEventListener('click', ()=>{
      const fd = new FormData(bookForm);
      const rating = parseFloat(fd.get('rating') || '0');
      const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
      previewCard(`
        <article class="book-card">
          <img src="${fd.get('img') || ''}" alt="Portada">
          <div class="book-card__body">
            <div class="book-card__meta">${fd.get('author') || ''} · ${fd.get('date') || ''}</div>
            <h2 class="book-card__title">${fd.get('title') || '(Sin título)'}</h2>
            <p>${fd.get('excerpt') || ''}</p>
            <div class="book-card__meta">${toArray(fd.get('tags')).map(t=>`#${t}`).join(' ')} { ${stars} }</div>
          </div>
        </article>`);
    });

    // Import/Export JSON
    $('#export-json')?.addEventListener('click', ()=>{
      const data = {
        posts: getAll(storage.posts),
        libros: getAll(storage.books)
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'olympus-theon-content.json';
      a.click();
    });

    $('#import-file')?.addEventListener('change', async (e)=>{
      const file = e.target.files?.[0]; if (!file) return;
      const text = await file.text();
      try{
        const data = JSON.parse(text);
        if (Array.isArray(data.posts)) setAll(storage.posts, data.posts);
        if (Array.isArray(data.libros)) setAll(storage.books, data.libros);
        alert('Contenido importado en tu navegador.');
      }catch(err){ alert('Archivo inválido.'); }
    });

    $('#reset-data')?.addEventListener('click', ()=>{
      if (confirm('¿Vaciar contenido local?')){
        localStorage.removeItem(storage.posts);
        localStorage.removeItem(storage.books);
        alert('Contenido local vaciado.');
      }
    });

    // Suscriptores
    $('#export-subs')?.addEventListener('click', ()=>{
      const subs = getAll(storage.subs);
      const csv = 'email\n' + subs.join('\n');
      const blob = new Blob([csv], {type:'text/csv'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'suscriptores.csv';
      a.click();
    });
    $('#clear-subs')?.addEventListener('click', ()=>{
      if (confirm('¿Borrar todos los suscriptores locales?')){
        localStorage.removeItem(storage.subs);
        alert('Suscriptores borrados.');
      }
    });

    // GitHub Publish (opcional)
    function base64encode(str){ return btoa(unescape(encodeURIComponent(str))); }

    function saveGhCfg(cfg){
      localStorage.setItem(storage.github, JSON.stringify(cfg));
    }
    function loadGhCfg(){
      try{ return JSON.parse(localStorage.getItem(storage.github) || '{}'); } catch(e){ return {}; }
    }

    const gh = loadGhCfg();
    $('#gh-repo').value = gh.repo || '';
    $('#gh-branch').value = gh.branch || 'main';
    $('#gh-path-posts').value = gh.path_posts || 'assets/data/posts.json';
    $('#gh-path-books').value = gh.path_books || 'assets/data/libros.json';
    $('#gh-token').value = gh.token || '';

    async function githubPublish(){
      const repo = $('#gh-repo').value.trim();
      const branch = $('#gh-branch').value.trim() || 'main';
      const pathPosts = $('#gh-path-posts').value.trim();
      const pathBooks = $('#gh-path-books').value.trim();
      const token = $('#gh-token').value.trim();

      if (!repo || !token){ alert('Faltan repo o token.'); return; }

      saveGhCfg({repo, branch, path_posts: pathPosts, path_books: pathBooks, token});

      const [owner, repoName] = repo.split('/');
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept':'application/vnd.github+json' };

      async function putFile(path, content){
        // Obtener SHA si existe
        let sha = null;
        const getRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}?ref=${branch}`, {headers});
        if (getRes.ok){ const j = await getRes.json(); sha = j.sha; }
        const body = {
          message: `chore: update ${path} via admin`,
          content: base64encode(content),
          branch
        };
        if (sha) body.sha = sha;
        const putRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, {
          method:'PUT',
          headers,
          body: JSON.stringify(body)
        });
        if (!putRes.ok){
          const txt = await putRes.text();
          throw new Error(`Error subiendo ${path}: ${txt}`);
        }
      }

      const posts = JSON.stringify(getAll(storage.posts), null, 2);
      const books = JSON.stringify(getAll(storage.books), null, 2);

      try{
        await putFile(pathPosts, posts);
        await putFile(pathBooks, books);
        alert('Publicado a GitHub (JSON actualizado en tu repo).');
      }catch(err){
        alert(err.message);
      }
    }

    $('#gh-publish')?.addEventListener('click', githubPublish);
  }
})();