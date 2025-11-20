// cms.js – Olympus Theon
// Editor local (posts / libros) + publicación a GitHub (posts.json / libros.json)

(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  const STORAGE_POSTS = 'ot_posts';
  const STORAGE_BOOKS = 'ot_books';
  const TODAY = new Date().toISOString().slice(0, 10);

  const slugify = (s) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const parseTags = (str) =>
    (str || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  function getAll(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      console.error('Error leyendo localStorage', key, e);
      return [];
    }
  }

  function setAll(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ---------------------------------------------------------------------------
  // 1) GUARDAR ENTRADAS (BLOG) EN LOCALSTORAGE
  // ---------------------------------------------------------------------------

  function setupPostForm() {
    const form =
      $('#form-post') ||
      $('#postForm') ||
      document.querySelector('form[data-type="post"]');

    if (!form) return;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);

      const item = {
        title: fd.get('title') || '',
        author: fd.get('author') || 'Olympus Theon',
        date: fd.get('date') || TODAY,
        img: fd.get('img') || '',
        tags: parseTags(fd.get('tags')),
        excerpt: fd.get('excerpt') || '',
        content: fd.get('content') || ''
      };

      if (!item.title.trim()) {
        alert('La entrada necesita al menos un título.');
        return;
      }

      item.slug = slugify(item.title);
      const all = getAll(STORAGE_POSTS);
      const idx = all.findIndex((p) => p.slug === item.slug);
      if (idx >= 0) {
        all[idx] = item;
      } else {
        all.unshift(item);
      }
      setAll(STORAGE_POSTS, all);

      alert('Entrada guardada en este navegador.');
      try {
        form.reset();
      } catch (e) {}
    });
  }

  // ---------------------------------------------------------------------------
  // 2) GUARDAR LIBROS EN LOCALSTORAGE
  // ---------------------------------------------------------------------------

  function setupBookForm() {
    const form =
      $('#form-book') ||
      $('#bookForm') ||
      document.querySelector('form[data-type="book"]');

    if (!form) return;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);

      const item = {
        title: fd.get('title') || '',
        author: fd.get('author') || '',
        date: fd.get('date') || '',
        img: fd.get('img') || '',
        tags: parseTags(fd.get('tags')),
        rating: parseFloat(fd.get('rating') || '0') || 0,
        excerpt: fd.get('excerpt') || '',
        content: fd.get('content') || ''
      };

      if (!item.title.trim()) {
        alert('El libro necesita al menos un título.');
        return;
      }

      item.slug = slugify(item.title);
      const all = getAll(STORAGE_BOOKS);
      const idx = all.findIndex((b) => b.slug === item.slug);
      if (idx >= 0) {
        all[idx] = item;
      } else {
        all.unshift(item);
      }
      setAll(STORAGE_BOOKS, all);

      alert('Libro guardado en este navegador.');
      try {
        form.reset();
      } catch (e) {}
    });
  }

  // ---------------------------------------------------------------------------
  // 3) PUBLICAR A GITHUB – githubPublish()
  // ---------------------------------------------------------------------------

  async function githubPublish() {
    // Campos del formulario de GitHub
    const repoInput =
      document.getElementById('gh-repo') ||
      document.getElementById('github-repo');
    const branchInput =
      document.getElementById('gh-branch') ||
      document.getElementById('github-branch');
    const postsInput =
      document.getElementById('gh-path-posts') ||
      document.getElementById('github-posts-path');
    const booksInput =
      document.getElementById('gh-path-books') ||
      document.getElementById('github-books-path');
    const tokenInput =
      document.getElementById('gh-token') ||
      document.getElementById('github-token');

    const repo = repoInput ? repoInput.value.trim() : '';
    const branch = branchInput ? branchInput.value.trim() || 'main' : 'main';
    const pathPosts = postsInput
      ? postsInput.value.trim() || 'assets/data/posts.json'
      : 'assets/data/posts.json';
    const pathBooks = booksInput
      ? booksInput.value.trim() || 'assets/data/libros.json'
      : 'assets/data/libros.json';
    const token = tokenInput ? tokenInput.value.trim() : '';

    if (!repo || !token) {
      alert('Faltan owner/repo o token de GitHub.');
      return;
    }

    const parts = repo.split('/');
    if (parts.length !== 2) {
      alert(
        'El repo debe tener formato owner/repo, por ejemplo: Llowsworld/olympus-theon'
      );
      return;
    }

    const [owner, repoName] = parts;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    };

    const localPosts = getAll(STORAGE_POSTS);
    const localBooks = getAll(STORAGE_BOOKS);

    const decodeFile = (j) => {
      const raw = atob((j.content || '').replace(/\n/g, ''));
      const jsonStr = decodeURIComponent(escape(raw));
      return JSON.parse(jsonStr || '[]');
    };

    async function loadRemote(path) {
      const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}?ref=${encodeURIComponent(
        branch
      )}`;
      const r = await fetch(url, { headers });

      if (r.status === 404) {
        // El archivo aún no existe: lista vacía, sin sha
        return { data: [], sha: null };
      }

      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`Error leyendo ${path}: ${r.status} - ${txt}`);
      }

      const j = await r.json();
      return { data: decodeFile(j), sha: j.sha };
    }

    async function putFile(path, content, sha) {
      const body = {
        message: `chore: update ${path} via admin`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch
      };
      if (sha) body.sha = sha;

      const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;
      const r = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`Error subiendo ${path}: ${r.status} - ${txt}`);
      }
    }

    try {
      // 1) Comprobar repo
      let r = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}`,
        { headers }
      );
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(
          `El repo o el token no son válidos: ${r.status} - ${txt}`
        );
      }

      // 2) Comprobar rama
      r = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/${branch}`,
        { headers }
      );
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(
          `La rama "${branch}" no existe o no es accesible: ${r.status} - ${txt}`
        );
      }

      // 3) Leer remoto
      const remPosts = await loadRemote(pathPosts);
      const remBooks = await loadRemote(pathBooks);

      // 4) Fusionar remoto + local por slug (local tiene prioridad)
      const mapP = new Map();
      (remPosts.data || []).forEach((x) => {
        const slug = x.slug || slugify(x.title);
        mapP.set(slug, { ...x, slug });
      });
      (localPosts || []).forEach((x) => {
        const slug = x.slug || slugify(x.title);
        mapP.set(slug, { ...x, slug });
      });
      const mergedPosts = Array.from(mapP.values());

      const mapB = new Map();
      (remBooks.data || []).forEach((x) => {
        const slug = x.slug || slugify(x.title);
        mapB.set(slug, { ...x, slug });
      });
      (localBooks || []).forEach((x) => {
        const slug = x.slug || slugify(x.title);
        mapB.set(slug, { ...x, slug });
      });
      const mergedBooks = Array.from(mapB.values());

      // 5) Subir a GitHub
      await putFile(
        pathPosts,
        JSON.stringify(mergedPosts, null, 2),
        remPosts.sha
      );
      await putFile(
        pathBooks,
        JSON.stringify(mergedBooks, null, 2),
        remBooks.sha
      );

      alert('Publicado a GitHub (posts.json y libros.json actualizados).');
    } catch (e) {
      console.error(e);
      alert(e.message || 'Error publicando en GitHub.');
    }
  }

  // Exponer la función para que el botón del HTML pueda usarla
  window.githubPublish = githubPublish;

  // Inicializar formularios cuando cargue la página
  window.addEventListener('DOMContentLoaded', () => {
    setupPostForm();
    setupBookForm();
  });
})();
