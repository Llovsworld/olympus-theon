
// Olympus Theon Admin v2.2 — local editor + robust GitHub publishing with diagnostics
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const storage = { posts:'ot_posts', books:'ot_books', subs:'ot_subscribers', gh:'ot_github_cfg' };
  const today = new Date().toISOString().slice(0,10);
  const slugify = (s) => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  function arr(str){ return (str||'').split(',').map(s=>s.trim()).filter(Boolean) }
  function getAll(k){ return JSON.parse(localStorage.getItem(k)||'[]') }
  function setAll(k,v){ localStorage.setItem(k, JSON.stringify(v)) }

  // ---------- Forms (guardar en local) ----------
  if ($('#form-post')) {
    $('#form-post').addEventListener('submit', ev => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      const item = {
        title: fd.get('title'),
        author: fd.get('author')||'Olympus Theon',
        date: fd.get('date')||today,
        img: fd.get('img')||'',
        tags: arr(fd.get('tags')),
        excerpt: fd.get('excerpt')||'',
        content: fd.get('content')||''
      };
      item.slug = slugify(item.title);
      const all = getAll(storage.posts);
      const i = all.findIndex(p => p.slug===item.slug);
      if(i>=0) all[i]=item; else all.unshift(item);
      setAll(storage.posts, all);
      alert('Entrada guardada localmente.');
      ev.target.reset();
    });
    $('#preview-post')?.addEventListener('click', ()=> alert('Previsualización rápida creada arriba (usa blog.html para ver listado).'));
  }

  if ($('#form-book')) {
    $('#form-book').addEventListener('submit', ev => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      const item = {
        title: fd.get('title'), author: fd.get('author'),
        date: fd.get('date')||'', img: fd.get('img')||'',
        tags: arr(fd.get('tags')), rating: parseFloat(fd.get('rating')||'0'),
        excerpt: fd.get('excerpt')||'', content: fd.get('content')||''
      };
      item.slug = slugify(item.title);
      const all = getAll(storage.books);
      const i = all.findIndex(b => b.slug===item.slug);
      if(i>=0) all[i]=item; else all.unshift(item);
      setAll(storage.books, all);
      alert('Libro guardado localmente.');
      ev.target.reset();
    });
    $('#preview-book')?.addEventListener('click', ()=> alert('Previsualización rápida creada arriba (usa libros.html para ver listado).'));
  }

  // ---------- GitHub Publisher ----------
  const GH = {
    headers(token){
      return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      };
    },
    async getRepo(owner, repo, token){
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: GH.headers(token)
      });
      return r;
    },
    async getRef(owner, repo, branch, token){
      return fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, { headers: GH.headers(token) });
    },
    async getContent(owner, repo, path, branch, token){
      return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`, { headers: GH.headers(token) });
    },
    async putContent(owner, repo, path, branch, token, content, sha /* optional */){
      const body = { message: `chore: update ${path} via admin`, content: btoa(unescape(encodeURIComponent(content))), branch };
      if (sha) body.sha = sha;
      return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method:'PUT', headers: GH.headers(token), body: JSON.stringify(body)
      });
    }
  };

  function diag(msg, cls=''){ const box = $('#gh-diagnose'); box.innerHTML += `<div class="badge ${cls}">${msg}</div>`; }
  function diagClear(){ $('#gh-diagnose').innerHTML=''; }

  function readCfg(){
    const cfg = JSON.parse(localStorage.getItem(storage.gh)||'{}');
    $('#gh-repo').value = cfg.repo || $('#gh-repo').value || '';
    $('#gh-branch').value = cfg.branch || 'main';
    $('#gh-path-posts').value = cfg.path_posts || 'assets/data/posts.json';
    $('#gh-path-books').value = cfg.path_books || 'assets/data/libros.json';
    // token intentionally NOT auto-filled for safety unless user opted-in previously
    if (cfg.save && cfg.token) { $('#gh-token').value = cfg.token; $('#gh-save').checked = true; }
  }

  function saveCfg(){
    const cfg = {
      repo: $('#gh-repo').value.trim(),
      branch: $('#gh-branch').value.trim(),
      path_posts: $('#gh-path-posts').value.trim(),
      path_books: $('#gh-path-books').value.trim(),
      token: $('#gh-token').value.trim(),
      save: $('#gh-save').checked
    };
    localStorage.setItem(storage.gh, JSON.stringify(cfg));
    if (!cfg.save) { // do not keep token
      const tmp = JSON.parse(localStorage.getItem(storage.gh)||'{}'); delete tmp.token; localStorage.setItem(storage.gh, JSON.stringify(tmp));
    }
  }

  async function testConnection(){
    diagClear();
    saveCfg();
    const [owner, repo] = $('#gh-repo').value.trim().split('/');
    const branch = $('#gh-branch').value.trim();
    const token = $('#gh-token').value.trim();

    if (!owner || !repo || !token){ diag('Faltan owner/repo o token', 'err'); return; }

    // 1) Repo access
    let r = await GH.getRepo(owner, repo, token);
    if (r.status === 200){ diag('Repo ✓', 'ok'); }
    else if (r.status === 404){ diag('Repo 404 (token sin acceso o repo mal escrito)', 'err'); return; }
    else { diag(`Repo error ${r.status}`, 'err'); return; }

    // 2) Branch
    r = await GH.getRef(owner, repo, branch, token);
    if (r.status === 200){ diag('Branch ✓', 'ok'); }
    else if (r.status === 404){ diag('Branch 404 (usa "main" o confirma el nombre)', 'err'); return; }
    else { diag(`Branch error ${r.status}`, 'err'); return; }

    // 3) Paths existence (ok si no existen)
    const p1 = await GH.getContent(owner, repo, $('#gh-path-posts').value.trim(), branch, token);
    diag(p1.status===200 ? 'posts.json existe' : 'posts.json no existe (se creará)', p1.ok?'ok':'warn');
    const p2 = await GH.getContent(owner, repo, $('#gh-path-books').value.trim(), branch, token);
    diag(p2.status===200 ? 'libros.json existe' : 'libros.json no existe (se creará)', p2.ok?'ok':'warn');

    diag('Conexión OK — ya puedes Publicar', 'ok');
  }

  async function publish(){
    diagClear();
    saveCfg();
    const [owner, repo] = $('#gh-repo').value.trim().split('/');
    const branch = $('#gh-branch').value.trim();
    const token = $('#gh-token').value.trim();
    const pathPosts = $('#gh-path-posts').value.trim();
    const pathBooks = $('#gh-path-books').value.trim();
    if (!owner || !repo || !token){ diag('Faltan owner/repo o token','err'); return; }

    // Download remote (if any) to merge
    async function fetchJSON(path){
      const r = await GH.getContent(owner, repo, path, branch, token);
      if (r.status === 200){
        const j = await r.json();
        const raw = decodeURIComponent(escape(atob((j.content||'').replace(/\n/g,''))));
        return { data: JSON.parse(raw), sha: j.sha };
      }
      if (r.status === 404){ return { data: [], sha: null }; }
      throw new Error(`Error ${r.status} leyendo ${path}`);
    }

    try{
      // 1) repo/branch check
      let r = await GH.getRepo(owner, repo, token);
      if (r.status !== 200){ diag(`Repo error ${r.status} (token sin acceso)`, 'err'); return; }
      r = await GH.getRef(owner, repo, branch, token);
      if (r.status !== 200){ diag(`Branch error ${r.status}`, 'err'); return; }

      // 2) merge remote + local
      const remP = await fetchJSON(pathPosts);
      const remB = await fetchJSON(pathBooks);
      const localP = getAll(storage.posts), localB = getAll(storage.books);

      const mapP = new Map(); [...(remP.data||[]), ...(localP||[])].forEach(x=> mapP.set((x.slug||slugify(x.title)), {...x, slug:(x.slug||slugify(x.title))}));
      const mapB = new Map(); [...(remB.data||[]), ...(localB||[])].forEach(x=> mapB.set((x.slug||slugify(x.title)), {...x, slug:(x.slug||slugify(x.title))}));
      const mergedP = Array.from(mapP.values());
      const mergedB = Array.from(mapB.values());

      // 3) PUT posts
      let put = await GH.putContent(owner, repo, pathPosts, branch, token, JSON.stringify(mergedP, null, 2), remP.sha);
      if (!put.ok){ const t = await put.text(); throw new Error(`Error subiendo ${pathPosts}: ${t}`); }
      diag('posts.json actualizado', 'ok');

      // 4) PUT libros
      put = await GH.putContent(owner, repo, pathBooks, branch, token, JSON.stringify(mergedB, null, 2), remB.sha);
      if (!put.ok){ const t = await put.text(); throw new Error(`Error subiendo ${pathBooks}: ${t}`); }
      diag('libros.json actualizado', 'ok');

      diag('Publicado a GitHub ✓', 'ok');
      alert('Publicado a GitHub (JSON actualizado en tu repo).');
    } catch(e){
      diag(e.message || 'Fallo publicando', 'err');
      alert(e.message || 'Fallo publicando');
    }
  }

  if (window.page === 'admin'){
    readCfg();
    $('#gh-test')?.addEventListener('click', testConnection);
    $('#gh-publish')?.addEventListener('click', publish);
  }
})();