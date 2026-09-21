/* ===== data injected from Flask (see app.py -> render_template) ===== */
  const DATA = window.SITE_DATA || {};

  /* ===== nav scroll + progress ===== */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement;
    const progress = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    document.getElementById('progress').style.width = progress + '%';
  });

  /* ===== reveal on scroll ===== */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ===== custom cursor ===== */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  });
  function ringLoop(){
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(ringLoop);
  }
  ringLoop();
  document.querySelectorAll('a, .btn, .project, .kbd-hint, .palette-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* ===== magnetic buttons ===== */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - r.left - r.width/2;
      const relY = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${relX*0.25}px, ${relY*0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ===== project 3D tilt + glow ===== */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      const rotX = ((py / r.height) - 0.5) * -6;
      const rotY = ((px / r.width) - 0.5) * 6;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.setProperty('--mx', px + 'px');
      card.style.setProperty('--my', py + 'px');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'rotateX(0) rotateY(0)'; });
  });

  /* ===== typing effect ===== */
  const phrases = DATA.typed_phrases || ["building things."];
  const typedEl = document.getElementById('typed');
  let pIdx = 0, cIdx = 0, deleting = false;
  function tick() {
    const current = phrases[pIdx];
    if (!deleting) {
      cIdx++; typedEl.textContent = current.slice(0, cIdx);
      if (cIdx === current.length) { deleting = true; setTimeout(tick, 1400); return; }
    } else {
      cIdx--; typedEl.textContent = current.slice(0, cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 30 : 55);
  }
  tick();

  /* ===== hero glitch burst on load ===== */
  const glitchTitle = document.getElementById('glitchTitle');
  window.addEventListener('load', () => {
    setTimeout(() => {
      glitchTitle.classList.add('play');
      setTimeout(() => glitchTitle.classList.remove('play'), 500);
    }, 400);
  });

  /* ===== terminal typewriter ===== */
  const termBody = document.getElementById('termBody');
  const termLines = JSON.parse(termBody.dataset.lines || '[]').map(l => [l[0], l[1]]);
  let li = 0;
  function typeTerm(){
    if (li >= termLines.length) {
      termBody.innerHTML += `<div><span class="c">$</span> <span class="cursor-blink" style="display:inline-block;width:8px;height:14px;background:#2fe6c9;"></span></div>`;
      return;
    }
    const [text, cls] = termLines[li];
    const div = document.createElement('div');
    if (cls === 'status') div.innerHTML = `<span class="v" style="color:#2fe6c9">${text}</span>`;
    else if (cls === 'kv') {
      const [k, v] = text.split(':');
      div.innerHTML = `<span class="k">${k}</span><span class="c">:</span><span class="v">${v}</span>`;
    } else if (cls === 'c') div.innerHTML = `<span class="c">${text}</span>`;
    else div.innerHTML = `<span class="v">${text}</span>`;
    termBody.appendChild(div);
    li++;
    setTimeout(typeTerm, 120);
  }
  const termObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { typeTerm(); termObserver.disconnect(); } });
  }, { threshold: 0.3 });
  termObserver.observe(document.querySelector('.terminal'));

  /* ===== stat counters ===== */
  function animateCount(el, target){
    let cur = 0; const step = Math.max(1, target/30);
    const int = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(int); }
      el.textContent = Math.floor(cur);
    }, 30);
  }
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.stat .num[data-count]').forEach(el => {
          animateCount(el.querySelector('span'), parseInt(el.dataset.count, 10));
        });
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statObserver.observe(document.querySelector('.stats'));

  /* ===== live clock ===== */
  const clockTz = DATA.clock_timezone || 'Asia/Dhaka';
  const clockLabel = (DATA.clock_city || 'LOCAL').toUpperCase();
  function updateClock(){
    const now = new Date();
    const opts = { timeZone: clockTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    document.getElementById('clock').textContent = clockLabel + ' · ' + now.toLocaleTimeString('en-GB', opts);
  }
  updateClock(); setInterval(updateClock, 1000);

  /* ===== command palette ===== */
  const paletteOverlay = document.getElementById('palette-overlay');
  const paletteInput = document.getElementById('palette-input');
  const paletteList = document.getElementById('palette-list');
  const sectionCommands = (DATA.nav_sections || [
    { label: 'About', id: '#about' }, { label: 'Stack', id: '#skills' },
    { label: 'Work', id: '#work' }, { label: 'Research', id: '#research' },
    { label: 'Contact', id: '#contact' },
  ]).map(s => ({ label: 'Go to ' + s.label, hint: 'SECTION', action: () => scrollTo(s.id) }));
  const commands = sectionCommands;
  function scrollTo(sel){ document.querySelector(sel).scrollIntoView({behavior:'smooth'}); closePalette(); }
  function renderPalette(filter=''){
    paletteList.innerHTML = '';
    commands.filter(c => c.label.toLowerCase().includes(filter.toLowerCase())).forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'palette-item' + (i===0 ? ' active' : '');
      div.innerHTML = `<span>${c.label}</span><span>${c.hint}</span>`;
      div.addEventListener('click', c.action);
      paletteList.appendChild(div);
    });
  }
  function openPalette(){ paletteOverlay.classList.add('open'); paletteInput.value=''; renderPalette(); paletteInput.focus(); }
  function closePalette(){ paletteOverlay.classList.remove('open'); }
  document.getElementById('paletteOpenBtn').addEventListener('click', openPalette);
  paletteInput.addEventListener('input', e => renderPalette(e.target.value));
  paletteOverlay.addEventListener('click', e => { if (e.target === paletteOverlay) closePalette(); });
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    if (e.key === 'Escape') closePalette();
    if (e.key === 'Enter' && paletteOverlay.classList.contains('open')) {
      const active = paletteList.querySelector('.palette-item');
      if (active) active.click();
    }
  });

  /* ===== particle network canvas ===== */
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const mouse = { x: null, y: null };
  function resize() {
    w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight;
    const count = Math.min(100, Math.floor((w * h) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }));
  }
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(124,111,255,${0.12 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const p = particles[i];
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.strokeStyle = `rgba(47,230,201,${0.25 * (1 - dist / 160)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(230,232,240,0.5)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  /* ===== skill radar chart (only runs if a #radar canvas exists) ===== */
  const radarCanvas = document.getElementById('radar');
  if (radarCanvas) {
  const rctx = radarCanvas.getContext('2d');
  const skills = JSON.parse(radarCanvas.dataset.skills || '[]');
  let radarProgress = 0;
  function drawRadar(){
    const cx = radarCanvas.width/2, cy = radarCanvas.height/2, R = 150;
    rctx.clearRect(0,0,radarCanvas.width,radarCanvas.height);
    const n = skills.length;
    // rings
    for (let ring=1; ring<=4; ring++){
      rctx.beginPath();
      for (let i=0;i<=n;i++){
        const ang = (Math.PI*2*i/n) - Math.PI/2;
        const r = R*ring/4;
        const x = cx + r*Math.cos(ang), y = cy + r*Math.sin(ang);
        i===0 ? rctx.moveTo(x,y) : rctx.lineTo(x,y);
      }
      rctx.strokeStyle = 'rgba(33,42,64,0.9)'; rctx.lineWidth=1; rctx.stroke();
    }
    // spokes + labels
    for (let i=0;i<n;i++){
      const ang = (Math.PI*2*i/n) - Math.PI/2;
      const x = cx + R*Math.cos(ang), y = cy + R*Math.sin(ang);
      rctx.beginPath(); rctx.moveTo(cx,cy); rctx.lineTo(x,y);
      rctx.strokeStyle = 'rgba(33,42,64,0.9)'; rctx.stroke();
      const lx = cx + (R+26)*Math.cos(ang), ly = cy + (R+26)*Math.sin(ang);
      rctx.fillStyle = '#8b93ab'; rctx.font = '11px JetBrains Mono';
      rctx.textAlign = 'center'; rctx.textBaseline = 'middle';
      rctx.fillText(skills[i].label, lx, ly);
    }
    // data shape (animated)
    rctx.beginPath();
    for (let i=0;i<=n;i++){
      const idx = i % n;
      const ang = (Math.PI*2*idx/n) - Math.PI/2;
      const r = R * skills[idx].val * radarProgress;
      const x = cx + r*Math.cos(ang), y = cy + r*Math.sin(ang);
      i===0 ? rctx.moveTo(x,y) : rctx.lineTo(x,y);
    }
    rctx.closePath();
    rctx.fillStyle = 'rgba(124,111,255,0.22)';
    rctx.strokeStyle = '#2fe6c9'; rctx.lineWidth = 1.5;
    rctx.fill(); rctx.stroke();
    // points
    for (let i=0;i<n;i++){
      const ang = (Math.PI*2*i/n) - Math.PI/2;
      const r = R * skills[i].val * radarProgress;
      const x = cx + r*Math.cos(ang), y = cy + r*Math.sin(ang);
      rctx.beginPath(); rctx.arc(x,y,3,0,Math.PI*2);
      rctx.fillStyle = '#2fe6c9'; rctx.fill();
    }
  }
  const radarObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const anim = setInterval(() => {
          radarProgress += 0.04;
          if (radarProgress >= 1) { radarProgress = 1; clearInterval(anim); }
          drawRadar();
        }, 16);
        radarObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  drawRadar();
  radarObserver.observe(radarCanvas);
  }