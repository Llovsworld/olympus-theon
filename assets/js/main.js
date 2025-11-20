
(function(){
  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
  const yEl=$('#year'); if(yEl) yEl.textContent=new Date().getFullYear();
  const t=$('.menu-toggle'), n=$('#nav'); if(t&&n){t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false')})}
  // Contact mailto
  const f=$('#contact-form'); if(f){f.addEventListener('submit',ev=>{ev.preventDefault();const d=new FormData(f); const url=`mailto:contacto@olympustheon.com?subject=${encodeURIComponent(d.get('subject')||'Consulta')}&body=${encodeURIComponent((d.get('message')||'')+`\n\n— ${(d.get('name')||'')} <${(d.get('email')||'')}>`)}`; location.href=url; f.reset();})}
})();