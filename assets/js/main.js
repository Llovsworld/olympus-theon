// Olympus Theon v2 — JS base para menú, año, revelado al hacer scroll y suscripciones
(function(){
  const $ = (s, d=document) => d.querySelector(s);
  const $$ = (s, d=document) => d.querySelectorAll(s);

  // Año en footer
  const yEl = $('#year'); if (yEl) yEl.textContent = new Date().getFullYear();

  // Menú móvil
  const toggle = $('.menu-toggle'); const nav = $('#nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold:.08});
  $$('.reveal').forEach(el => io.observe(el));

  // Suscripción (localStorage)
  const subForm = $('#subscribe-form');
  if (subForm) {
    subForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const email = $('#sub-email').value.trim();
      if (!email) return;
      const key = 'ot_subscribers';
      const all = JSON.parse(localStorage.getItem(key) || '[]');
      if (!all.includes(email)) all.push(email);
      localStorage.setItem(key, JSON.stringify(all));
      subForm.reset();
      alert('¡Gracias! Suscripción guardada localmente.');
    });
  }

  // Contacto: mailto
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name') || '';
      const email = fd.get('email') || '';
      const subject = fd.get('subject') || 'Consulta desde la web';
      const message = fd.get('message') || '';
      const body = `${message}\n\n— ${name} <${email}>`;
      const url = `mailto:contacto@olympustheon.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
      form.reset();
    });
  }
})();