/* Block Bloom - a block puzzle for YouTube Playables.
 * Drag pieces onto the 8x8 board, fill rows or columns to clear them, chain clears for combos.
 * No assets: everything is drawn on a canvas and every sound is synthesized, so the bundle is tiny.
 */
(() => {
  'use strict';

  // ------------------------------------------------------------------ Playables SDK
  const yt = typeof ytgame !== 'undefined' ? ytgame : null;
  const IN_YT = !!(yt && yt.IN_PLAYABLES_ENV);
  const sdk = (fn) => { try { return fn(); } catch (e) { return undefined; } };

  // ------------------------------------------------------------------ text
  const STR = {
    en: { score: 'SCORE', best: 'BEST', over: 'No space left!', again: 'Play again', revive: 'Revive',
          reviveSub: 'Watch an ad to clear 3 rows', combo: 'COMBO', perfect: 'PERFECT!', newBest: 'NEW BEST!',
          great: 'GREAT!', amazing: 'AMAZING!', hint: 'Drag a block onto the board', loading: 'Loading' },
    es: { score: 'PUNTOS', best: 'RÉCORD', over: '¡Sin espacio!', again: 'Jugar de nuevo', revive: 'Revivir',
          reviveSub: 'Mira un anuncio y borra 3 filas', combo: 'COMBO', perfect: '¡PERFECTO!', newBest: '¡NUEVO RÉCORD!',
          great: '¡GENIAL!', amazing: '¡INCREÍBLE!', hint: 'Arrastra un bloque al tablero', loading: 'Cargando' },
    pt: { score: 'PONTOS', best: 'RECORDE', over: 'Sem espaço!', again: 'Jogar de novo', revive: 'Reviver',
          reviveSub: 'Veja um anúncio e limpe 3 linhas', combo: 'COMBO', perfect: 'PERFEITO!', newBest: 'NOVO RECORDE!',
          great: 'ÓTIMO!', amazing: 'INCRÍVEL!', hint: 'Arraste um bloco para o tabuleiro', loading: 'Carregando' },
    fr: { score: 'SCORE', best: 'RECORD', over: 'Plus de place !', again: 'Rejouer', revive: 'Revivre',
          reviveSub: 'Regarde une pub pour vider 3 lignes', combo: 'COMBO', perfect: 'PARFAIT !', newBest: 'NOUVEAU RECORD !',
          great: 'SUPER !', amazing: 'INCROYABLE !', hint: 'Glisse un bloc sur le plateau', loading: 'Chargement' },
    de: { score: 'PUNKTE', best: 'REKORD', over: 'Kein Platz mehr!', again: 'Nochmal', revive: 'Weiterspielen',
          reviveSub: 'Werbung ansehen, 3 Reihen leeren', combo: 'KOMBO', perfect: 'PERFEKT!', newBest: 'NEUER REKORD!',
          great: 'SUPER!', amazing: 'UNGLAUBLICH!', hint: 'Zieh einen Block aufs Feld', loading: 'Lädt' },
    it: { score: 'PUNTI', best: 'RECORD', over: 'Niente più spazio!', again: 'Gioca ancora', revive: 'Rinasci',
          reviveSub: 'Guarda un annuncio e libera 3 righe', combo: 'COMBO', perfect: 'PERFETTO!', newBest: 'NUOVO RECORD!',
          great: 'OTTIMO!', amazing: 'INCREDIBILE!', hint: 'Trascina un blocco sul tabellone', loading: 'Caricamento' },
    tr: { score: 'PUAN', best: 'REKOR', over: 'Yer kalmadı!', again: 'Tekrar oyna', revive: 'Devam et',
          reviveSub: 'Reklam izle, 3 satırı temizle', combo: 'KOMBO', perfect: 'MÜKEMMEL!', newBest: 'YENİ REKOR!',
          great: 'HARİKA!', amazing: 'İNANILMAZ!', hint: 'Bir bloğu tahtaya sürükle', loading: 'Yükleniyor' },
    ru: { score: 'ОЧКИ', best: 'РЕКОРД', over: 'Нет места!', again: 'Ещё раз', revive: 'Продолжить',
          reviveSub: 'Посмотри рекламу и очисти 3 ряда', combo: 'КОМБО', perfect: 'ИДЕАЛЬНО!', newBest: 'НОВЫЙ РЕКОРД!',
          great: 'ОТЛИЧНО!', amazing: 'НЕВЕРОЯТНО!', hint: 'Перетащи блок на поле', loading: 'Загрузка' },
    ja: { score: 'スコア', best: 'ベスト', over: 'もう置けない！', again: 'もう一度', revive: '復活',
          reviveSub: '広告を見て3列を消す', combo: 'コンボ', perfect: 'パーフェクト！', newBest: 'ベスト更新！',
          great: 'グレート！', amazing: 'すごい！', hint: 'ブロックを盤面にドラッグ', loading: '読み込み中' },
    ko: { score: '점수', best: '최고', over: '공간이 없어요!', again: '다시 하기', revive: '부활',
          reviveSub: '광고 보고 3줄 지우기', combo: '콤보', perfect: '퍼펙트!', newBest: '최고 기록!',
          great: '멋져요!', amazing: '놀라워요!', hint: '블록을 보드로 끌어 놓으세요', loading: '로딩 중' },
    id: { score: 'SKOR', best: 'TERBAIK', over: 'Tidak ada tempat!', again: 'Main lagi', revive: 'Hidupkan',
          reviveSub: 'Tonton iklan untuk hapus 3 baris', combo: 'KOMBO', perfect: 'SEMPURNA!', newBest: 'REKOR BARU!',
          great: 'HEBAT!', amazing: 'LUAR BIASA!', hint: 'Seret blok ke papan', loading: 'Memuat' },
    hi: { score: 'स्कोर', best: 'सर्वश्रेष्ठ', over: 'जगह खत्म!', again: 'फिर खेलें', revive: 'जारी रखें',
          reviveSub: 'विज्ञापन देखें, 3 पंक्तियाँ साफ़ करें', combo: 'कॉम्बो', perfect: 'परफेक्ट!', newBest: 'नया रिकॉर्ड!',
          great: 'बढ़िया!', amazing: 'कमाल!', hint: 'ब्लॉक को बोर्ड पर खींचें', loading: 'लोड हो रहा है' },
    vi: { score: 'ĐIỂM', best: 'KỶ LỤC', over: 'Hết chỗ rồi!', again: 'Chơi lại', revive: 'Hồi sinh',
          reviveSub: 'Xem quảng cáo để xoá 3 hàng', combo: 'COMBO', perfect: 'HOÀN HẢO!', newBest: 'KỶ LỤC MỚI!',
          great: 'TUYỆT!', amazing: 'QUÁ ĐỈNH!', hint: 'Kéo khối vào bàn', loading: 'Đang tải' },
    pl: { score: 'WYNIK', best: 'REKORD', over: 'Brak miejsca!', again: 'Zagraj ponownie', revive: 'Wskrześ',
          reviveSub: 'Obejrzyj reklamę i usuń 3 rzędy', combo: 'KOMBO', perfect: 'PERFEKCYJNIE!', newBest: 'NOWY REKORD!',
          great: 'ŚWIETNIE!', amazing: 'NIESAMOWITE!', hint: 'Przeciągnij klocek na planszę', loading: 'Ładowanie' },
  };
  let T = STR.en;

  // ------------------------------------------------------------------ pieces
  const SHAPES = [
    [[0, 0]],
    [[0, 0], [1, 0]], [[0, 0], [0, 1]],
    [[0, 0], [1, 0], [2, 0]], [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]],
    [[0, 0], [0, 1], [1, 1]], [[1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [0, 1]], [[0, 0], [1, 0], [1, 1]],
    [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    [[0, 0], [0, 1], [0, 2], [1, 2]], [[1, 0], [1, 1], [1, 2], [0, 2]], [[0, 0], [1, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [0, 1]], [[0, 0], [1, 0], [2, 0], [2, 1]],
    [[0, 0], [0, 1], [1, 1], [2, 1]], [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [1, 0], [2, 0], [1, 1]], [[1, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 1]],
    [[1, 0], [1, 1], [1, 2], [0, 1]],
    [[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]],
    [[1, 0], [1, 1], [0, 1], [0, 2]],
  ];
  // relative chance of each shape (big awkward pieces are rarer)
  const WEIGHTS = SHAPES.map((s) => (s.length === 1 ? 4 : s.length === 9 ? 2 : s.length >= 5 ? 3 : 5));
  const COLORS = [
    ['#ff6b8b', '#d93762'], ['#ffb547', '#e2841d'], ['#ffe066', '#e3b52b'], ['#57e39a', '#24b267'],
    ['#4fd6ff', '#1e9fd6'], ['#6f8bff', '#3f57e0'], ['#b77bff', '#8447e0'], ['#ff86d9', '#dd4fb1'],
  ];
  const N = 8;

  // ------------------------------------------------------------------ state
  let grid, tray, score, best, combo, noClearMoves, revived, gameOver, firstRun;
  let shownScore = 0;
  let loaded = false, paused = false, saveTimer = 0, dataLoaded = false;
  let drag = null;           // { i, x, y, lift, cell:[cx,cy] | null }
  let kbd = null;            // keyboard placement { i, cx, cy }
  let anims = [];            // floating texts, particles, flashes
  let placeAnim = [];        // freshly placed cells popping in
  let clearAnim = [];        // cells shrinking away
  let shake = 0;
  let overAt = 0, overButtons = [];
  let newBestThisRun = false;

  function emptyGrid() { return Array.from({ length: N }, () => Array(N).fill(-1)); }

  function fits(shape, cx, cy) {
    for (const [x, y] of shape) {
      const gx = cx + x, gy = cy + y;
      if (gx < 0 || gy < 0 || gx >= N || gy >= N || grid[gy][gx] !== -1) return false;
    }
    return true;
  }
  function fitsAnywhere(shape) {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (fits(shape, x, y)) return true;
    return false;
  }
  function pickShape() {
    let r = Math.random() * WEIGHTS.reduce((a, b) => a + b, 0);
    for (let i = 0; i < SHAPES.length; i++) { r -= WEIGHTS[i]; if (r <= 0) return i; }
    return 0;
  }
  function newTray() {
    // keep the game fair: at least one of the three pieces must fit somewhere (when possible)
    let best3 = null;
    for (let attempt = 0; attempt < 40; attempt++) {
      const t = [0, 1, 2].map(() => ({ s: pickShape(), c: (Math.random() * COLORS.length) | 0 }));
      if (t.some((p) => fitsAnywhere(SHAPES[p.s]))) { best3 = t; break; }
      best3 = best3 || t;
    }
    tray = best3;
  }
  function newGame() {
    grid = emptyGrid();
    score = 0; shownScore = 0; combo = 0; noClearMoves = 0; revived = false; gameOver = false; newBestThisRun = false;
    anims = []; placeAnim = []; clearAnim = [];
    newTray();
    queueSave(true);
  }

  // ------------------------------------------------------------------ saving (YouTube cloud save only)
  function serialize() {
    return JSON.stringify({
      v: 1, best, score, combo, noClearMoves, revived, gameOver, firstRun,
      grid: grid.map((row) => row.map((c) => (c < 0 ? '.' : String(c))).join('')).join(''),
      tray: tray.map((p) => (p ? [p.s, p.c] : null)),
    });
  }
  function restore(str) {
    try {
      const d = JSON.parse(str);
      if (!d || d.v !== 1) return false;
      best = Math.max(0, d.best | 0);
      firstRun = !!d.firstRun;
      if (d.gameOver || typeof d.grid !== 'string' || d.grid.length !== N * N) return 'bestOnly';
      grid = emptyGrid();
      for (let i = 0; i < N * N; i++) {
        const ch = d.grid[i];
        if (ch !== '.') grid[(i / N) | 0][i % N] = Math.min(COLORS.length - 1, Math.max(0, parseInt(ch, 10) || 0));
      }
      tray = (d.tray || [null, null, null]).slice(0, 3).map((p) =>
        Array.isArray(p) && SHAPES[p[0]] ? { s: p[0], c: Math.max(0, Math.min(COLORS.length - 1, p[1] | 0)) } : null);
      while (tray.length < 3) tray.push(null);
      if (tray.every((p) => !p)) newTray();
      score = Math.max(0, d.score | 0); shownScore = score;
      combo = d.combo | 0; noClearMoves = d.noClearMoves | 0; revived = !!d.revived; gameOver = false;
      return true;
    } catch (e) { return false; }
  }
  async function loadSave() {
    try {
      if (IN_YT) return await yt.game.loadData();
      return window.localStorage.getItem('block-bloom-save') || '';
    } catch (e) { return ''; }
  }
  function writeSave() {
    if (!dataLoaded) return;  // never save before the cloud data was loaded (would overwrite it)
    const s = serialize();
    if (IN_YT) {
      sdk(() => yt.game.saveData(s).catch(() => {}));
    } else {
      try { window.localStorage.setItem('block-bloom-save', s); } catch (e) { /* private mode */ }
    }
  }
  function queueSave(now) {
    clearTimeout(saveTimer);
    if (now) writeSave(); else saveTimer = setTimeout(writeSave, 400);
  }
  function sendBest() {
    if (IN_YT) sdk(() => yt.engagement.sendScore({ value: best | 0 }).catch(() => {}));
  }

  // ------------------------------------------------------------------ audio (synthesized, respects YouTube mute)
  let actx = null, audioOn = true;
  function audio() {
    if (!audioOn || paused) return null;
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (actx.state === 'suspended') actx.resume().catch(() => {});
    return actx;
  }
  function tone(freq, dur, type = 'sine', vol = 0.18, when = 0, slide = 0) {
    const a = audio(); if (!a) return;
    const t0 = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98, 1760];
  const sfx = {
    pick() { tone(660, 0.05, 'sine', 0.08); },
    place() { tone(220, 0.09, 'triangle', 0.22, 0, 0.7); },
    bad() { tone(140, 0.12, 'square', 0.05, 0, 0.8); },
    clear(lines, comboN) {
      const base = Math.min(comboN, 5);
      for (let i = 0; i < 2 + lines; i++) tone(SCALE[Math.min(SCALE.length - 1, base + i)], 0.22, 'sine', 0.14, i * 0.06);
    },
    perfect() { for (let i = 0; i < 7; i++) tone(SCALE[i + 2], 0.3, 'triangle', 0.12, i * 0.05); },
    over() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.28, 'triangle', 0.14, i * 0.12)); },
  };
  function setAudio(on) {
    audioOn = !!on;
    if (actx) { if (audioOn && !paused) actx.resume().catch(() => {}); else actx.suspend().catch(() => {}); }
  }

  // ------------------------------------------------------------------ canvas + layout
  const cv = document.getElementById('game');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  const L = {};  // layout: board x/y/size/cell, tray slots, hud

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 3);
    W = Math.max(1, window.innerWidth); H = Math.max(1, window.innerHeight);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layout();
    spriteCache.clear();
  }
  function layout() {
    const m = Math.min(W, H);
    const pad = Math.max(8, m * 0.035);
    L.pad = pad;
    if (W / H <= 1.15) {          // portrait / square: HUD, board, hint gap, tray - centred as one stack
      L.land = false;
      L.hudH = Math.max(54, Math.min(130, H * 0.12));
      const gap = Math.max(18, pad * 1.4);
      let bs = Math.min(W - pad * 2, H * 0.6);
      let trayH = Math.max(80, Math.min(bs * 0.45, H * 0.25));
      const fit = H - L.hudH - gap - trayH - pad;          // shrink the board on short screens
      if (bs > fit) { bs = Math.max(80, fit); trayH = Math.max(70, Math.min(bs * 0.45, H - L.hudH - gap - bs - pad)); }
      L.bs = bs; L.cs = bs / N;
      const top = Math.max(0, (H - (L.hudH + bs + gap + trayH)) / 2);
      L.hudTop = top;
      L.bx = (W - bs) / 2; L.by = top + L.hudH;
      L.hintY = L.by + bs + gap / 2;
      const ty = L.by + bs + gap;
      const sw = Math.min(W - pad * 2, bs * 1.15) / 3, sx = (W - sw * 3) / 2;
      L.slots = [0, 1, 2].map((i) => ({ x: sx + sw * i, y: ty, w: sw, h: trayH }));
    } else {                       // landscape: HUD on top, board left, tray column right
      L.land = true;
      L.hudH = Math.max(46, Math.min(110, H * 0.13));
      L.hudTop = 0;
      const bs = Math.max(80, Math.min(H - L.hudH - pad * 1.5, W * 0.56));
      L.bs = bs; L.cs = bs / N;
      const tw = bs * 0.5, gap = pad * 1.5, total = bs + gap + tw;
      L.bx = (W - total) / 2; L.by = L.hudH + (H - L.hudH - bs - pad * 0.5) / 2;
      L.hintY = Math.min(H - 10, L.by + bs + pad * 0.45);
      const sh = bs / 3, sx = L.bx + bs + gap;
      L.slots = [0, 1, 2].map((i) => ({ x: sx, y: L.by + sh * i, w: tw, h: sh }));
    }
    L.ts = Math.min(L.cs * 0.62, ...L.slots.map((s) => Math.min(s.w, s.h) / 5.2));
  }

  // ------------------------------------------------------------------ drawing helpers
  const spriteCache = new Map();
  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function blockSprite(ci, size) {
    const px = Math.max(4, Math.round(size * DPR));
    const key = ci + ':' + px;
    let s = spriteCache.get(key);
    if (s) return s;
    s = document.createElement('canvas'); s.width = s.height = px;
    const c = s.getContext('2d');
    const [hi, lo] = COLORS[ci];
    const inset = px * 0.05, r = px * 0.2, w = px - inset * 2;
    const g = c.createLinearGradient(0, inset, 0, inset + w);
    g.addColorStop(0, hi); g.addColorStop(1, lo);
    rr(c, inset, inset, w, w, r); c.fillStyle = g; c.fill();
    c.lineWidth = Math.max(1, px * 0.05); c.strokeStyle = 'rgba(255,255,255,0.35)';
    rr(c, inset + c.lineWidth / 2, inset + c.lineWidth / 2, w - c.lineWidth, w - c.lineWidth, r * 0.9); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.28)';
    rr(c, inset + w * 0.16, inset + w * 0.12, w * 0.68, w * 0.2, w * 0.1); c.fill();
    c.fillStyle = 'rgba(0,0,0,0.12)';
    rr(c, inset + w * 0.12, inset + w * 0.74, w * 0.76, w * 0.12, w * 0.06); c.fill();
    spriteCache.set(key, s);
    return s;
  }
  function drawBlock(ci, x, y, size, alpha = 1, scale = 1) {
    const sp = blockSprite(ci, size);
    ctx.globalAlpha = alpha;
    const s = size * scale, o = (size - s) / 2;
    ctx.drawImage(sp, x + o, y + o, s, s);
    ctx.globalAlpha = 1;
  }
  function font(px, weight = 800) {
    return `${weight} ${Math.round(px)}px system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`;
  }
  function text(str, x, y, px, color, align = 'center', weight = 800, shadow = true) {
    ctx.font = font(px, weight); ctx.textAlign = align; ctx.textBaseline = 'middle';
    if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillText(str, x, y + px * 0.06); }
    ctx.fillStyle = color; ctx.fillText(str, x, y);
  }
  function shapeSize(shape) {
    let w = 0, h = 0;
    for (const [x, y] of shape) { w = Math.max(w, x + 1); h = Math.max(h, y + 1); }
    return [w, h];
  }

  // ------------------------------------------------------------------ game logic
  function linesFor(shape, cx, cy) {
    // which rows / columns would be complete after placing `shape` at (cx, cy)
    const filled = (x, y) => grid[y][x] !== -1 || shape.some(([sx, sy]) => sx + cx === x && sy + cy === y);
    const rows = [], cols = [];
    for (let y = 0; y < N; y++) { let full = true; for (let x = 0; x < N; x++) if (!filled(x, y)) { full = false; break; } if (full) rows.push(y); }
    for (let x = 0; x < N; x++) { let full = true; for (let y = 0; y < N; y++) if (!filled(x, y)) { full = false; break; } if (full) cols.push(x); }
    return { rows, cols };
  }

  function place(i, cx, cy) {
    const p = tray[i]; const shape = SHAPES[p.s];
    if (!fits(shape, cx, cy)) return false;
    const now = performance.now();
    for (const [x, y] of shape) { grid[cy + y][cx + x] = p.c; placeAnim.push({ x: cx + x, y: cy + y, t: now }); }
    tray[i] = null;
    score += shape.length;
    sfx.place();

    const { rows, cols } = linesFor([], 0, 0);
    const lines = rows.length + cols.length;
    if (lines) {
      combo += 1; noClearMoves = 0;
      const cells = new Map();
      for (const y of rows) for (let x = 0; x < N; x++) cells.set(y * N + x, [x, y]);
      for (const x of cols) for (let y = 0; y < N; y++) cells.set(y * N + x, [x, y]);
      const gain = Math.round(cells.size * 10 * lines * (1 + 0.5 * (combo - 1)));
      score += gain;
      for (const [x, y] of cells.values()) {
        const c = grid[y][x];
        clearAnim.push({ x, y, c, t: now + ((x + y) % 6) * 18 });
        burst(L.bx + (x + 0.5) * L.cs, L.by + (y + 0.5) * L.cs, c, 5);
        grid[y][x] = -1;
      }
      const empty = grid.every((row) => row.every((c) => c === -1));
      const cx0 = L.bx + (cx + shapeSize(shape)[0] / 2) * L.cs, cy0 = L.by + (cy + shapeSize(shape)[1] / 2) * L.cs;
      floatText('+' + gain, cx0, cy0, '#ffffff', 1);
      if (combo >= 2) floatText(T.combo + ' x' + combo, L.bx + L.bs / 2, L.by + L.bs * 0.42, '#ffd84d', 1.35);
      else if (lines >= 3) floatText(T.amazing, L.bx + L.bs / 2, L.by + L.bs * 0.42, '#7cf3ff', 1.35);
      else if (lines === 2) floatText(T.great, L.bx + L.bs / 2, L.by + L.bs * 0.42, '#9dffb8', 1.25);
      if (empty) {
        score += 300;
        floatText(T.perfect + ' +300', L.bx + L.bs / 2, L.by + L.bs * 0.58, '#ff9de2', 1.5);
        sfx.perfect(); shake = Math.max(shake, 14);
      } else {
        sfx.clear(lines, combo);
        shake = Math.max(shake, 4 + lines * 3);
      }
    } else {
      noClearMoves += 1;
      if (noClearMoves >= 3) combo = 0;   // a full tray without clearing breaks the combo
    }

    if (score > best) {
      if (!newBestThisRun && best > 0) floatText(T.newBest, L.bx + L.bs / 2, L.by - L.cs * 0.2 + L.bs * 0.18, '#ffe066', 1.2);
      newBestThisRun = true; best = score;
    }
    firstRun = false;
    if (tray.every((t) => !t)) newTray();
    checkOver();
    queueSave(false);
    return true;
  }

  function checkOver() {
    const anyFits = tray.some((t) => t && fitsAnywhere(SHAPES[t.s]));
    if (!anyFits && tray.some((t) => t)) {
      gameOver = true; overAt = performance.now();
      sfx.over();
      sendBest();
      queueSave(true);
    }
  }

  async function revive() {
    if (revived || !gameOver) return;
    let granted = true;
    if (IN_YT) {
      try { granted = await yt.ads.requestRewardedAd('revive-clear-3-rows'); }
      catch (e) { granted = true; }  // no ad available: do not punish the player
    }
    if (!granted) return;
    revived = true; gameOver = false;
    // clear the three fullest rows
    const order = grid.map((row, y) => [row.filter((c) => c !== -1).length, y]).sort((a, b) => b[0] - a[0]).slice(0, 3);
    const now = performance.now();
    for (const [, y] of order) for (let x = 0; x < N; x++) {
      if (grid[y][x] !== -1) { clearAnim.push({ x, y, c: grid[y][x], t: now + x * 25 }); burst(L.bx + (x + 0.5) * L.cs, L.by + (y + 0.5) * L.cs, grid[y][x], 3); }
      grid[y][x] = -1;
    }
    sfx.clear(3, 3);
    if (!tray.some((t) => t && fitsAnywhere(SHAPES[t.s]))) newTray();
    checkOver();
    queueSave(true);
  }

  async function playAgain() {
    if (IN_YT) { try { await yt.ads.requestInterstitialAd(); } catch (e) { /* no ad */ } }
    newGame();
  }

  // ------------------------------------------------------------------ effects
  function burst(x, y, ci, n) {
    const col = COLORS[ci][0];
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2, sp = (0.08 + Math.random() * 0.25) * L.cs;
      anims.push({ kind: 'p', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - L.cs * 0.12, s: L.cs * (0.12 + Math.random() * 0.14),
                   col, t: performance.now(), life: 600 + Math.random() * 300 });
    }
  }
  function floatText(str, x, y, col, scale) {
    anims.push({ kind: 't', str, x, y, col, scale, t: performance.now(), life: 1100 });
  }

  // ------------------------------------------------------------------ input
  function slotAt(px, py) {
    for (let i = 0; i < 3; i++) {
      const s = L.slots[i];
      if (px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h) return i;
    }
    return -1;
  }
  function dragCell(d) {
    const shape = SHAPES[tray[d.i].s];
    const [sw, sh] = shapeSize(shape);
    const left = d.x - (sw * L.cs) / 2, top = d.y - d.lift - (sh * L.cs) / 2;
    const cx = Math.round((left - L.bx) / L.cs), cy = Math.round((top - L.by) / L.cs);
    return fits(shape, cx, cy) ? [cx, cy] : null;
  }
  function pointerPos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }

  cv.addEventListener('pointerdown', (e) => {
    if (!loaded || paused) return;
    audio();  // unlock audio on the first gesture
    const [x, y] = pointerPos(e);
    if (gameOver) { for (const b of overButtons) if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) b.act(); return; }
    const i = slotAt(x, y);
    if (i < 0 || !tray[i]) return;
    kbd = null;
    const lift = e.pointerType === 'touch' ? L.cs * 1.6 : 0;
    drag = { i, x, y, lift, cell: null };
    drag.cell = dragCell(drag);
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    sfx.pick();
  });
  cv.addEventListener('pointermove', (e) => {
    if (!drag || paused) return;
    const [x, y] = pointerPos(e);
    drag.x = x; drag.y = y; drag.cell = dragCell(drag);
  });
  function endDrag() {
    if (!drag) return;
    const d = drag; drag = null;
    if (d.cell) place(d.i, d.cell[0], d.cell[1]);
    else if (d.y < L.slots[0].y - L.pad || L.land) sfx.bad();
  }
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', () => { drag = null; });

  // keyboard: 1-3 pick a piece, arrows move it, Enter/Space places, Esc cancels
  window.addEventListener('keydown', (e) => {
    if (!loaded || paused) return;
    if (gameOver) {
      if (e.key === 'Enter' || e.key === ' ') { playAgain(); e.preventDefault(); }
      else if ((e.key === 'r' || e.key === 'R') && !revived) revive();
      return;
    }
    if (e.key >= '1' && e.key <= '3') {
      const i = +e.key - 1;
      if (tray[i]) { const [sw, sh] = shapeSize(SHAPES[tray[i].s]); kbd = { i, cx: Math.floor((N - sw) / 2), cy: Math.floor((N - sh) / 2) }; sfx.pick(); }
      e.preventDefault(); return;
    }
    if (!kbd) return;
    const [sw, sh] = shapeSize(SHAPES[tray[kbd.i].s]);
    if (e.key === 'ArrowLeft') kbd.cx = Math.max(0, kbd.cx - 1);
    else if (e.key === 'ArrowRight') kbd.cx = Math.min(N - sw, kbd.cx + 1);
    else if (e.key === 'ArrowUp') kbd.cy = Math.max(0, kbd.cy - 1);
    else if (e.key === 'ArrowDown') kbd.cy = Math.min(N - sh, kbd.cy + 1);
    else if (e.key === 'Enter' || e.key === ' ') { if (place(kbd.i, kbd.cx, kbd.cy)) kbd = null; else sfx.bad(); }
    else if (e.key === 'Escape') { kbd = null; return; }  // never preventDefault on Esc
    else return;
    e.preventDefault();
  });

  // ------------------------------------------------------------------ render
  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#171b46'); g.addColorStop(1, '#0b0d26');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function drawHud(now) {
    shownScore += (score - shownScore) * 0.2;
    if (Math.abs(score - shownScore) < 0.5) shownScore = score;
    const midY = L.hudTop + L.hudH * 0.55;
    const px = Math.min(L.hudH * 0.42, W * 0.09);
    text(String(Math.round(shownScore)), W / 2, midY, px, '#ffffff');
    text(T.score, W / 2, midY - px * 0.85, px * 0.32, 'rgba(255,255,255,0.6)', 'center', 700, false);
    // best (top left, clear of YouTube's own controls in the top right)
    const bx = L.pad * 1.2, bpx = px * 0.36;
    text('🏆 ' + T.best, bx, midY - bpx * 0.8, bpx * 0.85, 'rgba(255,224,102,0.85)', 'left', 700, false);
    text(String(best), bx, midY + bpx * 0.55, bpx * 1.25, '#ffe066', 'left', 800, false);
    if (combo >= 2 && !gameOver) {
      const pulse = 1 + 0.05 * Math.sin(now / 120);
      text(T.combo + ' x' + combo, W / 2, midY + px * 0.75, px * 0.32 * pulse, '#ffd84d', 'center', 800, false);
    }
  }
  function drawBoard(now) {
    const { bx, by, bs, cs } = L;
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    rr(ctx, bx - cs * 0.12, by - cs * 0.12, bs + cs * 0.24, bs + cs * 0.24, cs * 0.35); ctx.fill();
    // highlight lines that the current drag would clear
    let hl = null, ghost = null;
    const active = drag && drag.cell ? { i: drag.i, cx: drag.cell[0], cy: drag.cell[1] } : kbd;
    if (active && tray[active.i]) {
      const shape = SHAPES[tray[active.i].s];
      if (fits(shape, active.cx, active.cy)) { hl = linesFor(shape, active.cx, active.cy); ghost = { shape, c: tray[active.i].c, cx: active.cx, cy: active.cy, ok: true }; }
      else if (kbd) ghost = { shape, c: tray[active.i].c, cx: active.cx, cy: active.cy, ok: false };
    }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const px = bx + x * cs, py = by + y * cs;
      ctx.fillStyle = (x + y) % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.075)';
      rr(ctx, px + cs * 0.05, py + cs * 0.05, cs * 0.9, cs * 0.9, cs * 0.16); ctx.fill();
    }
    const glow = hl && (hl.rows.length || hl.cols.length);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = grid[y][x];
      if (c === -1) continue;
      const pa = placeAnim.find((a) => a.x === x && a.y === y);
      let sc = 1;
      if (pa) { const k = Math.min(1, (now - pa.t) / 160); sc = 0.7 + 0.3 * easeOutBack(k); }
      const inLine = glow && (hl.rows.includes(y) || hl.cols.includes(x));
      drawBlock(inLine ? ghost.c : c, bx + x * cs, by + y * cs, cs, 1, sc);
      if (inLine) { ctx.fillStyle = 'rgba(255,255,255,' + (0.18 + 0.12 * Math.sin(now / 90)) + ')'; rr(ctx, bx + x * cs + cs * 0.05, by + y * cs + cs * 0.05, cs * 0.9, cs * 0.9, cs * 0.18); ctx.fill(); }
    }
    if (ghost) {
      for (const [x, y] of ghost.shape) {
        const gx = ghost.cx + x, gy = ghost.cy + y;
        if (gx < 0 || gy < 0 || gx >= N || gy >= N) continue;
        if (ghost.ok) drawBlock(ghost.c, bx + gx * cs, by + gy * cs, cs, 0.38);
        else { ctx.fillStyle = 'rgba(255,80,100,0.35)'; rr(ctx, bx + gx * cs + cs * 0.05, by + gy * cs + cs * 0.05, cs * 0.9, cs * 0.9, cs * 0.18); ctx.fill(); }
      }
      if (glow) {
        ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = Math.max(2, cs * 0.06);
        for (const y of hl.rows) { rr(ctx, bx + cs * 0.02, by + y * cs + cs * 0.02, bs - cs * 0.04, cs * 0.96, cs * 0.2); ctx.stroke(); }
        for (const x of hl.cols) { rr(ctx, bx + x * cs + cs * 0.02, by + cs * 0.02, cs * 0.96, bs - cs * 0.04, cs * 0.2); ctx.stroke(); }
      }
    }
    // clearing cells shrink and fade
    clearAnim = clearAnim.filter((a) => now - a.t < 260);
    for (const a of clearAnim) {
      const k = Math.max(0, (now - a.t) / 260);
      drawBlock(a.c, bx + a.x * cs, by + a.y * cs, cs, 1 - k, 1 + 0.25 * k);
    }
    placeAnim = placeAnim.filter((a) => now - a.t < 200);
  }
  function drawTray(now) {
    for (let i = 0; i < 3; i++) {
      const p = tray[i];
      if (!p || (drag && drag.i === i)) continue;
      const s = L.slots[i], shape = SHAPES[p.s], [sw, sh] = shapeSize(shape);
      const size = L.ts, ox = s.x + (s.w - sw * size) / 2, oy = s.y + (s.h - sh * size) / 2;
      const ok = gameOver ? false : fitsAnywhere(shape);
      const sel = kbd && kbd.i === i;
      for (const [x, y] of shape) drawBlock(p.c, ox + x * size, oy + y * size, size, ok ? 1 : 0.35);
      if (sel) { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; rr(ctx, ox - 6, oy - 6, sw * size + 12, sh * size + 12, 10); ctx.stroke(); }
    }
    if (drag && tray[drag.i]) {
      const shape = SHAPES[tray[drag.i].s], [sw, sh] = shapeSize(shape);
      const left = drag.x - (sw * L.cs) / 2, top = drag.y - drag.lift - (sh * L.cs) / 2;
      ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
      for (const [x, y] of shape) drawBlock(tray[drag.i].c, left + x * L.cs, top + y * L.cs, L.cs, 0.95, 1.04);
      ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    }
    if (firstRun && !drag && !gameOver && score === 0) {
      const a = 0.55 + 0.35 * Math.sin(now / 350);
      text(T.hint, L.land ? L.bx + L.bs / 2 : W / 2, L.hintY, Math.max(13, Math.min(L.cs * 0.32, 20)),
           'rgba(255,255,255,' + a.toFixed(2) + ')', 'center', 700, false);
    }
  }
  function drawEffects(now) {
    anims = anims.filter((a) => now - a.t < a.life);
    for (const a of anims) {
      const k = (now - a.t) / a.life;
      if (a.kind === 'p') {
        const dt = (now - a.t) / 16.7;
        const x = a.x + a.vx * dt, y = a.y + a.vy * dt + 0.5 * (L.cs * 0.012) * dt * dt;
        ctx.globalAlpha = 1 - k; ctx.fillStyle = a.col;
        rr(ctx, x - a.s / 2, y - a.s / 2, a.s, a.s, a.s * 0.25); ctx.fill(); ctx.globalAlpha = 1;
      } else {
        const rise = L.cs * 1.4 * easeOut(k), sc = a.scale * (k < 0.15 ? 0.6 + 0.4 * easeOutBack(k / 0.15) : 1);
        ctx.globalAlpha = k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1;
        text(a.str, a.x, a.y - rise, L.cs * 0.55 * sc, a.col);
        ctx.globalAlpha = 1;
      }
    }
  }
  function drawGameOver(now) {
    const k = Math.min(1, (now - overAt) / 350);
    ctx.fillStyle = 'rgba(8,10,30,' + 0.72 * k + ')'; ctx.fillRect(0, 0, W, H);
    if (k < 0.3) { overButtons = []; return; }
    const cx = W / 2, cy = H * 0.42, u = Math.min(W, H) * 0.06;
    text(T.over, cx, cy - u * 2.6, u * 0.85, '#ffffff');
    text(T.score, cx, cy - u * 1.3, u * 0.38, 'rgba(255,255,255,0.65)', 'center', 700, false);
    text(String(score), cx, cy - u * 0.45, u * 1.25, '#ffffff');
    text((newBestThisRun ? '🏆 ' + T.newBest : '🏆 ' + T.best + ' ' + best), cx, cy + u * 0.55, u * 0.45, '#ffe066', 'center', 800, false);
    const bw = Math.min(W * 0.7, u * 7.5), bh = Math.max(48, u * 1.15);
    overButtons = [];
    let y = cy + u * 1.4;
    if (!revived) {
      overButtons.push({ x: cx - bw / 2, y, w: bw, h: bh, act: revive, label: '▶ ' + T.revive, sub: T.reviveSub, col: ['#57e39a', '#24b267'] });
      y += bh + u * 0.55;
    }
    overButtons.push({ x: cx - bw / 2, y, w: bw, h: bh, act: playAgain, label: '↻ ' + T.again, col: ['#6f8bff', '#3f57e0'] });
    for (const b of overButtons) {
      const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, b.col[0]); g.addColorStop(1, b.col[1]);
      rr(ctx, b.x, b.y, b.w, b.h, b.h * 0.3); ctx.fillStyle = g; ctx.fill();
      text(b.label, b.x + b.w / 2, b.y + b.h * (b.sub ? 0.4 : 0.5), b.h * 0.36, '#ffffff');
      if (b.sub) text(b.sub, b.x + b.w / 2, b.y + b.h * 0.76, b.h * 0.2, 'rgba(255,255,255,0.85)', 'center', 600, false);
    }
  }
  function drawLoading() {
    drawBackground();
    const s = Math.min(W, H) * 0.08;
    [0, 1, 2, 3].forEach((i) => drawBlock([0, 3, 4, 6][i], W / 2 - s * 2.1 + i * s * 1.1, H / 2 - s * 1.2, s));
    text('Block Bloom', W / 2, H / 2 + s * 0.6, s * 0.7, '#ffffff');
    text(T.loading + '…', W / 2, H / 2 + s * 1.5, s * 0.32, 'rgba(255,255,255,0.6)', 'center', 600, false);
  }

  const easeOut = (k) => 1 - Math.pow(1 - k, 3);
  const easeOutBack = (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };

  let raf = 0;
  function frame(now) {
    raf = 0;
    if (paused) return;
    if (!loaded) { drawLoading(); }
    else {
      ctx.save();
      if (shake > 0.2) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= 0.85; }
      drawBackground(); drawHud(now); drawBoard(now); drawTray(now); drawEffects(now);
      ctx.restore();
      if (gameOver) drawGameOver(now); else overButtons = [];
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && !paused) raf = requestAnimationFrame(frame); }

  // ------------------------------------------------------------------ lifecycle
  function onPause() {
    paused = true;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    drag = null;
    if (actx) actx.suspend().catch(() => {});
    queueSave(true);
  }
  function onResume() {
    paused = false;
    if (actx && audioOn) actx.resume().catch(() => {});
    start();
  }

  async function boot() {
    resize();
    window.addEventListener('resize', resize);
    // first frame: the loading screen
    drawLoading();
    if (IN_YT) {
      sdk(() => yt.game.firstFrameReady());
      setAudio(sdk(() => yt.system.isAudioEnabled()) !== false);
      sdk(() => yt.system.onAudioEnabledChange((on) => setAudio(on)));
      sdk(() => yt.system.onPause(onPause));
      sdk(() => yt.system.onResume(onResume));
      try {
        const lang = await yt.system.getLanguage();
        T = STR[(lang || 'en').slice(0, 2).toLowerCase()] || STR.en;
      } catch (e) { T = STR.en; }
    } else {
      T = STR[(navigator.language || 'en').slice(0, 2).toLowerCase()] || STR.en;
    }
    start();

    best = 0; firstRun = true;
    const saved = await loadSave();
    dataLoaded = true;
    const r = saved ? restore(saved) : false;
    if (r !== true) newGame();
    if (gameOver === undefined) gameOver = false;
    checkOver();
    loaded = true;
    if (IN_YT) sdk(() => yt.game.gameReady());
    else window.__bb = { L, SHAPES, get tray() { return tray; }, get grid() { return grid; }, get score() { return score; },
                         get over() { return gameOver; } };  // test hook (browser only)
  }
  boot();
})();
