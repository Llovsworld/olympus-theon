// Olympus Theon Admin v2.3 — Refactorización con modularidad mejorada
(function(){
  'use strict';
  // -------------------- Utilerías --------------------
  const $ = s => document.querySelector(s);
  const storage = { posts:'ot_posts', books:'ot_books', subs:'ot_subscribers', gh:'ot_github_cfg' };
  const today = new Date().toISOString().slice(0,10);

  // Normaliza la cadena para un uso seguro como slug/URL
  const slugify = (s) => (s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // Quita acentos
    .replace(/[^a-z0-9]+/g,'-') // Reemplaza no-alfanuméricos con guion
    .replace(/(^-|-$)/g,''); // Quita guiones al inicio/fin

  const arr = (str) => (str||'').split(',').map(s=>s.trim()).filter(Boolean);
  const getAll = (k) => JSON.parse(localStorage.getItem(k)||'[]');
  const setAll = (k,v) => localStorage.setItem(k, JSON.stringify(v));

  // -------------------- Formularios (Guardar en LocalStorage) --------------------
  const handleFormSubmit = (formId, storageKey, type) => {
    const form = $(formId);
    if (!form) return;

    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      const item = {
        title: fd.get('title'),
        author: fd.get('author') || (type === 'post' ? 'Olympus Theon' : ''),
        date: fd.get('date') || today,
        img: fd.get('img') || '',
        tags: arr(fd.get('tags')),
        excerpt: fd.get('excerpt') || '',
        content: fd.get('content') || ''
      };
      if (type === 'book') item.rating = parseFloat(fd.get('rating')||'0');
      
      item.slug = slugify(item.title);

      const all = getAll(storageKey);
      const i = all.findIndex(p => p.slug === item.slug);
      
      if(i >= 0) all[i] = item; // Actualizar
      else all.unshift(item); // Insertar al inicio (más reciente)
      
      setAll(storageKey, all);
      alert(`${type === 'post' ? 'Entrada' : 'Libro'} guardado localmente.`);
      ev.target.reset();
    });

    const previewBtn = $(`#preview-${type}`);
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        alert('Previsualización rápida creada arriba (usa el listado correspondiente).');
      });
    }
  };

  handleFormSubmit('#form-post', storage.posts, 'post');
  handleFormSubmit('#form-book', storage.books, 'book');


  // -------------------- GitHub Publisher --------------------
  const GH = {
    headers(token){
      return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      };
    },
    
    async fetchAPI(url, token, options = {}){
      const defaultOptions = { headers: GH.headers(token) };
      const r = await fetch(url, { ...defaultOptions, ...options });
      return r;
    },

    // Comprueba acceso al repo
    async getRepo(owner, repo, token){
      return GH.fetchAPI(`https://api.github.com/repos/${owner}/${repo}`, token);
    },
    
    // Comprueba la rama
    async getRef(owner, repo, branch, token){
      return GH.fetchAPI(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, token);
    },
    
    // Obtiene el contenido del archivo (incluyendo SHA)
    async getContent(owner, repo, path, branch, token){
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
      return GH.fetchAPI(url, token);
    },
    
    // Sube el contenido del archivo (crea o actualiza si se da SHA)
    async putContent(owner, repo, path, branch, token, content, sha = null){
      const body = { 
        message: `chore: update ${path} via admin`, 
        content: btoa(unescape(encodeURIComponent(content))), 
        branch 
      };
      if (sha) body.sha = sha;

      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      return GH.fetchAPI(url, token, { method:'PUT', body: JSON.stringify(body) });
    }
  };

  const diag = (msg, cls='') => { 
    const box = $('#gh-diagnose'); 
    if (box) box.innerHTML += `<div class="badge ${cls}">${msg}</div>`; 
  };
  const diagClear = () => { 
    const box = $('#gh-diagnose'); 
    if (box) box.innerHTML = ''; 
  };

  function readCfg(){
    const cfg = JSON.parse(localStorage.getItem(storage.gh)||'{}');
    if ($('#gh-repo')) $('#gh-repo').value = cfg.repo || '';
    if ($('#gh-branch')) $('#gh-branch').value = cfg.branch || 'main';
    if ($('#gh-path-posts')) $('#gh-path-posts').value = cfg.path_posts || 'assets/data/posts.json';
    if ($('#gh-path-books')) $('#gh-path-books').value = cfg.path_books || 'assets/data/libros.json';
    
    // Token intencionalmente NO auto-llenado por defecto
    if (cfg.save && cfg.token) { 
      if ($('#gh-token')) $('#gh-token').value = cfg.token; 
      if ($('#gh-save')) $('#gh-save').checked = true; 
    }
  }

  function saveCfg(){
    const cfg = {
      repo: $('#gh-repo')?.value.trim() || '',
      branch: $('#gh-branch')?.value.trim() || 'main',
      path_posts: $('#gh-path-posts')?.value.trim() || 'assets/data/posts.json',
      path_books: $('#gh-path-books')?.value.trim() || 'assets/data/libros.json',
      token: $('#gh-token')?.value.trim() || '',
      save: $('#gh-save')?.checked || false
    };
    localStorage.setItem(storage.gh, JSON.stringify(cfg));
    // Si save es falso, limpia el token del localStorage por seguridad
    if (!cfg.save) {
      const tmp = JSON.parse(localStorage.getItem(storage.gh)||'{}'); delete tmp.token; localStorage.setItem(storage.gh, JSON.stringify(tmp));
    }
    return cfg;
  }

  async function testConnection(){
    diagClear();
    const cfg = saveCfg(); // Guardar configuración y obtener valores
    const [owner, repo] = cfg.repo.split('/');
    if (!owner || !repo || !cfg.token){ diag('Faltan owner/repo o token', 'err'); return; }

    try {
      // 1) Repo access
      let r = await GH.getRepo(owner, repo, cfg.token);
      if (r.status === 200){ diag('Repo ✓', 'ok'); }
      else if (r.status === 404){ diag('Repo 404 (token sin acceso o repo mal escrito)', 'err'); return; }
      else { diag(`Repo error ${r.status}`, 'err'); return; }

      // 2) Branch
      r = await GH.getRef(owner, repo, cfg.branch, cfg.token);
      if (r.status === 200){ diag('Branch ✓', 'ok'); }
      else if (r.status === 404){ diag('Branch 404 (usa "main" o confirma el nombre)', 'err'); return; }
      else { diag(`Branch error ${r.status}`, 'err'); return; }

      // 3) Paths existence (ok si no existen)
      const p1 = await GH.getContent(owner, repo, cfg.path_posts, cfg.branch, cfg.token);
      diag(p1.status === 200 ? 'posts.json existe' : 'posts.json no existe (se creará)', p1.ok ? 'ok' : 'warn');
      const p2 = await GH.getContent(owner, repo, cfg.path_books, cfg.branch, cfg.token);
      diag(p2.status === 200 ? 'libros.json existe' : 'libros.json no existe (se creará)', p2.ok ? 'ok' : 'warn');

      diag('Conexión OK — ya puedes Publicar', 'ok');
    } catch (e) {
      diag(`Error de conexión: ${e.message}`, 'err');
    }
  }

  async function publish(){
    diagClear();
    const cfg = saveCfg(); // Guardar configuración y obtener valores
    const [owner, repo] = cfg.repo.split('/');
    if (!owner || !repo || !cfg.token){ diag('Faltan owner/repo o token','err'); return; }

    // Función auxiliar para leer JSON remoto
    async function fetchJSON(path){
      const r = await GH.getContent(owner, repo, path, cfg.branch, cfg.token);
      if (r.status === 200){
        const j = await r.json();
        // La decodificación es necesaria para manejar correctamente el contenido base64 de GitHub
        const raw = decodeURIComponent(escape(atob((j.content||'').replace(/\n/g,''))));
        return { data: JSON.parse(raw), sha: j.sha };
      }
      if (r.status === 404){ return { data: [], sha: null }; } // Archivo no existe, se creará
      throw new Error(`Error ${r.status} leyendo ${path}`);
    }

    try{
      // 1) Comprobación de acceso y rama (opcional, pero buena práctica)
      let r = await GH.getRepo(owner, repo, cfg.token);
      if (r.status !== 200) throw new Error(`Repo error ${r.status} (token sin acceso o repo mal escrito)`);
      r = await GH.getRef(owner, repo, cfg.branch, cfg.token);
      if (r.status !== 200) throw new Error(`Branch error ${r.status} (asegúrate que "${cfg.branch}" exista)`);
        
      // 2) Cargar local y remoto
      const remP = await fetchJSON(cfg.path_posts);
      const remB = await fetchJSON(cfg.path_books);
      const localP = getAll(storage.posts), localB = getAll(storage.books);

      // 3) Fusionar remoto + local (local sobrescribe remoto si tienen el mismo slug)
      const mergeData = (remoteData, localData) => {
        const map = new Map(); 
        [...(remoteData || []), ...(localData || [])].forEach(x => {
          const slug = x.slug || slugify(x.title);
          map.set(slug, { ...x, slug });
        });
        return Array.from(map.values());
      };

      const mergedP = mergeData(remP.data, localP);
      const mergedB = mergeData(remB.data, localB);

      // 4) PUT posts
      let put = await GH.putContent(owner, repo, cfg.path_posts, cfg.branch, cfg.token, JSON.stringify(mergedP, null, 2), remP.sha);
      if (!put.ok){ const t = await put.text(); throw new Error(`Error subiendo ${cfg.path_posts}: ${put.status} - ${t}`); }
      diag('posts.json actualizado', 'ok');

      // 5) PUT libros
      put = await GH.putContent(owner, repo, cfg.path_books, cfg.branch, cfg.token, JSON.stringify(mergedB, null, 2), remB.sha);
      if (!put.ok){ const t = await put.text(); throw new Error(`Error subiendo ${cfg.path_books}: ${put.status} - ${t}`); }
      diag('libros.json actualizado', 'ok');

      diag('Publicado a GitHub ✓', 'ok');
      alert('Publicado a GitHub (JSON actualizado en tu repo).');
    } catch(e){
      diag(`Fallo publicando: ${e.message}`, 'err');
      alert(e.message || 'Fallo publicando en GitHub.');
    }
  }

  // -------------------- Inicialización --------------------
  if (window.page === 'admin'){
    readCfg();
    $('#gh-test')?.addEventListener('click', testConnection);
    $('#gh-publish')?.addEventListener('click', publish);
  }
})();
