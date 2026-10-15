/* Jelly Merge - drop jellies into the jar, two of the same kind merge into a bigger one.
 * Built for YouTube Playables: canvas only, synthesized sound, cloud save through the Playables SDK.
 */
(() => {
  'use strict';

  // ------------------------------------------------------------------ Playables SDK
  const yt = typeof ytgame !== 'undefined' ? ytgame : null;
  const IN_YT = !!(yt && yt.IN_PLAYABLES_ENV);
  const sdk = (fn) => { try { return fn(); } catch (e) { return undefined; } };

  // ------------------------------------------------------------------ text
  const STR = {
    en: { score: 'SCORE', best: 'BEST', next: 'NEXT', over: 'The jar is full!', again: 'Play again', revive: 'Revive',
          reviveSub: 'Watch an ad to pop the top jellies', newBest: 'NEW BEST!', hint: 'Tap to drop · match two to merge',
          loading: 'Loading', mega: 'MEGA MERGE!' },
    es: { score: 'PUNTOS', best: 'RÉCORD', next: 'SIGUE', over: '¡El frasco está lleno!', again: 'Jugar de nuevo', revive: 'Revivir',
          reviveSub: 'Mira un anuncio y explota las de arriba', newBest: '¡NUEVO RÉCORD!', hint: 'Toca para soltar · junta dos iguales',
          loading: 'Cargando', mega: '¡MEGA FUSIÓN!' },
    pt: { score: 'PONTOS', best: 'RECORDE', next: 'PRÓXIMA', over: 'O pote está cheio!', again: 'Jogar de novo', revive: 'Reviver',
          reviveSub: 'Veja um anúncio e estoure as de cima', newBest: 'NOVO RECORDE!', hint: 'Toque para soltar · junte duas iguais',
          loading: 'Carregando', mega: 'MEGA FUSÃO!' },
    fr: { score: 'SCORE', best: 'RECORD', next: 'SUIVANT', over: 'Le bocal est plein !', again: 'Rejouer', revive: 'Revivre',
          reviveSub: 'Regarde une pub pour éclater celles du haut', newBest: 'NOUVEAU RECORD !', hint: 'Touche pour lâcher · fusionne deux pareilles',
          loading: 'Chargement', mega: 'MÉGA FUSION !' },
    de: { score: 'PUNKTE', best: 'REKORD', next: 'NÄCHSTE', over: 'Das Glas ist voll!', again: 'Nochmal', revive: 'Weiterspielen',
          reviveSub: 'Werbung ansehen, obere platzen lassen', newBest: 'NEUER REKORD!', hint: 'Tippen zum Fallenlassen · zwei gleiche verschmelzen',
          loading: 'Lädt', mega: 'MEGA-FUSION!' },
    it: { score: 'PUNTI', best: 'RECORD', next: 'PROSSIMA', over: 'Il barattolo è pieno!', again: 'Gioca ancora', revive: 'Rinasci',
          reviveSub: 'Guarda un annuncio e fai scoppiare quelle in alto', newBest: 'NUOVO RECORD!', hint: 'Tocca per lasciare · unisci due uguali',
          loading: 'Caricamento', mega: 'MEGA FUSIONE!' },
    tr: { score: 'PUAN', best: 'REKOR', next: 'SIRADAKİ', over: 'Kavanoz doldu!', again: 'Tekrar oyna', revive: 'Devam et',
          reviveSub: 'Reklam izle, üsttekileri patlat', newBest: 'YENİ REKOR!', hint: 'Bırakmak için dokun · aynı ikisini birleştir',
          loading: 'Yükleniyor', mega: 'MEGA BİRLEŞME!' },
    ru: { score: 'ОЧКИ', best: 'РЕКОРД', next: 'ДАЛЕЕ', over: 'Банка заполнена!', again: 'Ещё раз', revive: 'Продолжить',
          reviveSub: 'Посмотри рекламу и лопни верхние', newBest: 'НОВЫЙ РЕКОРД!', hint: 'Нажми, чтобы бросить · соедини две одинаковые',
          loading: 'Загрузка', mega: 'МЕГА СЛИЯНИЕ!' },
    ja: { score: 'スコア', best: 'ベスト', next: 'つぎ', over: 'びんがいっぱい！', again: 'もう一度', revive: '復活',
          reviveSub: '広告を見て上のゼリーを消す', newBest: 'ベスト更新！', hint: 'タップで落とす・同じ2つで合体',
          loading: '読み込み中', mega: 'メガ合体！' },
    ko: { score: '점수', best: '최고', next: '다음', over: '병이 가득 찼어요!', again: '다시 하기', revive: '부활',
          reviveSub: '광고 보고 위쪽 젤리 터뜨리기', newBest: '최고 기록!', hint: '탭해서 떨어뜨리기 · 같은 두 개를 합치기',
          loading: '로딩 중', mega: '메가 합체!' },
    id: { score: 'SKOR', best: 'TERBAIK', next: 'BERIKUT', over: 'Toplesnya penuh!', again: 'Main lagi', revive: 'Hidupkan',
          reviveSub: 'Tonton iklan untuk meletuskan yang atas', newBest: 'REKOR BARU!', hint: 'Ketuk untuk menjatuhkan · gabungkan dua yang sama',
          loading: 'Memuat', mega: 'GABUNG MEGA!' },
    hi: { score: 'स्कोर', best: 'सर्वश्रेष्ठ', next: 'अगला', over: 'जार भर गया!', again: 'फिर खेलें', revive: 'जारी रखें',
          reviveSub: 'विज्ञापन देखें, ऊपर वाली जेली फोड़ें', newBest: 'नया रिकॉर्ड!', hint: 'गिराने के लिए टैप करें · दो एक जैसी मिलाएँ',
          loading: 'लोड हो रहा है', mega: 'मेगा मर्ज!' },
    vi: { score: 'ĐIỂM', best: 'KỶ LỤC', next: 'TIẾP', over: 'Hũ đầy rồi!', again: 'Chơi lại', revive: 'Hồi sinh',
          reviveSub: 'Xem quảng cáo để nổ các viên trên cùng', newBest: 'KỶ LỤC MỚI!', hint: 'Chạm để thả · ghép hai viên giống nhau',
          loading: 'Đang tải', mega: 'SIÊU HỢP NHẤT!' },
    pl: { score: 'WYNIK', best: 'REKORD', next: 'NASTĘPNA', over: 'Słoik jest pełny!', again: 'Zagraj ponownie', revive: 'Wskrześ',
          reviveSub: 'Obejrzyj reklamę i przebij górne', newBest: 'NOWY REKORD!', hint: 'Dotknij, by upuścić · połącz dwie takie same',
          loading: 'Ładowanie', mega: 'MEGA FUZJA!' },
  };
  let T = STR.en;

  // ------------------------------------------------------------------ jellies
  const JW = 100, JH = 140;          // jar size in world units
  const DROP_Y = 12, DANGER_Y = 24;  // dropper height and the line jellies must stay under
  const KINDS = [
    { r: 4.4, c: ['#ff8aa0', '#e8456a'] }, { r: 5.8, c: ['#ffb36b', '#ee7b2a'] }, { r: 7.4, c: ['#ffe27a', '#e9b730'] },
    { r: 9.1, c: ['#c9f27a', '#86c93a'] }, { r: 11.0, c: ['#7fe8a6', '#2fbf6d'] }, { r: 13.0, c: ['#7ff0e2', '#22c2b0'] },
    { r: 15.2, c: ['#8fd6ff', '#3a9cf0'] }, { r: 17.6, c: ['#a7b4ff', '#5a6ef0'] }, { r: 20.2, c: ['#d0a3ff', '#9a5af0'] },
    { r: 23.0, c: ['#ffa8e4', '#e85ac0'] }, { r: 26.2, c: ['#fff0a0', '#f2c02a'] },
  ];
  const MAX = KINDS.length - 1;
  const MERGE_SCORE = KINDS.map((_, i) => ((i + 1) * (i + 2)) / 2);
  const SPAWN = [30, 25, 20, 15, 10];   // weights for the 5 smallest kinds

  // ------------------------------------------------------------------ state
  let balls = [], cur = 0, next = 0, dropX = JW / 2, canDropAt = 0;
  let score = 0, shownScore = 0, best = 0, gameOver = false, revived = false, firstRun = true, newBestThisRun = false;
  let dangerSince = 0, loaded = false, paused = false, dataLoaded = false, saveTimer = 0;
  let aiming = false, anims = [], overAt = 0, overButtons = [], shake = 0, idSeq = 1;

  function spawnKind() {
    let r = Math.random() * SPAWN.reduce((a, b) => a + b, 0);
    for (let i = 0; i < SPAWN.length; i++) { r -= SPAWN[i]; if (r <= 0) return i; }
    return 0;
  }
  function makeBall(k, x, y, vx = 0, vy = 0) {
    return { id: idSeq++, k, x, y, vx, vy, r: KINDS[k].r, born: performance.now(), squash: 0, dead: false };
  }
  function newGame() {
    balls = []; cur = spawnKind(); next = spawnKind(); dropX = JW / 2;
    score = 0; shownScore = 0; gameOver = false; revived = false; newBestThisRun = false; dangerSince = 0;
    anims = []; canDropAt = 0;
    queueSave(true);
  }

  // ------------------------------------------------------------------ saving (YouTube cloud save only)
  function serialize() {
    const r1 = (v) => Math.round(v * 10) / 10;
    return JSON.stringify({ v: 1, best, score, cur, next, revived, gameOver, firstRun,
                            balls: balls.filter((b) => !b.dead).map((b) => [b.k, r1(b.x), r1(b.y)]) });
  }
  function restore(str) {
    try {
      const d = JSON.parse(str);
      if (!d || d.v !== 1) return false;
      best = Math.max(0, d.best | 0); firstRun = !!d.firstRun;
      if (d.gameOver || !Array.isArray(d.balls)) return 'bestOnly';
      balls = [];
      for (const b of d.balls.slice(0, 200)) {
        if (!Array.isArray(b)) continue;
        const k = Math.max(0, Math.min(MAX, b[0] | 0));
        balls.push(makeBall(k, Math.max(KINDS[k].r, Math.min(JW - KINDS[k].r, +b[1] || JW / 2)), Math.min(JH - KINDS[k].r, +b[2] || JH / 2)));
      }
      cur = Math.max(0, Math.min(4, d.cur | 0)); next = Math.max(0, Math.min(4, d.next | 0));
      score = Math.max(0, d.score | 0); shownScore = score; revived = !!d.revived; gameOver = false;
      return true;
    } catch (e) { return false; }
  }
  async function loadSave() {
    try {
      if (IN_YT) return await yt.game.loadData();
      return window.localStorage.getItem('jelly-merge-save') || '';
    } catch (e) { return ''; }
  }
  function writeSave() {
    if (!dataLoaded) return;  // never save before the cloud data was loaded
    const s = serialize();
    if (IN_YT) sdk(() => yt.game.saveData(s).catch(() => {}));
    else { try { window.localStorage.setItem('jelly-merge-save', s); } catch (e) { /* private mode */ } }
  }
  function queueSave(now) { clearTimeout(saveTimer); if (now) writeSave(); else saveTimer = setTimeout(writeSave, 800); }
  function sendBest() { if (IN_YT) sdk(() => yt.engagement.sendScore({ value: best | 0 }).catch(() => {})); }

  // ------------------------------------------------------------------ audio
  let actx = null, audioOn = true;
  function audio() {
    if (!audioOn || paused) return null;
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (actx.state === 'suspended') actx.resume().catch(() => {});
    return actx;
  }
  function tone(freq, dur, type = 'sine', vol = 0.16, when = 0, slide = 0) {
    const a = audio(); if (!a) return;
    const t0 = a.currentTime + when, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  const sfx = {
    drop() { tone(520, 0.12, 'sine', 0.12, 0, 0.55); },
    merge(k) { const f = 300 * Math.pow(1.122, k); tone(f, 0.18, 'sine', 0.16); tone(f * 1.5, 0.22, 'triangle', 0.08, 0.04); },
    mega() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.35, 'triangle', 0.12, i * 0.06)); },
    over() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.3, 'triangle', 0.13, i * 0.12)); },
  };
  function setAudio(on) {
    audioOn = !!on;
    if (actx) { if (audioOn && !paused) actx.resume().catch(() => {}); else actx.suspend().catch(() => {}); }
  }

  // ------------------------------------------------------------------ physics
  const G = 300, STEP = 1 / 120;
  let acc = 0;
  function physics(dt) {
    acc = Math.min(acc + dt, STEP * 6);
    while (acc >= STEP) { stepOnce(STEP); acc -= STEP; }
  }
  function stepOnce(h) {
    for (const b of balls) {
      b.vy += G * h; b.vx *= 0.999; b.vy *= 0.999;
      b.x += b.vx * h; b.y += b.vy * h;
      b.squash *= 0.9;
    }
    const merges = [];
    for (let it = 0; it < 3; it++) {
      for (let i = 0; i < balls.length; i++) {
        const a = balls[i]; if (a.dead) continue;
        for (let j = i + 1; j < balls.length; j++) {
          const b = balls[j]; if (b.dead) continue;
          const dx = b.x - a.x, dy = b.y - a.y, rr = a.r + b.r, d2 = dx * dx + dy * dy;
          if (d2 >= rr * rr) continue;
          if (a.k === b.k && a.k <= MAX && it === 0 && !a.merging && !b.merging) {
            a.merging = b.merging = true; merges.push([a, b]); continue;
          }
          const d = Math.sqrt(d2) || 0.001, nx = dx / d, ny = dy / d, over = rr - d;
          const ma = a.r * a.r, mb = b.r * b.r, tot = ma + mb;
          a.x -= nx * over * (mb / tot); a.y -= ny * over * (mb / tot);
          b.x += nx * over * (ma / tot); b.y += ny * over * (ma / tot);
          const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rv < 0) {
            const jimp = (-(1 + 0.15) * rv) / (1 / ma + 1 / mb);
            a.vx -= (jimp / ma) * nx; a.vy -= (jimp / ma) * ny;
            b.vx += (jimp / mb) * nx; b.vy += (jimp / mb) * ny;
            const hit = Math.min(1, -rv / 120);
            a.squash = Math.max(a.squash, hit); b.squash = Math.max(b.squash, hit);
          }
          // a little friction along the contact keeps stacks calm
          const tx = -ny, ty = nx, tv = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
          a.vx += tx * tv * 0.02; a.vy += ty * tv * 0.02; b.vx -= tx * tv * 0.02; b.vy -= ty * tv * 0.02;
        }
      }
      for (const b of balls) {
        if (b.x < b.r) { b.x = b.r; if (b.vx < 0) b.vx *= -0.2; }
        if (b.x > JW - b.r) { b.x = JW - b.r; if (b.vx > 0) b.vx *= -0.2; }
        if (b.y > JH - b.r) {
          if (b.vy > 40) b.squash = Math.max(b.squash, Math.min(1, b.vy / 160));
          b.y = JH - b.r; if (b.vy > 0) b.vy *= -0.12; b.vx *= 0.985;
        }
      }
    }
    for (const [a, b] of merges) merge(a, b);
    if (merges.length) balls = balls.filter((b) => !b.dead);
    for (const b of balls) b.merging = false;
  }
  function merge(a, b) {
    if (a.dead || b.dead) return;
    a.dead = b.dead = true;
    const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
    if (a.k === MAX) {
      score += MERGE_SCORE[MAX] * 4;
      burst(x, y, MAX, 26); floatText(T.mega + ' +' + MERGE_SCORE[MAX] * 4, x, y - 10, '#fff0a0', 1.4);
      sfx.mega(); shake = 12;
    } else {
      const k = a.k + 1, nb = makeBall(k, x, y, (a.vx + b.vx) / 2, Math.min(0, (a.vy + b.vy) / 2) - 20);
      nb.pop = performance.now();
      balls.push(nb);
      score += MERGE_SCORE[k];
      burst(x, y, k, 8 + k); floatText('+' + MERGE_SCORE[k], x, y - nb.r, '#ffffff', 0.8 + k * 0.05);
      sfx.merge(k); if (k >= 7) shake = Math.max(shake, 3 + k * 0.6);
    }
    if (score > best) {
      if (!newBestThisRun && best > 0) floatText(T.newBest, JW / 2, DANGER_Y + 12, '#ffe066', 1.2);
      newBestThisRun = true; best = score;
    }
    queueSave(false);
  }

  function drop() {
    const now = performance.now();
    if (gameOver || now < canDropAt) return;
    const r = KINDS[cur].r;
    const b = makeBall(cur, Math.max(r, Math.min(JW - r, dropX)), DROP_Y, 0, 30);
    b.dropped = now;
    balls.push(b);
    cur = next; next = spawnKind();
    canDropAt = now + 420;
    firstRun = false;
    sfx.drop();
    queueSave(false);
  }

  function checkDanger(now) {
    const over = balls.some((b) => !b.dead && now - (b.dropped || b.born) > 1400 && b.y - b.r < DANGER_Y && Math.abs(b.vy) < 60);
    if (over) { if (!dangerSince) dangerSince = now; if (now - dangerSince > 1800) endGame(now); }
    else dangerSince = 0;
  }
  function endGame(now) {
    gameOver = true; overAt = now; dangerSince = 0; aiming = false;
    sfx.over(); sendBest(); queueSave(true);
  }
  async function revive() {
    if (revived || !gameOver) return;
    let granted = true;
    if (IN_YT) { try { granted = await yt.ads.requestRewardedAd('revive-pop-top-jellies'); } catch (e) { granted = true; } }
    if (!granted) return;
    revived = true; gameOver = false;
    const top = balls.slice().sort((p, q) => (p.y - p.r) - (q.y - q.r)).slice(0, 8);
    for (const b of top) { b.dead = true; burst(b.x, b.y, b.k, 6); }
    balls = balls.filter((b) => !b.dead);
    sfx.merge(6);
    queueSave(true);
  }
  async function playAgain() {
    if (IN_YT) { try { await yt.ads.requestInterstitialAd(); } catch (e) { /* no ad */ } }
    newGame();
  }

  // ------------------------------------------------------------------ effects
  function burst(x, y, k, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 20 + Math.random() * 50;
      anims.push({ kind: 'p', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30, s: 1 + Math.random() * 1.8,
                   col: KINDS[k].c[0], t: performance.now(), life: 500 + Math.random() * 300 });
    }
  }
  function floatText(str, x, y, col, scale) { anims.push({ kind: 't', str, x, y, col, scale, t: performance.now(), life: 1000 }); }

  // ------------------------------------------------------------------ canvas + layout
  const cv = document.getElementById('game');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  const L = {};
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 3);
    W = Math.max(1, window.innerWidth); H = Math.max(1, window.innerHeight);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const m = Math.min(W, H), pad = Math.max(8, m * 0.035);
    L.pad = pad;
    L.hudH = Math.max(54, Math.min(120, H * 0.11));
    const availW = W - pad * 2, availH = H - L.hudH - pad * 1.2;
    const s = Math.max(0.5, Math.min(availW / JW, availH / JH));
    L.s = s; L.jw = JW * s; L.jh = JH * s;
    L.jx = (W - L.jw) / 2; L.jy = L.hudH + (H - L.hudH - L.jh - pad * 0.6) / 2 + pad * 0.3;
    L.hudTop = Math.max(0, L.jy - L.hudH - pad * 0.3);
  }
  const wx = (x) => L.jx + x * L.s, wy = (y) => L.jy + y * L.s;

  // ------------------------------------------------------------------ drawing
  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function font(px, weight = 800) {
    return `${weight} ${Math.round(px)}px system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`;
  }
  function text(str, x, y, px, color, align = 'center', weight = 800, shadow = true) {
    ctx.font = font(px, weight); ctx.textAlign = align; ctx.textBaseline = 'middle';
    if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillText(str, x, y + px * 0.07); }
    ctx.fillStyle = color; ctx.fillText(str, x, y);
  }
  function drawJelly(k, x, y, r, now, squash = 0, pop = 0, look = 0) {
    const [hi, lo] = KINDS[k].c;
    let sx = 1 + squash * 0.14, sy = 1 - squash * 0.14;
    if (pop) { const t = Math.min(1, (now - pop) / 260); const p = 1 + 0.25 * Math.sin(t * Math.PI) * (1 - t); sx *= p; sy *= p; }
    const wob = Math.sin(now / 420 + x * 0.07) * 0.015;
    ctx.save(); ctx.translate(x, y); ctx.scale(sx + wob, sy - wob);
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, hi); g.addColorStop(1, lo);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = Math.max(1, r * 0.06); ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.ellipse(-r * 0.33, -r * 0.45, r * 0.32, r * 0.17, -0.5, 0, Math.PI * 2); ctx.fill();
    if (r * L.s > 5) {   // face
      const ex = r * 0.3, ey = -r * 0.02, er = r * 0.15;
      for (const s of [-1, 1]) {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(s * ex, ey, er, er * 1.15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2b1940'; ctx.beginPath(); ctx.arc(s * ex + look * er * 0.35, ey + er * 0.15, er * 0.55, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = '#2b1940'; ctx.lineWidth = Math.max(1, r * 0.07); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, r * 0.22, r * 0.16, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.fillStyle = 'rgba(255,120,150,0.35)';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * r * 0.52, r * 0.2, r * 0.12, r * 0.07, 0, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }
  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#3a1f63'); g.addColorStop(1, '#1d1036');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function drawJar(now) {
    const { jx, jy, jw, jh, s } = L;
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; rr(ctx, jx - 4, jy - 4, jw + 8, jh + 8, 22 * s / 4 + 10); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = Math.max(2, s * 0.8); rr(ctx, jx - 4, jy - 4, jw + 8, jh + 8, 22 * s / 4 + 10); ctx.stroke();
    // danger line
    const danger = dangerSince ? 0.5 + 0.5 * Math.sin(now / 80) : 0;
    ctx.setLineDash([8, 8]); ctx.lineWidth = 2;
    ctx.strokeStyle = danger ? `rgba(255,80,110,${0.5 + danger * 0.5})` : 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.moveTo(jx + 6, wy(DANGER_Y)); ctx.lineTo(jx + jw - 6, wy(DANGER_Y)); ctx.stroke(); ctx.setLineDash([]);
  }
  function drawHud() {
    shownScore += (score - shownScore) * 0.2; if (Math.abs(score - shownScore) < 0.5) shownScore = score;
    const midY = L.hudTop + L.hudH * 0.55, px = Math.min(L.hudH * 0.42, W * 0.09);
    text(String(Math.round(shownScore)), W / 2, midY, px, '#ffffff');
    text(T.score, W / 2, midY - px * 0.85, px * 0.32, 'rgba(255,255,255,0.6)', 'center', 700, false);
    const bpx = px * 0.36, bx = Math.max(L.pad, L.jx);
    text('🏆 ' + T.best, bx, midY - bpx * 0.8, bpx * 0.85, 'rgba(255,224,102,0.85)', 'left', 700, false);
    text(String(best), bx, midY + bpx * 0.55, bpx * 1.25, '#ffe066', 'left', 800, false);
    // next jelly preview on the right
    const nx = Math.min(W - L.pad, L.jx + L.jw) - px * 0.55, ny = midY;
    text(T.next, nx, ny - px * 0.85, px * 0.28, 'rgba(255,255,255,0.6)', 'center', 700, false);
    const nr = Math.min(px * 0.5, KINDS[next].r * L.s * 0.7 + 6);
    drawJelly(next, nx, ny + px * 0.05, nr, performance.now());
  }
  function drawDropper(now) {
    if (gameOver) return;
    const r = KINDS[cur].r, x = Math.max(r, Math.min(JW - r, dropX));
    const ready = now >= canDropAt;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.setLineDash([3, 7]);
    ctx.beginPath(); ctx.moveTo(wx(x), wy(DROP_Y + r)); ctx.lineTo(wx(x), wy(JH)); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = ready ? 1 : 0.45;
    drawJelly(cur, wx(x), wy(DROP_Y), r * L.s, now);
    ctx.globalAlpha = 1;
  }
  function drawBalls(now) {
    for (const b of balls) {
      const look = Math.max(-1, Math.min(1, (dropX - b.x) / 40));
      drawJelly(b.k, wx(b.x), wy(b.y), b.r * L.s, now, b.squash, b.pop || 0, look);
    }
  }
  function drawEffects(now) {
    anims = anims.filter((a) => now - a.t < a.life);
    for (const a of anims) {
      const k = (now - a.t) / a.life, dt = (now - a.t) / 1000;
      if (a.kind === 'p') {
        const x = a.x + a.vx * dt, y = a.y + a.vy * dt + 0.5 * 160 * dt * dt;
        ctx.globalAlpha = 1 - k; ctx.fillStyle = a.col;
        ctx.beginPath(); ctx.arc(wx(x), wy(y), a.s * L.s, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1;
        text(a.str, wx(a.x), wy(a.y) - L.s * 14 * (1 - Math.pow(1 - k, 3)), L.s * 6.5 * a.scale, a.col);
        ctx.globalAlpha = 1;
      }
    }
  }
  function drawGameOver(now) {
    const k = Math.min(1, (now - overAt) / 350);
    ctx.fillStyle = 'rgba(20,8,40,' + 0.72 * k + ')'; ctx.fillRect(0, 0, W, H);
    if (k < 0.3) { overButtons = []; return; }
    const cx = W / 2, cy = H * 0.42, u = Math.min(W, H) * 0.06;
    text(T.over, cx, cy - u * 2.6, u * 0.85, '#ffffff');
    text(T.score, cx, cy - u * 1.3, u * 0.38, 'rgba(255,255,255,0.65)', 'center', 700, false);
    text(String(score), cx, cy - u * 0.45, u * 1.25, '#ffffff');
    text(newBestThisRun ? '🏆 ' + T.newBest : '🏆 ' + T.best + ' ' + best, cx, cy + u * 0.55, u * 0.45, '#ffe066', 'center', 800, false);
    const bw = Math.min(W * 0.72, u * 7.5), bh = Math.max(48, u * 1.15);
    overButtons = []; let y = cy + u * 1.4;
    if (!revived) { overButtons.push({ x: cx - bw / 2, y, w: bw, h: bh, act: revive, label: '▶ ' + T.revive, sub: T.reviveSub, col: ['#57e39a', '#24b267'] }); y += bh + u * 0.55; }
    overButtons.push({ x: cx - bw / 2, y, w: bw, h: bh, act: playAgain, label: '↻ ' + T.again, col: ['#ff86c8', '#d9469a'] });
    for (const b of overButtons) {
      const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, b.col[0]); g.addColorStop(1, b.col[1]);
      rr(ctx, b.x, b.y, b.w, b.h, b.h * 0.3); ctx.fillStyle = g; ctx.fill();
      text(b.label, b.x + b.w / 2, b.y + b.h * (b.sub ? 0.4 : 0.5), b.h * 0.36, '#ffffff');
      if (b.sub) text(b.sub, b.x + b.w / 2, b.y + b.h * 0.76, b.h * 0.2, 'rgba(255,255,255,0.88)', 'center', 600, false);
    }
  }
  function drawLoading(now) {
    drawBackground();
    const s = Math.min(W, H) * 0.05;
    [2, 5, 8].forEach((k, i) => drawJelly(k, W / 2 + (i - 1) * s * 2.6, H / 2 - s * 1.4, s * (0.8 + i * 0.25), now || 0));
    text('Jelly Merge', W / 2, H / 2 + s * 1.2, s * 1.1, '#ffffff');
    text(T.loading + '…', W / 2, H / 2 + s * 2.4, s * 0.5, 'rgba(255,255,255,0.6)', 'center', 600, false);
  }

  // ------------------------------------------------------------------ input
  function pointerPos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  cv.addEventListener('pointerdown', (e) => {
    if (!loaded || paused) return;
    audio();
    const [x, y] = pointerPos(e);
    if (gameOver) { for (const b of overButtons) if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) b.act(); return; }
    aiming = true; dropX = (x - L.jx) / L.s;
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  cv.addEventListener('pointermove', (e) => {
    if (paused || gameOver) return;
    const [x] = pointerPos(e);
    if (aiming || e.pointerType === 'mouse') dropX = (x - L.jx) / L.s;
  });
  cv.addEventListener('pointerup', () => { if (aiming && !gameOver && !paused) drop(); aiming = false; });
  cv.addEventListener('pointercancel', () => { aiming = false; });
  window.addEventListener('keydown', (e) => {
    if (!loaded || paused) return;
    if (gameOver) {
      if (e.key === 'Enter' || e.key === ' ') { playAgain(); e.preventDefault(); }
      else if ((e.key === 'r' || e.key === 'R') && !revived) revive();
      return;
    }
    if (e.key === 'ArrowLeft') dropX = Math.max(0, dropX - 4);
    else if (e.key === 'ArrowRight') dropX = Math.min(JW, dropX + 4);
    else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') drop();
    else return;  // Esc and everything else keep their default behaviour
    e.preventDefault();
  });

  // ------------------------------------------------------------------ loop + lifecycle
  let raf = 0, last = 0;
  function frame(now) {
    raf = 0;
    if (paused) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
    if (!loaded) drawLoading(now);
    else {
      if (!gameOver) { physics(dt); checkDanger(now); }
      ctx.save();
      if (shake > 0.2) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= 0.86; }
      drawBackground(); drawHud(); drawJar(now); drawDropper(now); drawBalls(now); drawEffects(now);
      if (firstRun && balls.length === 0 && !gameOver) {
        const a = 0.55 + 0.35 * Math.sin(now / 350);
        text(T.hint, W / 2, wy(JH * 0.55), Math.max(13, Math.min(L.s * 4.4, 20)), `rgba(255,255,255,${a.toFixed(2)})`, 'center', 700, false);
      }
      ctx.restore();
      if (gameOver) drawGameOver(now); else overButtons = [];
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && !paused) { last = 0; raf = requestAnimationFrame(frame); } }
  function onPause() {
    paused = true; aiming = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (actx) actx.suspend().catch(() => {});
    queueSave(true);
  }
  function onResume() { paused = false; if (actx && audioOn) actx.resume().catch(() => {}); start(); }

  async function boot() {
    resize(); window.addEventListener('resize', resize);
    drawLoading(0);
    if (IN_YT) {
      sdk(() => yt.game.firstFrameReady());
      setAudio(sdk(() => yt.system.isAudioEnabled()) !== false);
      sdk(() => yt.system.onAudioEnabledChange((on) => setAudio(on)));
      sdk(() => yt.system.onPause(onPause));
      sdk(() => yt.system.onResume(onResume));
      try { const lang = await yt.system.getLanguage(); T = STR[(lang || 'en').slice(0, 2).toLowerCase()] || STR.en; }
      catch (e) { T = STR.en; }
    } else {
      T = STR[(navigator.language || 'en').slice(0, 2).toLowerCase()] || STR.en;
    }
    start();
    const saved = await loadSave();
    dataLoaded = true;
    if ((saved ? restore(saved) : false) !== true) newGame();
    loaded = true;
    if (IN_YT) sdk(() => yt.game.gameReady());
    else window.__jm = { L, KINDS, get balls() { return balls; }, get score() { return score; }, get over() { return gameOver; },
                         get cur() { return cur; }, drop: (x) => { dropX = x; canDropAt = 0; drop(); } };  // test hook (browser only)
  }
  boot();
})();
