'use strict';
(() => {
  const data = window.SITE_DATA;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollToSection = id => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
  const progress = document.createElement('div'); progress.className = 'reading-progress'; document.body.append(progress);
  const top = document.createElement('button'); top.className = 'icon-btn back-top'; top.textContent = '↑'; top.ariaLabel = 'Về đầu trang'; top.onclick = () => scrollToSection('home'); document.body.append(top);
  const updateScroll = () => {
    progress.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
    $('nav').classList.toggle('is-scrolled', scrollY > 50); top.hidden = scrollY < 600;
  };
  addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
  const targets = { 'Giới Thiệu': 'intro', 'Dụng Cụ': 'tools', 'Ảnh Before': 'photos', 'Lộ Trình': 'course', 'Liên Hệ': 'contact', 'Bắt Đầu Hành Trình': 'intro', 'Về đầu trang': 'home' };
  $$('button').forEach(button => {
    const text = button.textContent.trim();
    if (targets[text]) { button.dataset.scroll = targets[text]; button.onclick = () => scrollToSection(targets[text]); }
    button.type = 'button';
  });
  $$('[id^="navbar-logo"]').forEach(logo => { logo.parentElement.setAttribute('role', 'button'); logo.parentElement.tabIndex = 0; logo.parentElement.onclick = () => scrollToSection('home'); logo.parentElement.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToSection('home'); } }; });
  const explore = $('#home .bottom-10'); explore.role = 'button'; explore.tabIndex = 0; explore.style.cursor = 'pointer'; explore.onclick = () => scrollToSection('intro'); explore.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToSection('intro'); } };
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) $$('button[data-scroll]').forEach(b => { if (b.dataset.scroll === entry.target.id) b.setAttribute('aria-current', 'location'); else b.removeAttribute('aria-current'); });
  }), { rootMargin: '-20% 0px -55% 0px' });
  $$('main>section[id]').forEach(s => sectionObserver.observe(s));
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: .08 });
  $$('main>section:not(#home)>div>div, #tools .grid>div, #photos .snap-x>div').forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--delay', `${i % 3 * .07}s`); revealObserver.observe(el); });
  $$('iframe').forEach(frame => { frame.loading = 'lazy'; frame.title = 'Video hướng dẫn Face Yoga'; frame.allowFullscreen = true; frame.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'); });

  const dialog = document.createElement('dialog'); dialog.className = 'site-dialog'; dialog.ariaLabel = 'Xem ảnh toàn màn hình';
  dialog.innerHTML = '<div class="dialog-toolbar"><h2 class="dialog-title" id="image-title"></h2><div class="dialog-actions"><button class="icon-btn" data-action="zoom" aria-label="Phóng to ảnh" title="Phóng to / thu nhỏ">＋</button><button class="icon-btn" data-action="fullscreen" aria-label="Toàn màn hình" title="Toàn màn hình">⛶</button><button class="icon-btn" data-action="close" aria-label="Đóng ảnh" title="Đóng (Esc)">×</button></div></div><div class="gallery-stage"><img alt=""></div><button class="icon-btn gallery-arrow prev" aria-label="Ảnh trước">‹</button><button class="icon-btn gallery-arrow next" aria-label="Ảnh tiếp theo">›</button><div class="gallery-caption" aria-live="polite"></div>';
  document.body.append(dialog);
  const contentDialog = document.createElement('dialog'); contentDialog.className = 'site-dialog content-dialog'; contentDialog.ariaLabel = 'Thông tin chi tiết'; document.body.append(contentDialog);
  let currentImages = [], imageIndex = 0, touchX = null;
  const modalState = new WeakMap();
  function openModal(modal) { modalState.set(modal, { focus: document.activeElement, overflow: document.body.style.overflow }); document.body.style.overflow = 'hidden'; modal.showModal(); }
  function closeModal(modal) { if (document.fullscreenElement === dialog) document.exitFullscreen().catch(() => {}); modal.close(); }
  [dialog, contentDialog].forEach(modal => { modal.addEventListener('close', () => { const saved = modalState.get(modal); document.body.style.overflow = saved?.overflow || ''; if (modal === contentDialog) modal.replaceChildren(); saved?.focus?.focus({ preventScroll: true }); }); modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); }); });
  function renderImage() {
    const item = currentImages[imageIndex]; const img = $('.gallery-stage img', dialog);
    $('.gallery-stage', dialog).classList.remove('is-zoomed'); img.src = item.src; img.alt = item.alt;
    $('#image-title', dialog).textContent = item.alt;
    $('.gallery-caption', dialog).textContent = `${imageIndex + 1} / ${currentImages.length} · ${item.alt}`;
    $('.prev', dialog).hidden = $('.next', dialog).hidden = currentImages.length < 2;
    $('[data-action="zoom"]', dialog).setAttribute('aria-pressed', 'false');
  }
  function changeImage(direction) { imageIndex = (imageIndex + direction + currentImages.length) % currentImages.length; renderImage(); }
  function zoom() { const active = $('.gallery-stage', dialog).classList.toggle('is-zoomed'); $('[data-action="zoom"]', dialog).setAttribute('aria-pressed', String(active)); }
  $('[data-action="close"]', dialog).onclick = () => closeModal(dialog);
  $('[data-action="zoom"]', dialog).onclick = zoom;
  $('.gallery-stage img', dialog).onclick = zoom;
  $('[data-action="fullscreen"]', dialog).onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else if (dialog.requestFullscreen) await dialog.requestFullscreen(); } catch { /* The dialog itself already fills the viewport. */ } };
  $('.prev', dialog).onclick = () => changeImage(-1); $('.next', dialog).onclick = () => changeImage(1);
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); changeImage(-1); } if (e.key === 'ArrowRight') { e.preventDefault(); changeImage(1); } });
  const stage = $('.gallery-stage', dialog);
  stage.addEventListener('click', e => { if (e.target === stage) closeModal(dialog); });
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => { if (!stage.classList.contains('is-zoomed') && touchX !== null) { const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 60) changeImage(dx > 0 ? -1 : 1); } touchX = null; }, { passive: true });
  function enableImage(img, label) {
    img.dataset.gallery = 'true'; img.alt = label || img.alt; img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', `Xem ảnh: ${img.alt}`);
    img.onclick = e => { e.preventDefault(); const scope = img.closest('.content-sheet') || img.closest('section') || document; currentImages = $$('img[data-gallery]', scope).map(i => ({ src: i.currentSrc || i.src, alt: i.alt })); imageIndex = $$('img[data-gallery]', scope).indexOf(img); renderImage(); openModal(dialog); };
    img.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); img.click(); } };
  }
  const imageLabels = ['Không gian chăm sóc tự nhiên', 'MeGa Phương', ...data.toolsGallery.items.map(i => i.name.trim()), 'Enterosgel', 'Hướng dẫn chụp ảnh Before', ...Array.from({ length: 5 }, (_, i) => data.photoAngles[`card${i + 1}`]), 'Hành trình Face Yoga'];
  $$('main img').forEach((img, i) => { if (!img.closest('#home')) enableImage(img, imageLabels[i] || 'Hình ảnh Face Yoga'); if (i > 1) img.loading = 'lazy'; img.decoding = 'async'; });
  // Decorative captions must not block image clicks.
  $$('main img').forEach(img => {
    [img.parentElement, img.parentElement.parentElement].forEach(parent => {
      [...parent.children].filter(el => el !== img && el !== img.parentElement && el.classList.contains('absolute')).forEach(el => el.classList.add('image-overlay'));
    });
  });
  function sheet(title) {
    const card = document.createElement('div'); card.className = 'content-sheet';
    const toolbar = document.createElement('div'); toolbar.className = 'dialog-toolbar'; const heading = document.createElement('h2'); heading.textContent = title; heading.id = 'detail-title'; const close = document.createElement('button'); close.className = 'icon-btn'; close.textContent = '×'; close.ariaLabel = 'Đóng'; close.onclick = () => closeModal(contentDialog); toolbar.append(heading, close); card.append(toolbar); contentDialog.replaceChildren(card); contentDialog.setAttribute('aria-labelledby', heading.id); return card;
  }
  function showDetail(title, detail) {
    const card = sheet(title); const paragraph = document.createElement('p'); paragraph.textContent = detail.content; card.append(paragraph);
    if (detail.image) { const image = document.createElement('img'); image.src = detail.image; card.append(image); enableImage(image, title); }
    if (detail.youtubeUrl) { const match = detail.youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]{11})/); if (match) { const iframe = document.createElement('iframe'); iframe.src = `https://www.youtube.com/embed/${match[1]}`; iframe.title = title; iframe.allowFullscreen = true; card.append(iframe); } }
    openModal(contentDialog);
  }
  function showHelp() {
    const card = sheet(data.qa.title); const note = document.createElement('p'); note.textContent = 'Chọn câu hỏi để xem hướng dẫn hoặc liên hệ trực tiếp với MeGa Phương.'; card.append(note);
    data.qa.items.forEach(item => { const details = document.createElement('details'); const summary = document.createElement('summary'); summary.textContent = item.q; const p = document.createElement('p'); p.textContent = item.a; details.append(summary, p); card.append(details); }); const a = document.createElement('a'); a.href = 'https://zalo.me/0966888609'; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Nhắn tin MeGa Phương qua Zalo'; a.className = 'primary-btn'; a.style.marginTop = '24px'; card.append(a); openModal(contentDialog);
  }
  const actions = {
    'Xem chi tiết dụng cụ': () => showDetail('Chi tiết dụng cụ', data.prepTools.detail),
    'Đọc kỹ hơn về thải độc': () => showDetail(data.prepDetox.title, data.prepDetox.detail),
    'Xem hướng dẫn chi tiết': () => showDetail('Hướng dẫn chụp ảnh Before', data.photoIntro.detail),
    'AI': showHelp
  };
  $$('button').forEach(button => { const action = actions[button.textContent.trim()]; if (action) button.onclick = action; });
  const helpButton = $$('#root button').find(b => b.textContent.trim() === 'AI'); if (helpButton) { helpButton.ariaLabel = 'Hỏi đáp thường gặp'; $('span', helpButton).textContent = 'Hỏi đáp'; }
  const track = $('#photos .snap-x'); track.classList.add('photo-track');
  const arrows = $$('#photos button').filter(button => button.querySelector('.lucide-chevron-left,.lucide-chevron-right'));
  arrows.forEach((button, i) => { button.ariaLabel = i ? 'Góc chụp tiếp theo' : 'Góc chụp trước'; button.onclick = () => track.scrollBy({ left: (i ? 1 : -1) * Math.min(track.clientWidth * .8, 420), behavior: reduced ? 'instant' : 'smooth' }); });
  const illustration = $$('div').find(el => el.childElementCount === 0 && el.textContent.trim() === 'Minh Họa Đúng & Sai');
  if (illustration) { const box = illustration.closest('h4').parentElement; if (box && !box.querySelector('img')) { const p = document.createElement('p'); p.textContent = 'Đúng: camera ngang tầm mặt, tóc búi gọn, mặt mộc và thả lỏng. Tránh: selfie, bộ lọc, xõa tóc hoặc cười. Bấm để xem mẫu góc chụp.'; p.style.cssText = 'padding:20px;font-size:14px;line-height:1.8'; box.append(p); box.role = 'button'; box.tabIndex = 0; box.style.cursor = 'pointer'; box.onclick = () => $('#photos .snap-x img').click(); box.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); box.click(); } }; } }
})();

