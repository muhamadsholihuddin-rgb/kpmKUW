/* ============================================================
   Data KPM Dampingan — app.js
   Penyimpanan: localStorage (per perangkat)
   ============================================================ */

const LS_KEYS = {
  data: 'kpm_data_v1',
  settings: 'kpm_settings_v1',
  absensi: 'kpm_absensi_v1'
};

const STATUS_OPTIONS = [
  { v: '', l: '— Tidak ada status —' },
  { v: 'PENGADUAN', l: 'Pengaduan' },
  { v: 'CALON_GRADUASI_MANDIRI', l: 'Calon Graduasi Mandiri' },
  { v: 'CALON_PPSE', l: 'Calon PPSE' },
  { v: 'SUKSES_GRADUASI_MANDIRI', l: 'Sukses Graduasi Mandiri' },
  { v: 'SUKSES_PPSE', l: 'Sukses PPSE' },
  { v: 'PENGURUS_MENINGGAL', l: 'Pengurus Meninggal' },
  { v: 'KOMPONEN_MENINGGAL', l: 'Dana Komponen Meninggal' }
];
const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map(s => [s.v, s.l]));

const MODUL_DATA = {
  1: {
    nama: 'Modul Pengasuhan dan Pendidikan Anak',
    sesi: [
      'Menjadi Orang Tua yang Lebih Baik',
      'Memahami Perilaku Anak',
      'Memahami Cara Anak Usia Dini Belajar',
      'Membantu Anak Sukses di Sekolah'
    ]
  },
  2: {
    nama: 'Modul Pengelolaan Keuangan dan Perencanaan Usaha',
    sesi: [
      'Mengelola Keuangan Keluarga',
      'Cermat Meminjam dan Menabung',
      'Memulai Usaha'
    ]
  },
  3: {
    nama: 'Modul Kesehatan dan Gizi',
    sesi: [
      'Pentingnya Gizi dan Layanan Kesehatan bagi Ibu Hamil',
      'Pentingnya Gizi bagi Ibu Menyusui dan Balita',
      'Kesakitan, Kesehatan Lingkungan, dan PHBS'
    ]
  },
  4: {
    nama: 'Modul Perlindungan Anak',
    sesi: [
      'Pencegahan Kekerasan terhadap Anak',
      'Pencegahan Penelantaran dan Eksploitasi Anak'
    ]
  },
  5: {
    nama: 'Modul Kesejahteraan Sosial',
    sesi: [
      'Pelayanan bagi Penyandang Disabilitas',
      'Pentingnya Kesejahteraan Lanjut Usia (Lansia)'
    ]
  },
  6: {
    nama: 'Modul Pencegahan dan Penanganan Stunting',
    sesi: [
      'Mengenal Stunting',
      '1.000 Hari Pertama Kehidupan (HPK)',
      'Gizi Ibu Hamil dan Ibu Menyusui',
      'ASI Eksklusif dan MP-ASI',
      'Pemantauan Pertumbuhan Balita',
      'Sanitasi, PHBS, dan Pencegahan Penyakit',
      'Peran Keluarga dalam Pencegahan Stunting',
      'Rencana Aksi Pencegahan Stunting di Rumah'
    ]
  }
};

/* ---------------- State ---------------- */
let kpmData = loadJSON(LS_KEYS.data, []);
let settings = loadJSON(LS_KEYS.settings, { namaPendamping: '', nip: '', tandaTanganDataUrl: '', kelompokByDesa: {} });
if (!settings.kelompokByDesa) settings.kelompokByDesa = {};
let absensiStore = loadJSON(LS_KEYS.absensi, {}); // key -> [{noKK,nama,status}]

let currentView = 'beranda';
let berandaDesaFilter = '';
let dataFilter = { desa: '', kelompok: '', search: '' };
let _kelompokMasterDesaSel = '';
let statusSearch = '';
let absensiSel = { modul: '1', sesi: '1', desa: '', kelompok: '', tanggal: todayISO() };
let absensiPdfMode = 'aplikasi'; // 'aplikasi' = isi status dari aplikasi, 'kosong' = kosongkan untuk tanda tangan manual

/* ============================================================
   PWA INSTALL PROMPT HANDLING
   ============================================================ */
let deferredPrompt = null;
const INSTALL_DISMISSED_KEY = 'pwa_install_dismissed_v1';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner();
});

window.addEventListener('appinstalled', () => {
  hideInstallBanner();
  localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
  if (typeof toast === 'function') toast('Aplikasi berhasil diinstal!');
});

function showInstallBanner() {
  // Jangan tampilkan jika sudah pernah dismiss
  if (localStorage.getItem(INSTALL_DISMISSED_KEY)) return;
  
  const banner = document.getElementById('install-banner');
  if (banner) {
    banner.classList.add('show');
    document.body.classList.add('install-banner-active');
  }
}

function hideInstallBanner() {
  const banner = document.getElementById('install-banner');
  if (banner) {
    banner.classList.remove('show');
    document.body.classList.remove('install-banner-active');
  }
}

function handleInstallClick() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      if (typeof toast === 'function') toast('Terimakasih telah menginstal aplikasi kami!');
    }
    deferredPrompt = null;
  });
}

function handleDismissClick() {
  localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
  hideInstallBanner();
}

/* Panggil setup event listener setelah DOM loaded */
document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('btn-install');
  const dismissBtn = document.getElementById('btn-dismiss');
  if (installBtn) installBtn.addEventListener('click', handleInstallClick);
  if (dismissBtn) dismissBtn.addEventListener('click', handleDismissClick);
});

/* ---------------- Storage helpers ---------------- */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}
function saveData() { localStorage.setItem(LS_KEYS.data, JSON.stringify(kpmData)); }
function saveSettings() { localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings)); }
function saveAbsensi() { localStorage.setItem(LS_KEYS.absensi, JSON.stringify(absensiStore)); }

/* ============================================================
   FOTO KPM — disimpan di IndexedDB (bukan localStorage) karena
   berupa data biner yang relatif besar.
   ============================================================ */
const PHOTO_TYPES = [
  { key: 'utama', label: 'Foto KPM' },
  { key: 'kartu', label: 'Foto Kartu ATM / KKS' },
  { key: 'kk', label: 'Foto Kartu Keluarga' }
];
const PHOTO_DB_NAME = 'kpm_photos_db';
const PHOTO_STORE = 'photos';
let _photoDbPromise = null;

function openPhotoDB() {
  if (_photoDbPromise) return _photoDbPromise;
  _photoDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(PHOTO_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _photoDbPromise;
}
function photoKey(kpmId, type) { return `${kpmId}::${type}`; }

async function savePhotoBlob(kpmId, type, blob) {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).put({ id: photoKey(kpmId, type), kpmId, type, blob, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function getPhotoBlob(kpmId, type) {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readonly');
    const req = tx.objectStore(PHOTO_STORE).get(photoKey(kpmId, type));
    req.onsuccess = () => resolve(req.result ? req.result.blob : null);
    req.onerror = () => reject(req.error);
  });
}
async function deletePhotoBlob(kpmId, type) {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).delete(photoKey(kpmId, type));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function deleteAllPhotosForKpm(kpmId) {
  await Promise.all(PHOTO_TYPES.map(t => deletePhotoBlob(kpmId, t.key)));
}
async function getAllPhotos() {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readonly');
    const req = tx.objectStore(PHOTO_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function clearAllPhotos() {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Kompres file gambar (dari kamera/galeri) jadi JPEG kecil lewat canvas. */
function compressImageFile(file, maxDim = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (blob) resolve(blob); else reject(new Error('Gagal kompres gambar'));
        }, 'image/jpeg', quality);
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function fmtTanggalPanjang(iso) {
  if (!iso) return '-';
  const bln = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${bln[m - 1]} ${y}`;
}
function uid() { return Math.random().toString(36).slice(2, 10); }
function esc(s) { return (s ?? '').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------------- Derived helpers ---------------- */
function getDesaList() { return [...new Set(kpmData.map(k => k.desa).filter(Boolean))].sort(); }
function getAllDesaOptions() {
  return [...new Set([...getDesaList(), ...Object.keys(settings.kelompokByDesa || {})])].sort();
}
function getKelompokList(desa) {
  const src = desa ? kpmData.filter(k => k.desa === desa) : kpmData;
  const fromData = src.map(k => k.kelompok).filter(Boolean);
  const fromMaster = desa
    ? ((settings.kelompokByDesa || {})[desa] || [])
    : Object.values(settings.kelompokByDesa || {}).flat();
  return [...new Set([...fromData, ...fromMaster])].sort();
}
function renderKelompokMasterList(desa) {
  if (!desa) return `<div class="hint">Ketik/pilih nama desa dulu di atas.</div>`;
  const list = (settings.kelompokByDesa || {})[desa] || [];
  if (list.length === 0) return `<div class="hint">Belum ada kelompok tersimpan untuk desa "${esc(desa)}".</div>`;
  return `<div style="display:flex;flex-wrap:wrap;gap:8px">${list.map(name => `
    <span style="display:inline-flex;align-items:center;gap:6px;background:var(--navy-50);border-radius:999px;padding:6px 10px 6px 12px;font-size:12px;font-weight:600;color:var(--navy-800);">
      ${esc(name)}
      <button type="button" data-km-del="${esc(name)}" aria-label="Hapus" style="border:none;background:none;cursor:pointer;color:var(--ink-400);font-weight:800;font-size:14px;line-height:1;padding:0;">×</button>
    </span>`).join('')}</div>`;
}
function kelompokColor(name) {
  if (!name) return { bg: '#EDEDED', fg: '#8C857D' };
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 70%, 91%)`, fg: `hsl(${hue}, 55%, 32%)` };
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

function copyToClipboard(text, label) {
  const msg = label || 'No KK disalin';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => toast(msg),
      () => fallbackCopy(text, msg)
    );
  } else {
    fallbackCopy(text, msg);
  }
}

function fallbackCopy(text, label) {
  const msg = label || 'No KK disalin';
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    toast(msg);
  } catch (e) {
    toast('Gagal menyalin');
  }
  document.body.removeChild(ta);
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const HEADER_META = {
  beranda: ['PKH · Kab. Kediri', 'Beranda', 'Ringkasan data KPM dampingan'],
  data: ['Kelola', 'Data KPM', 'Daftar KPM per desa & kelompok'],
  status: ['Pemantauan', 'Status KPM', 'Pengaduan & status kepesertaan'],
  absensi: ['FDS / P2K2', 'Absensi', 'Rekap kehadiran pertemuan kelompok'],
  pengaturan: ['Akun', 'Pengaturan', 'Profil, data, & pemutakhiran']
};

function setView(view, push = true) {
  currentView = view;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const [eyebrow, title, sub] = HEADER_META[view];
  document.getElementById('hdr-eyebrow').textContent = eyebrow;
  document.getElementById('hdr-title').textContent = title;
  document.getElementById('hdr-sub').textContent = sub;
  render();
  if (push) history.pushState({ view }, '');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => setView(btn.dataset.view));
});
document.getElementById('pendamping-badge').addEventListener('click', () => setView('pengaturan'));

/* ---- Tombol back Android: tutup modal dulu, lalu kembali ke Beranda, baru keluar app ---- */
window.addEventListener('popstate', (e) => {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop.classList.contains('open')) {
    closeModal(true);
    return;
  }
  const view = (e.state && e.state.view) || 'beranda';
  setView(view, false);
});

function render() {
  const main = document.getElementById('main');
  if (currentView === 'beranda') { main.innerHTML = renderBeranda(); bindBerandaView(); }
  else if (currentView === 'data') { main.innerHTML = renderDataView(); bindDataView(); }
  else if (currentView === 'status') { main.innerHTML = renderStatusView(); bindStatusView(); }
  else if (currentView === 'absensi') { main.innerHTML = renderAbsensiView(); bindAbsensiView(); }
  else if (currentView === 'pengaturan') { main.innerHTML = renderPengaturanView(); bindPengaturanView(); }
}

/* ============================================================
   BERANDA (DASHBOARD)
   ============================================================ */
function renderBeranda() {
  if (kpmData.length === 0) {
    return `
    <div class="card empty-state">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>
      <p>Belum ada data KPM.<br>Import data Excel lewat menu Pengaturan.</p>
    </div>`;
  }
  const total = kpmData.length;
  const aktif = kpmData.filter(k => k.statusAktif !== false).length;
  const totalAK = kpmData.reduce((s, k) => s + (Number(k.ak) || 0), 0);
  const desaList = getDesaList();
  const maxPerDesa = Math.max(...desaList.map(d => kpmData.filter(k => k.desa === d).length), 1);
  const adaPengaduan = kpmData.filter(k => k.statusBaku === 'PENGADUAN').length;

  const scope = berandaDesaFilter ? kpmData.filter(k => k.desa === berandaDesaFilter) : kpmData;
  const sum = (field) => scope.reduce((s, k) => s + (Number(k[field]) || 0), 0);
  const KOMPONEN_ICONS = {
    hamil: '<svg viewBox="0 0 24 24"><path d="M12 21c-4-3-8-6.5-8-11a5 5 0 019-3 5 5 0 019 3c0 4.5-4 8-8 11"/><circle cx="12" cy="9" r="1.4"/></svg>',
    aud: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/></svg>',
    sd: '<svg viewBox="0 0 24 24"><path d="M12 3l10 5-10 5L2 8z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
    smp: '<svg viewBox="0 0 24 24"><path d="M12 3l10 5-10 5L2 8z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
    sma: '<svg viewBox="0 0 24 24"><path d="M12 3l10 5-10 5L2 8z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
    lansia: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="3"/><path d="M6 21c0-4 2.5-6.5 6-6.5S18 17 18 21"/><path d="M9 14l-1.5 4M15 14l1.5 4"/></svg>',
    disabilitas: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M12 7v6l-4 7M12 13l4 7M8 11h8"/><circle cx="17" cy="17" r="4"/></svg>'
  };
  const KOMPONEN_FIELDS = [
    ['hamil', 'Hamil'], ['aud', 'AUD'], ['sd', 'SD'], ['smp', 'SMP'],
    ['sma', 'SMA'], ['lansia', 'Lansia'], ['disabilitas', 'Disabilitas']
  ];

  return `
  <div class="stat-grid">
    <div class="stat-card">
      <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      <div class="stat-num">${total}</div>
      <div class="stat-label">Total KPM Dampingan</div>
    </div>
    <div class="stat-card gold">
      <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
      <div class="stat-num">${aktif}</div>
      <div class="stat-label">KPM Aktif</div>
    </div>
  </div>

  <div class="section-title">Sebaran per Desa</div>
  <div class="card">
    <div class="desa-list">
      ${desaList.map(d => {
        const n = kpmData.filter(k => k.desa === d).length;
        const pct = Math.round((n / maxPerDesa) * 100);
        return `<div class="desa-row">
          <div class="chip-num">${n}</div>
          <div class="name">${esc(d)}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <div class="section-title">Jumlah Komponen</div>
  <div class="card">
    <label>Wilayah</label>
    <select id="beranda-desa-filter">
      <option value="">Semua Desa</option>
      ${desaList.map(d => `<option value="${esc(d)}" ${berandaDesaFilter === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
    </select>
    <div class="komp-grid" style="grid-template-columns:repeat(4,1fr); margin-top:12px">
      ${KOMPONEN_FIELDS.map(([field, label]) => `
        <div class="komp-cell komp-icon-cell komp-clickable" data-field="${field}" data-label="${esc(label)}">
          <div class="komp-icon">${KOMPONEN_ICONS[field]}</div>
          <div class="n">${sum(field)}</div>
          <div class="l">${label}</div>
        </div>`).join('')}
    </div>
    <div class="hint">Total anggota keluarga (AK): <strong>${scope.reduce((s, k) => s + (Number(k.ak) || 0), 0)}</strong>${berandaDesaFilter ? ` di ${esc(berandaDesaFilter)}` : ' (seluruh desa)'}</div>
  </div>

  <div class="section-title">Perlu Perhatian</div>
  <div class="card">
    <div class="desa-row status-icon-row" style="background:var(--coral-100)" data-act="pengaduan-list">
      <div class="chip-num" style="background:var(--coral-500)">${adaPengaduan}</div>
      <div class="name">KPM berstatus Pengaduan</div>
    </div>
  </div>
  `;
}

function bindBerandaView() {
  document.getElementById('beranda-desa-filter')?.addEventListener('change', e => {
    berandaDesaFilter = e.target.value;
    render();
  });
  document.querySelectorAll('.komp-clickable').forEach(cell => {
    cell.addEventListener('click', () => openKomponenList(cell.dataset.field, cell.dataset.label));
  });
  document.querySelector('[data-act="pengaduan-list"]')?.addEventListener('click', () => {
    openStatusNameList('PENGADUAN', STATUS_LABEL.PENGADUAN);
  });
}

function openKomponenList(field, label) {
  const scope = berandaDesaFilter ? kpmData.filter(k => k.desa === berandaDesaFilter) : kpmData;
  const list = scope.filter(k => Number(k[field]) > 0);
  openModal(`
    <div class="modal-head">
      <h3>KPM dengan komponen ${esc(label)}</h3>
      <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="hint" style="margin-bottom:10px">${list.length} KPM${berandaDesaFilter ? ` di ${esc(berandaDesaFilter)}` : ' di seluruh desa'}</div>
    ${list.length === 0 ? `<div class="hint">Tidak ada data.</div>` : list.map(k => `
      <div class="status-card" data-id="${k._id}" data-act="open-detail" style="cursor:pointer">
        <div class="nm">${esc(k.nama)}</div>
        <div class="meta">${esc(k.desa)} · ${esc(k.kelompok || '-')} · Jumlah ${esc(label)}: ${k[field]}</div>
      </div>`).join('')}
  `);
  document.querySelectorAll('[data-act="open-detail"]').forEach(card => {
    card.addEventListener('click', () => openEditKpm(card.dataset.id));
  });
}

/* ============================================================
   DATA KPM VIEW
   ============================================================ */
function renderDataResults() {
  const q = dataFilter.search.trim().toLowerCase();
  let rows = kpmData.filter(k =>
    (!dataFilter.desa || k.desa === dataFilter.desa) &&
    (!dataFilter.kelompok || k.kelompok === dataFilter.kelompok) &&
    (!q || k.nama.toLowerCase().includes(q))
  );
  rows.sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }));

  return `
  <div class="hint" style="margin:2px 2px 10px">${rows.length} KPM ditemukan · diurutkan A–Z</div>
  ${rows.length === 0 ? `
    <div class="card empty-state">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <p>Tidak ada data untuk filter ini.</p>
    </div>` : `
  <div class="table-wrap">
    <table>
      <thead><tr><th>Nama</th><th>Desa</th><th>Kelompok</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${rows.map(k => {
          const kc = kelompokColor(k.kelompok);
          return `
          <tr>
            <td><strong class="kpm-name-link" data-id="${k._id}" data-act="edit-kpm">${esc(k.nama)}</strong>${k.perluLengkapi ? '<span class="badge-lengkapi">⚠ Lengkapi Data</span>' : ''}<br><span style="color:var(--ink-400);font-size:11px">${esc(k.noKK)}</span>${k.komponenDetail && k.komponenDetail.length ? `<br><span style="color:var(--navy-800);font-size:11px">👨‍👩‍👧 ${k.komponenDetail.length} anggota komponen</span>` : ''}</td>
            <td>${esc(k.desa)}</td>
            <td><span class="badge" style="background:${kc.bg};color:${kc.fg}">${esc(k.kelompok || 'Tanpa kelompok')}</span></td>
            <td>
              <span class="badge ${k.statusAktif === false ? 'nonaktif' : 'aktif'}">${k.statusAktif === false ? 'Nonaktif' : 'Aktif'}</span>
              ${k.statusBaku ? `<br><span class="badge" style="background:var(--coral-100);color:var(--coral-500);margin-top:4px;display:inline-block">${esc(STATUS_LABEL[k.statusBaku])}</span>` : ''}
            </td>
            <td>
              <div class="row-actions">
                <button class="icon-btn-sm" data-id="${k._id}" data-act="copy-kk" title="Salin No KK">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
                </button>
                <button class="icon-btn-sm" data-id="${k._id}" data-act="copy-nama" title="Salin Nama">
                  <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
                </button>
                <button class="edit-icon-btn" data-id="${k._id}" data-act="edit-kpm">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
                </button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`}
  `;
}

function renderDataView() {
  const desaList = getDesaList();
  const kelompokList = getKelompokList(dataFilter.desa);
  if (!kelompokList.includes(dataFilter.kelompok)) dataFilter.kelompok = '';

  return `
  <div class="card">
    <div class="field">
      <label>Cari Nama</label>
      <input type="text" id="f-search" value="${esc(dataFilter.search)}" placeholder="Ketik nama KPM...">
    </div>
    <div class="field-row">
      <div class="field">
        <label>Desa</label>
        <select id="f-desa">
          <option value="">Semua desa</option>
          ${desaList.map(d => `<option value="${esc(d)}" ${dataFilter.desa === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Kelompok</label>
        <select id="f-kelompok">
          <option value="">Semua kelompok</option>
          ${kelompokList.map(k => `<option value="${esc(k)}" ${dataFilter.kelompok === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}
        </select>
      </div>
    </div>
  </div>

  <div class="btn-row" style="margin:2px 2px 14px">
    <button class="btn secondary" id="btn-add-kpm-manual">+ Tambah KPM Manual</button>
  </div>

  <div id="data-results">${renderDataResults()}</div>
  `;
}

function bindDataResultsEvents() {
  document.querySelectorAll('[data-act="edit-kpm"]').forEach(b => b.addEventListener('click', () => openEditKpm(b.dataset.id)));
  document.querySelectorAll('[data-act="copy-kk"]').forEach(b => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const k = kpmData.find(x => x._id === b.dataset.id);
    if (k) copyToClipboard(k.noKK, 'No KK disalin');
  }));
  document.querySelectorAll('[data-act="copy-nama"]').forEach(b => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const k = kpmData.find(x => x._id === b.dataset.id);
    if (k) copyToClipboard(k.nama, 'Nama disalin');
  }));
}

function bindDataView() {
  const searchEl = document.getElementById('f-search');
  searchEl.addEventListener('input', e => {
    dataFilter.search = e.target.value;
    document.getElementById('data-results').innerHTML = renderDataResults();
    bindDataResultsEvents();
  });
  document.getElementById('f-desa').addEventListener('change', e => { dataFilter.desa = e.target.value; dataFilter.kelompok = ''; render(); });
  document.getElementById('f-kelompok')?.addEventListener('change', e => { dataFilter.kelompok = e.target.value; render(); });
  document.getElementById('btn-add-kpm-manual')?.addEventListener('click', () => openKpmForm(null));
  bindDataResultsEvents();
}

const KOMPONEN_FIELDS = [
  ['hamil', 'Hamil'], ['aud', 'AUD'], ['sd', 'SD'], ['smp', 'SMP'],
  ['sma', 'SMA'], ['lansia', 'Lansia'], ['disabilitas', 'Disabilitas']
];

function openEditKpm(id) {
  openKpmForm(kpmData.find(x => x._id === id));
}

// k = null -> mode tambah KPM baru manual. k = objek -> mode edit KPM yang sudah ada.
function openKpmForm(k) {
  const isNew = !k;
  if (isNew) k = null; // hanya untuk kejelasan; nilai default diambil dari '' di bawah
  const kelompokList = getKelompokList(k ? k.desa : '');
  const komponenFields = KOMPONEN_FIELDS;
  openModal(`
    <div class="modal-head">
      <h3>${isNew ? 'Tambah KPM Manual' : 'Detail KPM'}</h3>
      <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="field"><label>Nama</label><input type="text" id="edit-nama" value="${esc(k?.nama || '')}" placeholder="Nama KPM"></div>
    <div class="field-row">
      <div class="field"><label>Desa</label><input type="text" id="edit-desa" value="${esc(k?.desa || '')}" placeholder="Nama desa"></div>
      <div class="field">
        <label>No KK</label>
        <input type="text" id="edit-nokk" value="${esc(k?.noKK || '')}" placeholder="Nomor KK">
      </div>
    </div>
    <div class="field"><label>Alamat</label><input type="text" id="edit-alamat" value="${esc(k?.alamat || '')}" placeholder="Alamat"></div>
    <div class="field">
      <label>NIK Pengurus</label>
      <input type="text" id="edit-nik-pengurus" value="${esc(k?.nikPengurus || '')}" placeholder="NIK Pengurus">
    </div>
    ${!isNew && k?.komponenDetail && k.komponenDetail.length ? `
    <details class="foto-details">
      <summary class="foto-summary">
        Anggota Komponen (${k.komponenDetail.length})
        <svg class="chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
      </summary>
      <div class="foto-body">
        ${k.komponenDetail.map(a => `
        <div class="row" style="border-bottom:1px solid var(--line); padding:8px 0">
          <div class="k">${esc(a.nama)}<br><span style="color:var(--ink-400);font-size:11px">${esc(a.nik)}</span></div>
          <div class="v" style="text-align:right">
            <span class="badge" style="background:var(--navy-100);color:var(--navy-800)">${esc(a.jenis)}</span>
            ${a.status ? `<br><span style="color:var(--ink-400);font-size:11px">${esc(a.status)}</span>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </details>` : ''}
    <div class="field-row-compact">
      <div class="field w-narrow"><label>RT</label><input type="text" id="edit-rt" value="${esc(k?.rt || '')}" placeholder="RT"></div>
      <div class="field w-narrow"><label>RW</label><input type="text" id="edit-rw" value="${esc(k?.rw || '')}" placeholder="RW"></div>
      <div class="field"><label>No Rekening</label><input type="text" id="edit-noRekening" value="${esc(k?.noRekening || '')}" placeholder="No. rekening"></div>
      <div class="field"><label>No Kartu</label><input type="text" id="edit-noKartu" value="${esc(k?.noKartu || '')}" placeholder="No. kartu"></div>
    </div>
    ${!isNew ? `
    <button class="btn ghost" id="copy-nokk" data-nokk="${esc(k.noKK)}" style="margin-bottom:12px">
      <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Salin No KK
    </button>` : ''}
    <div class="field">
      <label>Komponen Dimiliki</label>
      <div class="komp-grid komp-grid-compact">
        ${komponenFields.map(([f, l]) => `
        <div class="komp-cell">
          <input type="number" min="0" inputmode="numeric" id="edit-komp-${f}" value="${Number(k?.[f]) || 0}"
            style="width:100%; text-align:center; border:1px solid var(--line); font-family:'Poppins',sans-serif; font-weight:800; color:var(--navy-800); background:#fff;">
          <div class="l">${l}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="field">
      <label>Kelompok</label>
      <input type="text" list="kelompok-suggest" id="edit-kelompok" value="${esc(k?.kelompok || '')}" placeholder="Nama kelompok">
      <datalist id="kelompok-suggest">${kelompokList.map(kl => `<option value="${esc(kl)}">`).join('')}</datalist>
    </div>
    <div class="field">
      <label>Status Keaktifan</label>
      <select id="edit-aktif">
        <option value="aktif" ${k?.statusAktif !== false ? 'selected' : ''}>Aktif</option>
        <option value="nonaktif" ${k?.statusAktif === false ? 'selected' : ''}>Nonaktif</option>
      </select>
    </div>
    <div class="field">
      <label>Status KPM (Pengaduan/Graduasi/PPSE)</label>
      <select id="edit-statusbaku">
        ${STATUS_OPTIONS.map(s => `<option value="${s.v}" ${k?.statusBaku === s.v ? 'selected' : ''}>${s.l}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label>Catatan</label>
      <input type="text" id="edit-catatan" value="${esc(k?.catatanPengaduan || '')}" placeholder="Tulis catatan (opsional)">
    </div>
    ${(k?.pengaduanImport || k?.tindakLanjutImport) ? `<div class="hint">Riwayat dari data lama — Pengaduan: ${esc(k.pengaduanImport || '-')}; Tindak Lanjut: ${esc(k.tindakLanjutImport || '-')}</div>` : ''}
    ${!isNew ? `
    <details class="foto-details">
      <summary class="foto-summary">
        Foto & Dokumen
        <svg class="chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
      </summary>
      <div class="foto-body">
        ${PHOTO_TYPES.map(pt => `
        <div class="field">
          <label>${pt.label}</label>
          <div class="photo-slot" id="photo-slot-${pt.key}"><div class="photo-empty">Memuat...</div></div>
          <div class="btn-row">
            <button class="btn secondary" type="button" data-photo-take="${pt.key}">Ambil/Ganti Foto</button>
            <button class="btn danger" type="button" data-photo-del="${pt.key}" style="display:none">Hapus</button>
          </div>
          <input type="file" accept="image/*" capture="environment" id="file-photo-${pt.key}" style="display:none">
        </div>`).join('')}
      </div>
    </details>` : `<div class="hint">Foto & dokumen bisa ditambahkan setelah data ini disimpan (buka lagi lewat Data KPM).</div>`}
    <div class="btn-row" style="margin-top:14px">
      <button class="btn" id="save-kpm">${isNew ? 'Tambah KPM' : 'Simpan Perubahan'}</button>
    </div>
  `);
  if (!isNew) {
    document.getElementById('copy-nokk').addEventListener('click', () => copyToClipboard(k.noKK));
    PHOTO_TYPES.forEach(pt => {
      const fileInput = document.getElementById(`file-photo-${pt.key}`);
      document.querySelector(`[data-photo-take="${pt.key}"]`).addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => handlePhotoCapture(k._id, pt.key, e));
      document.querySelector(`[data-photo-del="${pt.key}"]`).addEventListener('click', () => handlePhotoDelete(k._id, pt.key));
      loadPhotoSlot(k._id, pt.key);
    });
  }
  document.getElementById('save-kpm').addEventListener('click', () => {
    const newNama = document.getElementById('edit-nama').value.trim();
    const newDesa = document.getElementById('edit-desa').value.trim();
    const newNoKK = document.getElementById('edit-nokk').value.trim();
    if (!newNama) { toast('Nama tidak boleh kosong'); return; }
    if (!newNoKK) { toast('No KK tidak boleh kosong'); return; }
    const dup = kpmData.find(x => (!k || x._id !== k._id) && x.noKK === newNoKK);
    if (dup) { toast(`No KK ini sudah dipakai oleh ${dup.nama}`); return; }

    if (isNew) {
      const komponenVals = {};
      komponenFields.forEach(([f]) => {
        komponenVals[f] = Math.max(0, parseInt(document.getElementById(`edit-komp-${f}`).value, 10) || 0);
      });
      kpmData.push({
        _id: uid(),
        nama: newNama,
        namaPengurus: newNama,
        desa: newDesa,
        noKK: newNoKK,
        alamat: document.getElementById('edit-alamat').value.trim(),
        nikPengurus: document.getElementById('edit-nik-pengurus').value.trim(),
        rt: document.getElementById('edit-rt').value.trim(),
        rw: document.getElementById('edit-rw').value.trim(),
        noRekening: document.getElementById('edit-noRekening').value.trim(),
        noKartu: document.getElementById('edit-noKartu').value.trim(),
        ak: '',
        komponen: '',
        ...komponenVals,
        nominal: '',
        nominalP2K2: '',
        kelompok: document.getElementById('edit-kelompok').value.trim(),
        statusAktif: document.getElementById('edit-aktif').value === 'aktif',
        statusBaku: document.getElementById('edit-statusbaku').value,
        catatanPengaduan: document.getElementById('edit-catatan').value.trim(),
        perluLengkapi: false
      });
      saveData();
      closeModal();
      render();
      toast('KPM baru berhasil ditambahkan');
      return;
    }

    const oldNoKK = k.noKK;
    k.nama = newNama;
    k.desa = newDesa;
    k.noKK = newNoKK;
    k.alamat = document.getElementById('edit-alamat').value.trim();
    k.rt = document.getElementById('edit-rt').value.trim();
    k.rw = document.getElementById('edit-rw').value.trim();
    komponenFields.forEach(([f]) => {
      k[f] = Math.max(0, parseInt(document.getElementById(`edit-komp-${f}`).value, 10) || 0);
    });
    k.kelompok = document.getElementById('edit-kelompok').value.trim();
    k.noRekening = document.getElementById('edit-noRekening').value.trim();
    k.noKartu = document.getElementById('edit-noKartu').value.trim();
    k.statusAktif = document.getElementById('edit-aktif').value === 'aktif';
    k.statusBaku = document.getElementById('edit-statusbaku').value;
    k.catatanPengaduan = document.getElementById('edit-catatan').value.trim();
    const nikPengurusEl = document.getElementById('edit-nik-pengurus');
    if (nikPengurusEl) k.nikPengurus = nikPengurusEl.value.trim();

    if (k.perluLengkapi && k.desa && k.alamat) k.perluLengkapi = false;

    if (newNoKK !== oldNoKK) {
      // Sinkronkan No KK lama -> baru di riwayat absensi supaya tidak lepas keterkaitannya
      Object.keys(absensiStore).forEach(key => {
        (absensiStore[key] || []).forEach(entry => {
          if (entry.noKK === oldNoKK) { entry.noKK = newNoKK; entry.nama = newNama; }
        });
      });
      saveAbsensi();
    }

    saveData();
    closeModal();
    render();
    toast('Data KPM diperbarui');
  });
}

async function handlePhotoCapture(kpmId, type, e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  toast('Memproses foto...');
  try {
    const blob = await compressImageFile(file);
    await savePhotoBlob(kpmId, type, blob);
    await loadPhotoSlot(kpmId, type);
    toast('Foto tersimpan');
  } catch (err) {
    console.error(err);
    toast('Gagal menyimpan foto');
  }
}
async function handlePhotoDelete(kpmId, type) {
  await deletePhotoBlob(kpmId, type);
  await loadPhotoSlot(kpmId, type);
  toast('Foto dihapus');
}
async function loadPhotoSlot(kpmId, type) {
  const slot = document.getElementById(`photo-slot-${type}`);
  if (!slot) return; // modal sudah ditutup
  const delBtn = document.querySelector(`[data-photo-del="${type}"]`);
  try {
    const blob = await getPhotoBlob(kpmId, type);
    if (!document.getElementById(`photo-slot-${type}`)) return; // cek ulang, modal bisa ditutup saat menunggu
    if (blob) {
      const url = URL.createObjectURL(blob);
      slot.innerHTML = `<img src="${url}" alt="Foto">`;
      if (delBtn) delBtn.style.display = '';
    } else {
      slot.innerHTML = `<div class="photo-empty">Belum ada foto</div>`;
      if (delBtn) delBtn.style.display = 'none';
    }
  } catch (err) {
    slot.innerHTML = `<div class="photo-empty">Gagal memuat</div>`;
  }
}

/* ============================================================
   STATUS VIEW
   ============================================================ */
const STATUS_ICONS = {
  PENGADUAN: '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.8L2.7 17a1.8 1.8 0 001.5 2.7h15.6a1.8 1.8 0 001.5-2.7L13.7 3.8a1.8 1.8 0 00-3.4 0z"/></svg>',
  CALON_GRADUASI_MANDIRI: '<svg viewBox="0 0 24 24"><path d="M4 19l6-6 4 4 6-8"/><path d="M14 9h6v6"/></svg>',
  CALON_PPSE: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  SUKSES_GRADUASI_MANDIRI: '<svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 01-10 0V4z"/><path d="M7 6H4a3 3 0 003 3M17 6h3a3 3 0 01-3 3"/></svg>',
  SUKSES_PPSE: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M9 14l2 2 4-4"/></svg>',
  PENGURUS_MENINGGAL: '<svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="3.4"/><path d="M2.5 21c0-3.9 2.9-6.5 6.5-6.5s6.5 2.6 6.5 6.5"/><path d="M17 4l4 4M21 4l-4 4"/></svg>',
  KOMPONEN_MENINGGAL: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M17 4l4 4M21 4l-4 4"/></svg>'
};

function renderStatusView() {
  return `
  <div class="card">
    <label>Cari Nama KPM</label>
    <input type="text" id="status-search" value="${esc(statusSearch)}" placeholder="Ketik nama untuk cari & atur status...">
  </div>

  <div id="status-results">${renderStatusResults()}</div>
  `;
}

function renderStatusResults() {
  const q = statusSearch.trim().toLowerCase();
  if (q) return `<div class="section-title">Hasil Pencarian</div>` + renderStatusSearchResults(q);
  return `<div class="section-title">Ringkasan Status</div>` + renderStatusIconList();
}

function renderStatusIconList() {
  return `
  <div class="card">
    <div class="desa-list">
      ${STATUS_OPTIONS.filter(s => s.v).map(s => {
        const n = kpmData.filter(k => k.statusBaku === s.v).length;
        return `<div class="desa-row status-icon-row" data-status="${s.v}" data-label="${esc(s.l)}">
          <div class="chip-num status-chip">${STATUS_ICONS[s.v]}</div>
          <div class="name">${esc(s.l)}</div>
          <div class="count">${n}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderStatusSearchResults(q) {
  const filtered = kpmData.filter(k => k.nama.toLowerCase().includes(q))
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }));
  if (filtered.length === 0) {
    return `<div class="card empty-state">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <p>Nama tidak ditemukan.</p>
    </div>`;
  }
  return filtered.map(k => `
    <div class="status-card" data-id="${k._id}" data-act="open-detail" style="cursor:pointer">
      <div class="nm">${esc(k.nama)}</div>
      <div class="meta">${esc(k.desa)} · ${esc(k.kelompok || 'Tanpa kelompok')} · ${k.statusBaku ? STATUS_LABEL[k.statusBaku] : 'Belum ada status'}</div>
      ${k.catatanPengaduan ? `<div class="catatan">${esc(k.catatanPengaduan)}</div>` : ''}
    </div>`).join('');
}

function bindStatusResultsEvents() {
  document.querySelectorAll('[data-act="open-detail"]').forEach(c => c.addEventListener('click', () => openEditKpm(c.dataset.id)));
  document.querySelectorAll('.status-icon-row').forEach(row => {
    row.addEventListener('click', () => openStatusNameList(row.dataset.status, row.dataset.label));
  });
}

function bindStatusView() {
  const searchEl = document.getElementById('status-search');
  searchEl.addEventListener('input', e => {
    statusSearch = e.target.value;
    document.getElementById('status-results').innerHTML = renderStatusResults();
    bindStatusResultsEvents();
  });
  bindStatusResultsEvents();
}

function openStatusNameList(statusValue, label) {
  const list = kpmData.filter(k => k.statusBaku === statusValue)
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }));
  openModal(`
    <div class="modal-head">
      <h3>${esc(label)}</h3>
      <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="hint" style="margin-bottom:10px">${list.length} KPM dengan status ini</div>
    ${list.length === 0 ? `<div class="hint">Tidak ada data.</div>` : list.map(k => `
      <div class="status-card" data-id="${k._id}" data-act="open-status-detail" style="cursor:pointer">
        <div class="nm">${esc(k.nama)}</div>
        <div class="meta">${esc(k.desa)} · ${esc(k.kelompok || '-')}</div>
        ${k.catatanPengaduan ? `<div class="catatan">${esc(k.catatanPengaduan)}</div>` : ''}
      </div>`).join('')}
  `);
  document.querySelectorAll('[data-act="open-status-detail"]').forEach(card => {
    card.addEventListener('click', () => openEditKpm(card.dataset.id));
  });
}

/* ============================================================
   ABSENSI FDS VIEW
   ============================================================ */
function absensiKey(sel) { return `${sel.modul}_${sel.sesi}_${sel.desa}_${sel.kelompok}_${sel.tanggal}`; }

function renderAbsensiView() {
  const desaList = getDesaList();
  const kelompokList = getKelompokList(absensiSel.desa);
  if (!kelompokList.includes(absensiSel.kelompok)) absensiSel.kelompok = kelompokList[0] || '';
  const sesiList = MODUL_DATA[absensiSel.modul].sesi;
  if (Number(absensiSel.sesi) > sesiList.length) absensiSel.sesi = '1';

  const anggota = kpmData.filter(k => k.desa === absensiSel.desa && k.kelompok === absensiSel.kelompok && k.statusAktif !== false);
  const key = absensiKey(absensiSel);
  const existing = absensiStore[key] || [];
  const statusMap = Object.fromEntries(existing.map(e => [e.noKK, e.status]));

  return `
  <div class="card">
    <div class="field">
      <label>Modul</label>
      <select id="a-modul">
        ${Object.keys(MODUL_DATA).map(m => `<option value="${m}" ${absensiSel.modul == m ? 'selected' : ''}>${m}. ${esc(MODUL_DATA[m].nama)}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label>Sesi / Materi</label>
      <select id="a-sesi">
        ${sesiList.map((s, i) => `<option value="${i + 1}" ${absensiSel.sesi == i + 1 ? 'selected' : ''}>Sesi ${i + 1} — ${esc(s)}</option>`).join('')}
      </select>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Desa</label>
        <select id="a-desa">
          <option value="">— pilih desa —</option>
          ${desaList.map(d => `<option value="${esc(d)}" ${absensiSel.desa === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Kelompok</label>
        <select id="a-kelompok">
          <option value="">— pilih kelompok —</option>
          ${kelompokList.map(k => `<option value="${esc(k)}" ${absensiSel.kelompok === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="field">
      <label>Tanggal</label>
      <input type="date" id="a-tanggal" value="${absensiSel.tanggal}">
    </div>
    <div class="hint">${esc(MODUL_DATA[absensiSel.modul].nama)} · Sesi ${absensiSel.sesi}: ${esc(sesiList[Number(absensiSel.sesi) - 1])}</div>
  </div>

  ${!absensiSel.desa || !absensiSel.kelompok ? `
  <div class="card empty-state">
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/></svg>
    <p>Pilih desa & kelompok untuk menampilkan daftar pengurus.</p>
  </div>` : anggota.length === 0 ? `
  <div class="card empty-state"><p>Tidak ada KPM aktif di kelompok ini.</p></div>` : `
  <div class="card kehadiran-mode-card">
    <div class="field" style="margin-bottom:0">
      <label>Kehadiran — Cek Online atau Manual?</label>
      <select id="a-pdf-mode">
        <option value="aplikasi" ${absensiPdfMode === 'aplikasi' ? 'selected' : ''}>Cek Online (isi Hadir / Sakit / Alpa lewat aplikasi)</option>
        <option value="kosong" ${absensiPdfMode === 'kosong' ? 'selected' : ''}>Cetak Manual (kosongkan, tanda tangan basah oleh KPM)</option>
      </select>
    </div>
    <div class="hint">${absensiPdfMode === 'kosong'
      ? 'Kolom kehadiran dikosongkan — lembar ini akan diprint lalu ditandatangani langsung oleh KPM di lokasi.'
      : 'Kolom kehadiran diisi lewat aplikasi (Hadir / Izin / Sakit / Alpa) dan ikut tercetak di PDF.'}</div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>No</th><th>Nama Pengurus</th><th>No KK</th><th>Alamat</th><th>RT</th><th>RW</th><th>Kehadiran</th></tr></thead>
      <tbody>
        ${anggota.map((k, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${esc(k.namaPengurus || k.nama)}</td>
            <td>${esc(k.noKK)}</td>
            <td>${esc(k.alamat || '-')}</td>
            <td>${esc(k.rt || '-')}</td>
            <td>${esc(k.rw || '-')}</td>
            <td>
              ${absensiPdfMode === 'kosong' ? `<span class="kehadiran-blank">— ttd —</span>` : `
              <select class="absen-status" data-nokk="${esc(k.noKK)}" style="padding:6px 8px;font-size:12px">
                <option value="Hadir" ${statusMap[k.noKK] === 'Hadir' || !statusMap[k.noKK] ? 'selected' : ''}>Hadir</option>
                <option value="Izin" ${statusMap[k.noKK] === 'Izin' ? 'selected' : ''}>Izin</option>
                <option value="Sakit" ${statusMap[k.noKK] === 'Sakit' ? 'selected' : ''}>Sakit</option>
                <option value="Alpa" ${statusMap[k.noKK] === 'Alpa' ? 'selected' : ''}>Alpa</option>
              </select>`}
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div style="height:64px"></div>
  <div class="sticky-actions">
    ${absensiPdfMode === 'kosong' ? '' : '<button class="btn secondary" id="save-absensi">Simpan</button>'}
    <button class="btn gold" id="export-absensi-pdf">Export PDF</button>
    <button class="btn" id="share-absensi-pdf" style="background:var(--navy-700)">
      <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-3.9M8.6 13.5l6.8 3.9"/></svg>
    </button>
  </div>
  `}
  `;
}

function bindAbsensiView() {
  document.getElementById('a-modul').addEventListener('change', e => { absensiSel.modul = e.target.value; absensiSel.sesi = '1'; render(); });
  document.getElementById('a-sesi').addEventListener('change', e => { absensiSel.sesi = e.target.value; render(); });
  document.getElementById('a-desa').addEventListener('change', e => { absensiSel.desa = e.target.value; absensiSel.kelompok = ''; render(); });
  document.getElementById('a-kelompok')?.addEventListener('change', e => { absensiSel.kelompok = e.target.value; render(); });
  document.getElementById('a-tanggal').addEventListener('change', e => { absensiSel.tanggal = e.target.value; render(); });
  document.getElementById('a-pdf-mode')?.addEventListener('change', e => { absensiPdfMode = e.target.value; render(); });

  document.getElementById('save-absensi')?.addEventListener('click', () => {
    const rows = [...document.querySelectorAll('.absen-status')].map(sel => ({
      noKK: sel.dataset.nokk,
      status: sel.value
    }));
    const anggota = kpmData.filter(k => k.desa === absensiSel.desa && k.kelompok === absensiSel.kelompok);
    absensiStore[absensiKey(absensiSel)] = rows.map(r => ({
      ...r,
      nama: anggota.find(a => a.noKK === r.noKK)?.nama || ''
    }));
    saveAbsensi();
    toast('Absensi tersimpan');
  });

  document.getElementById('export-absensi-pdf')?.addEventListener('click', exportAbsensiPDF);
  document.getElementById('share-absensi-pdf')?.addEventListener('click', shareAbsensiPDF);
}

function buildAbsensiDoc() {
  const anggota = kpmData.filter(k => k.desa === absensiSel.desa && k.kelompok === absensiSel.kelompok && k.statusAktif !== false);
  const statuses = [...document.querySelectorAll('.absen-status')];
  const statusMap = Object.fromEntries(statuses.map(s => [s.dataset.nokk, s.value]));
  const modulNama = MODUL_DATA[absensiSel.modul].nama;
  const sesiJudul = MODUL_DATA[absensiSel.modul].sesi[Number(absensiSel.sesi) - 1];
  const isiOtomatis = absensiPdfMode !== 'kosong';

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 14;

  // Kop surat: logo Kemensos (kiri) & logo PKH (kanan)
  const logoH = 13;
  try {
    if (typeof LOGO_KEMENSOS !== 'undefined') {
      const w = logoH * LOGO_KEMENSOS_RATIO;
      doc.addImage(LOGO_KEMENSOS, 'PNG', marginX, 8, w, logoH);
    }
  } catch (e) {}
  try {
    if (typeof LOGO_PKH !== 'undefined') {
      const w = logoH * LOGO_PKH_RATIO;
      doc.addImage(LOGO_PKH, 'PNG', pageW - marginX - w, 8, w, logoH);
    }
  } catch (e) {}

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DAFTAR HADIR FDS', pageW / 2, 14, { align: 'center' });
  doc.setFontSize(10.5);
  const modulLine = doc.splitTextToSize(`${modulNama} — Sesi ${absensiSel.sesi}: ${sesiJudul}`, pageW - marginX * 2 - 70);
  doc.text(modulLine, pageW / 2, 20, { align: 'center' });
  const afterModulY = 20 + (modulLine.length - 1) * 4.6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Desa ${absensiSel.desa} — Kelompok ${absensiSel.kelompok}`, pageW / 2, afterModulY + 6, { align: 'center' });
  doc.text(fmtTanggalPanjang(absensiSel.tanggal), pageW / 2, afterModulY + 11.5, { align: 'center' });

  const headerBottomY = Math.max(afterModulY + 15, 8 + logoH + 3);
  doc.setDrawColor(11, 93, 82);
  doc.setLineWidth(0.5);
  doc.line(marginX, headerBottomY, pageW - marginX, headerBottomY);

  const startY = headerBottomY + 5;
  const statusHeader = isiOtomatis ? 'Status Kehadiran' : 'Tanda Tangan';
  const body = anggota.map((k, i) => [
    i + 1,
    k.namaPengurus || k.nama,
    k.noKK,
    k.alamat || '-',
    k.rt || '-',
    k.rw || '-',
    isiOtomatis ? (statusMap[k.noKK] || 'Hadir') : ''
  ]);

  doc.autoTable({
    startY,
    margin: { left: marginX, right: marginX },
    head: [['No', 'Nama Pengurus', 'No KK', 'Alamat', 'RT', 'RW', statusHeader]],
    body,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2.2 },
    headStyles: { fillColor: [11, 93, 82], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 34 },
      3: { cellWidth: 46 },
      4: { cellWidth: 10, halign: 'center' },
      5: { cellWidth: 10, halign: 'center' },
      6: { cellWidth: 34, halign: 'center', minCellHeight: isiOtomatis ? undefined : 10 }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  const sigX = pageW - marginX - 55;
  doc.setFontSize(10);
  doc.text('Mengetahui,', sigX, finalY);
  doc.text('Pendamping PKH', sigX, finalY + 5);
  if (settings.tandaTanganDataUrl) {
    try {
      const fmt = settings.tandaTanganDataUrl.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(settings.tandaTanganDataUrl, fmt, sigX, finalY + 7, 32, 16);
    } catch (e) {}
  }
  doc.text(settings.namaPendamping || '(...........................)', sigX, finalY + 26);
  if (settings.nip) doc.text(`NIP. ${settings.nip}`, sigX, finalY + 31);

  const fname = `Absensi_FDS_M${absensiSel.modul}S${absensiSel.sesi}_${absensiSel.kelompok}_${absensiSel.tanggal}.pdf`;
  return { doc, fname };
}

function exportAbsensiPDF() {
  const { doc, fname } = buildAbsensiDoc();
  doc.save(fname);
  toast('PDF absensi diunduh');
}

async function shareAbsensiPDF() {
  const { doc, fname } = buildAbsensiDoc();
  const blob = doc.output('blob');
  const file = new File([blob], fname, { type: 'application/pdf' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: fname,
        text: `Absensi FDS — ${absensiSel.desa} / ${absensiSel.kelompok}`
      });
    } catch (e) {
      if (e.name !== 'AbortError') toast('Gagal membuka menu share');
    }
  } else {
    doc.save(fname);
    toast('Share tidak didukung di perangkat ini — PDF diunduh');
  }
}

/* ============================================================
   PENGATURAN VIEW
   ============================================================ */
function renderPengaturanView() {
  return `
  <div class="section-title">Profil Pendamping</div>
  <div class="card">
    <div class="field"><label>Nama Pendamping</label><input type="text" id="set-nama" value="${esc(settings.namaPendamping)}"></div>
    <div class="field"><label>NIP</label><input type="text" id="set-nip" value="${esc(settings.nip)}"></div>
    <button class="btn" id="save-profil">Simpan Profil</button>
  </div>

  <div class="section-title">Tanda Tangan</div>
  <div class="card">
    <div class="hint" style="margin-bottom:10px">Tanda tangan ini akan otomatis dipasang di lembar absensi FDS hasil Export PDF.</div>
    ${settings.tandaTanganDataUrl ? `
      <div style="background:var(--navy-50); border-radius:var(--radius-sm); padding:10px; text-align:center; margin-bottom:10px">
        <img src="${settings.tandaTanganDataUrl}" style="max-height:70px; max-width:100%;">
      </div>` : ''}
    <div class="btn-row">
      <button class="btn secondary" id="btn-upload-ttd">${settings.tandaTanganDataUrl ? 'Ganti Tanda Tangan' : 'Upload Tanda Tangan'}</button>
      ${settings.tandaTanganDataUrl ? `<button class="btn danger" id="btn-hapus-ttd">Hapus</button>` : ''}
    </div>
    <input type="file" id="file-ttd" accept="image/*">
  </div>

  <div class="section-title">Data KPM</div>
  <div class="card settings-card">
    <div class="row"><div class="k">Total data tersimpan</div><div class="v">${kpmData.length} KPM</div></div>
    <div class="row"><div class="k">Perkiraan pemakaian penyimpanan</div><div class="v" id="storage-usage">Menghitung...</div></div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn secondary" id="btn-import">Import Data Excel</button>
    </div>
    <input type="file" id="file-import" accept=".xlsx,.xls">
    <div class="hint">Import ulang akan memperbarui data lama berdasarkan No KK, dan menambah data KPM baru. Kalau file sumber (Excel mentah dari Dinsos) tidak punya kolom Status/Catatan, status yang sudah diatur di aplikasi tetap aman. Kalau yang diimport adalah file hasil "Export Data Pemutakhiran", status & catatannya ikut disinkronkan dari file itu.</div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn gold" id="btn-export">Export Data Pemutakhiran (Excel)</button>
    </div>
    <div class="hint">Export ini berisi data teks saja (tanpa foto). Lakukan secara berkala sebagai cadangan.</div>
  </div>

  <div class="section-title">👨‍👩‍👧 Import Detail Komponen</div>
  <div class="card" style="border:1.5px solid var(--navy-100)">
    <div class="hint" style="margin-bottom:10px">
      Untuk file "Data Semua Komponen" (kolom NIK Komponen, Nama Komponen, Komponen, Status, Nama Pengurus, NIK Pengurus, No KK). Data akan dicocokkan ke KPM berdasarkan No KK, lalu Nama Pengurus, NIK Pengurus, dan daftar anggota komponen otomatis terisi/tampil di Detail KPM.
    </div>
    <button class="btn secondary" id="btn-import-komponen">Import Data Semua Komponen</button>
    <input type="file" id="file-import-komponen" accept=".xlsx,.xls" style="display:none">
  </div>

  <div class="section-title">✨ Import Gabungan (Excel + CSV)</div>
  <div class="card" style="border:1.5px solid var(--amber-500)">
    <div class="hint" style="margin-bottom:10px">
      Untuk data final closing (Excel, kolom "Nama Pengurus" berisi nama+No KK digabung) yang perlu dilengkapi desa/alamat/RT/RW dari CSV data pendukung penyalur. Bisa upload beberapa file Excel & CSV sekaligus, langsung masuk aplikasi tanpa unduh/unggah ulang.
    </div>
    <button class="btn gold" id="btn-import-gabungan">Mulai Import Gabungan</button>
  </div>

  <div class="section-title">Daftar Kelompok per Desa</div>
  <div class="card">
    <div class="field">
      <label>Desa</label>
      <input type="text" id="km-desa" list="km-desa-suggest" value="${esc(_kelompokMasterDesaSel)}" placeholder="Ketik/pilih nama desa">
      <datalist id="km-desa-suggest">${getAllDesaOptions().map(d => `<option value="${esc(d)}">`).join('')}</datalist>
    </div>
    <div class="field-row">
      <div class="field"><label>Nama Kelompok Baru</label><input type="text" id="km-new" placeholder="Nama kelompok"></div>
    </div>
    <div class="btn-row"><button class="btn secondary" id="btn-km-add">Tambah Kelompok</button></div>
    <div id="km-list" style="margin-top:12px">${renderKelompokMasterList(_kelompokMasterDesaSel)}</div>
    <div class="hint">Daftar ini dipakai sebagai pilihan dropdown Kelompok di Detail KPM — berguna kalau ada data hasil import yang kolom Kelompok-nya kosong, tinggal pilih dari daftar ini.</div>
  </div>

  <div class="section-title">Reset Data</div>
  <div class="card">
    <div class="hint">Hapus semua data KPM & riwayat absensi yang tersimpan di perangkat ini. Tindakan ini tidak bisa dibatalkan — export data pemutakhiran dulu kalau perlu cadangan.</div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn danger" id="btn-reset">Hapus Semua Data</button>
    </div>
  </div>

  <div class="section-title">Tentang</div>
  <div class="card">
    <div class="hint">Data disimpan langsung di perangkat ini (tidak tersinkron otomatis ke perangkat lain). Lakukan export data pemutakhiran secara berkala sebagai cadangan.</div>
  </div>
  `;
}

function bindPengaturanView() {
  document.getElementById('save-profil').addEventListener('click', () => {
    settings.namaPendamping = document.getElementById('set-nama').value.trim();
    settings.nip = document.getElementById('set-nip').value.trim();
    saveSettings();
    updateHeaderBadge();
    toast('Profil disimpan');
  });
  document.getElementById('btn-import').addEventListener('click', () => document.getElementById('file-import').click());
  document.getElementById('file-import').addEventListener('change', handleImportExcel);
  document.getElementById('btn-import-gabungan').addEventListener('click', openImportGabunganModal);
  document.getElementById('btn-import-komponen').addEventListener('click', () => document.getElementById('file-import-komponen').click());
  document.getElementById('file-import-komponen').addEventListener('change', handleImportKomponen);
  document.getElementById('btn-export').addEventListener('click', exportPemutakhiran);
  document.getElementById('btn-reset').addEventListener('click', openResetConfirm);
  document.getElementById('btn-upload-ttd').addEventListener('click', () => document.getElementById('file-ttd').click());
  document.getElementById('file-ttd').addEventListener('change', handleUploadTtd);
  document.getElementById('btn-hapus-ttd')?.addEventListener('click', () => {
    settings.tandaTanganDataUrl = '';
    saveSettings();
    render();
    toast('Tanda tangan dihapus');
  });
  document.getElementById('km-desa').addEventListener('change', (e) => {
    _kelompokMasterDesaSel = e.target.value.trim();
    render();
  });
  document.getElementById('btn-km-add').addEventListener('click', () => {
    const desa = document.getElementById('km-desa').value.trim();
    const nama = document.getElementById('km-new').value.trim();
    if (!desa) { toast('Isi/pilih nama desa dulu'); return; }
    if (!nama) { toast('Isi nama kelompok dulu'); return; }
    if (!settings.kelompokByDesa[desa]) settings.kelompokByDesa[desa] = [];
    if (settings.kelompokByDesa[desa].includes(nama)) { toast('Kelompok ini sudah ada di desa tsb'); return; }
    settings.kelompokByDesa[desa].push(nama);
    settings.kelompokByDesa[desa].sort();
    saveSettings();
    _kelompokMasterDesaSel = desa;
    render();
    toast('Kelompok ditambahkan');
  });
  document.querySelectorAll('[data-km-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const desa = document.getElementById('km-desa').value.trim();
      const nama = btn.dataset.kmDel;
      settings.kelompokByDesa[desa] = (settings.kelompokByDesa[desa] || []).filter(x => x !== nama);
      saveSettings();
      render();
      toast('Kelompok dihapus');
    });
  });
  updateStorageUsage();
}

async function updateStorageUsage() {
  const el = document.getElementById('storage-usage');
  if (!el) return;
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      const mb = (est.usage || 0) / (1024 * 1024);
      if (!document.getElementById('storage-usage')) return;
      el.textContent = mb < 1 ? `${Math.round((est.usage || 0) / 1024)} KB` : `${mb.toFixed(1)} MB`;
    } else {
      el.textContent = '-';
    }
  } catch (e) {
    if (el) el.textContent = '-';
  }
}

function handleUploadTtd(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      // Resize ke lebar maksimal 400px & kompres ke JPEG agar ukuran PDF tetap kecil
      const maxW = 400;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      // Latar putih agar transparansi PNG tidak jadi hitam saat dikonversi ke JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      settings.tandaTanganDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      saveSettings();
      render();
      toast('Tanda tangan tersimpan');
    };
    img.onerror = () => toast('Gagal memproses gambar tanda tangan');
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function openResetConfirm() {
  openModal(`
    <div class="modal-head">
      <h3>Hapus Semua Data?</h3>
      <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="hint" style="font-size:13px; color:var(--ink-600); margin-bottom:14px">
      ${kpmData.length} data KPM, seluruh riwayat absensi, dan semua foto yang tersimpan akan dihapus permanen dari perangkat ini. Profil pendamping tidak ikut terhapus. Aksi ini tidak bisa dibatalkan.
    </div>
    <div class="btn-row">
      <button class="btn secondary" data-act="close-modal">Batal</button>
      <button class="btn danger" id="confirm-reset">Ya, Hapus Semua</button>
    </div>
  `);
  document.getElementById('confirm-reset').addEventListener('click', async () => {
    kpmData = [];
    absensiStore = {};
    saveData();
    saveAbsensi();
    try { await clearAllPhotos(); } catch (e) { console.error(e); }
    closeModal();
    berandaDesaFilter = '';
    dataFilter = { desa: '', kelompok: '' };
    setView('beranda');
    toast('Semua data KPM sudah dihapus');
  });
}

/* ---------------- Import Excel ---------------- */
function handleImportExcel(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const wb = XLSX.read(evt.target.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      importRows(rows);
    } catch (err) {
      toast('Gagal membaca file Excel');
      console.error(err);
    }
    e.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}

function pick(row, ...keys) {
  for (const k of keys) {
    for (const rk of Object.keys(row)) {
      if (rk.trim().toLowerCase() === k.toLowerCase()) return row[rk];
    }
  }
  return '';
}

function hasCol(row, name) {
  return Object.keys(row).some(rk => rk.trim().toLowerCase() === name.toLowerCase());
}

const STATUS_LABEL_REVERSE = Object.fromEntries(STATUS_OPTIONS.filter(s => s.v).map(s => [s.l.toLowerCase(), s.v]));

function importRows(rows) {
  let added = 0, updated = 0;
  const firstRow = rows[0] || {};
  const hasStatusKpmCol = hasCol(firstRow, 'Status KPM');
  const hasStatusAktifCol = hasCol(firstRow, 'Status Aktif');
  const hasCatatanCol = hasCol(firstRow, 'Catatan');

  rows.forEach(r => {
    const noKK = String(pick(r, 'No KK', 'NOKK') || '').trim();
    const nama = String(pick(r, 'Nama') || '').trim();
    if (!noKK || !nama) return;

    const incoming = {
      nama,
      namaPengurus: String(pick(r, 'Nama Pengurus', 'Pengurus') || '').trim(),
      noKK,
      desa: String(pick(r, 'Desa') || '').trim(),
      alamat: String(pick(r, 'Alamat') || '').trim(),
      rt: String(pick(r, 'RT') || '').trim(),
      rw: String(pick(r, 'RW') || '').trim(),
      noRekening: String(pick(r, 'No Rekening', 'Nomor Rekening') || '').trim(),
      noKartu: String(pick(r, 'No Kartu', 'Nomor Kartu') || '').trim(),
      ak: String(pick(r, 'AK') || '').trim(),
      komponen: String(pick(r, 'Komponen') || '').trim(),
      hamil: Number(pick(r, 'Hamil')) || 0,
      aud: Number(pick(r, 'AUD')) || 0,
      sd: Number(pick(r, 'SD')) || 0,
      smp: Number(pick(r, 'SMP')) || 0,
      sma: Number(pick(r, 'SMA')) || 0,
      lansia: Number(pick(r, 'Lansia')) || 0,
      disabilitas: Number(pick(r, 'Disabilitas')) || 0,
      nominal: String(pick(r, 'Nominal') || '').trim(),
      kelompok: String(pick(r, 'KELOMPOK', 'Kelompok') || '').trim(),
      nominalP2K2: String(pick(r, 'NOMINAL P2K2') || '').trim(),
      pengaduanImport: String(pick(r, 'PENGADUAN') || '').trim(),
      tindakLanjutImport: String(pick(r, 'TINDAK LANJUT') || '').trim()
    };

    const statusAktifVal = hasStatusAktifCol ? String(pick(r, 'Status Aktif')).trim().toLowerCase() !== 'nonaktif' : true;
    const statusBakuVal = hasStatusKpmCol ? (STATUS_LABEL_REVERSE[String(pick(r, 'Status KPM')).trim().toLowerCase()] || '') : '';
    const catatanVal = hasCatatanCol ? String(pick(r, 'Catatan') || '').trim() : '';

    const existing = kpmData.find(k => k.noKK === noKK);
    if (existing) {
      Object.assign(existing, incoming);
      // Kolom status/catatan hanya ditimpa kalau file yang diimport memang punya kolom itu
      // (misal file hasil "Export Data Pemutakhiran") — supaya import data mentah tidak menghapus status yang sudah diatur.
      if (hasStatusAktifCol) existing.statusAktif = statusAktifVal;
      if (hasStatusKpmCol) existing.statusBaku = statusBakuVal;
      if (hasCatatanCol) existing.catatanPengaduan = catatanVal;
      updated++;
    } else {
      kpmData.push({
        _id: uid(),
        ...incoming,
        statusAktif: statusAktifVal,
        statusBaku: statusBakuVal,
        catatanPengaduan: catatanVal
      });
      added++;
    }
  });
  saveData();
  render();
  toast(`Import selesai: ${added} baru, ${updated} diperbarui`);
}

/* ============================================================
   IMPORT DETAIL KOMPONEN (Data Semua Komponen)
   Format kolom: NIK Komponen | Nama Komponen | Komponen | Status |
                 Nama Pengurus | NIK Pengurus | No KK | Desa | Alamat | RT | RW
   ============================================================ */
function handleImportKomponen(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const wb = XLSX.read(evt.target.result, { type: 'array' });
      // Ambil sheet yang punya kolom "No KK" & "NIK Komponen" (lewati sheet DEBUG bila ada)
      let rows = [];
      for (const name of wb.SheetNames) {
        const candidate = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: '' });
        if (candidate.length && hasCol(candidate[0], 'No KK') && hasCol(candidate[0], 'NIK Komponen')) {
          rows = candidate;
          break;
        }
      }
      if (!rows.length) {
        toast('Sheet dengan kolom "No KK" & "NIK Komponen" tidak ditemukan di file ini');
      } else {
        importKomponenRows(rows);
      }
    } catch (err) {
      toast('Gagal membaca file Excel');
      console.error(err);
    }
    e.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}

function importKomponenRows(rows) {
  // Kelompokkan baris per No KK (dinormalisasi ke digit saja, biar tahan format beda-beda)
  const groups = new Map();
  rows.forEach(r => {
    const noKKRaw = String(pick(r, 'No KK', 'NOKK') || '').trim();
    const kkNorm = normKKIg(noKKRaw);
    if (!kkNorm) return;
    if (!groups.has(kkNorm)) groups.set(kkNorm, []);
    groups.get(kkNorm).push({
      nik: String(pick(r, 'NIK Komponen') || '').trim(),
      nama: String(pick(r, 'Nama Komponen') || '').trim(),
      jenis: String(pick(r, 'Komponen') || '').trim(),
      status: String(pick(r, 'Status') || '').trim(),
      namaPengurus: String(pick(r, 'Nama Pengurus') || '').trim(),
      nikPengurus: String(pick(r, 'NIK Pengurus') || '').trim()
    });
  });

  let kkUpdated = 0, anggotaBaru = 0, anggotaDiperbarui = 0;
  const notFound = [];

  groups.forEach((anggotaList, kkNorm) => {
    const existing = kpmData.find(k => normKKIg(k.noKK) === kkNorm);
    if (!existing) {
      notFound.push({ noKK: kkNorm, namaPengurus: anggotaList[0]?.namaPengurus || '' });
      return;
    }
    kkUpdated++;
    const first = anggotaList[0];
    if (!existing.namaPengurus && first.namaPengurus) existing.namaPengurus = first.namaPengurus;
    if (first.nikPengurus) existing.nikPengurus = first.nikPengurus;

    if (!Array.isArray(existing.komponenDetail)) existing.komponenDetail = [];
    anggotaList.forEach(a => {
      if (!a.nik) return;
      const idx = existing.komponenDetail.findIndex(d => d.nik === a.nik);
      const entry = { nik: a.nik, nama: a.nama, jenis: a.jenis, status: a.status };
      if (idx === -1) {
        existing.komponenDetail.push(entry);
        anggotaBaru++;
      } else {
        existing.komponenDetail[idx] = entry;
        anggotaDiperbarui++;
      }
    });
  });

  saveData();
  render();

  let msg = `Import komponen selesai: ${kkUpdated} KK diperbarui, ${anggotaBaru} anggota baru, ${anggotaDiperbarui} anggota diperbarui`;
  if (notFound.length) {
    msg += `. ${notFound.length} No KK tidak ditemukan di data KPM`;
    console.warn('No KK tidak ditemukan saat import komponen:', notFound);
  }
  toast(msg);
}

/* ============================================================
   IMPORT GABUNGAN (Excel Final Closing + CSV Data Pendukung)
   ============================================================ */
let _ig = { excelFiles: [], csvFiles: [], result: null };

function guessColumnIg(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const cand of candidates) {
    const idx = lower.findIndex(h => h === cand);
    if (idx !== -1) return headers[idx];
  }
  for (const cand of candidates) {
    const idx = lower.findIndex(h => h.includes(cand));
    if (idx !== -1) return headers[idx];
  }
  return headers[0] || '';
}
function normKKIg(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/\D/g, '');
}
function extractRTIg(alamat) {
  if (!alamat) return '';
  const matches = [...String(alamat).matchAll(/RT:?\s*(\d+)/ig)];
  return matches.length ? matches[matches.length - 1][1] : '';
}
function extractRWIg(alamat) {
  if (!alamat) return '';
  const matches = [...String(alamat).matchAll(/RW:?\s*(\d+)/ig)];
  return matches.length ? matches[matches.length - 1][1] : '';
}
function splitNamaPengurusIg(raw) {
  const parts = String(raw || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  return { nama: parts[0] || '', noKK: parts.length > 1 ? parts[parts.length - 1].trim() : '' };
}

function openImportGabunganModal() {
  _ig = { excelFiles: [], csvFiles: [], result: null };
  openModal(renderIgStep1());
  bindIgStep1();
}

function renderIgStep1() {
  return `
  <div class="modal-head">
    <h3>Import Gabungan — Langkah 1/3</h3>
    <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
  <div class="ig-progress"><div class="ig-pstep now"></div><div class="ig-pstep"></div><div class="ig-pstep"></div></div>
  <div class="step-title" style="font-size:14px; margin-bottom:4px">Upload data final closing (Excel)</div>
  <div class="hint" style="margin-bottom:10px">Kolom "Nama Pengurus" berisi nama & No KK digabung dalam satu sel. Boleh unggah lebih dari satu file (misal per desa).</div>
  <div class="ig-dropzone" id="ig-dz-excel">
    <div class="ig-dz-text">📄 Ketuk untuk pilih file .xlsx</div>
    <div class="ig-dz-sub">Bisa lebih dari satu file sekaligus</div>
  </div>
  <input type="file" id="ig-file-excel" accept=".xlsx,.xls" multiple style="display:none">
  <div class="ig-filelist" id="ig-filelist-excel"></div>
  <div class="btn-row" style="margin-top:14px">
    <button class="btn" id="ig-next-1" disabled>Lanjut ke Data Pendukung →</button>
  </div>
  `;
}

function bindIgStep1() {
  document.getElementById('ig-dz-excel').addEventListener('click', () => document.getElementById('ig-file-excel').click());
  document.getElementById('ig-file-excel').addEventListener('change', handleIgExcelFiles);
  document.getElementById('ig-next-1').addEventListener('click', () => {
    openModal(renderIgStep2());
    bindIgStep2();
  });
  renderIgExcelFileList();
}

function handleIgExcelFiles(e) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  let pending = files.length;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        _ig.excelFiles.push({ name: file.name, rows });
      } catch (err) {
        toast(`Gagal membaca ${file.name}`);
        console.error(err);
      }
      pending--;
      if (pending === 0) renderIgExcelFileList();
    };
    reader.readAsArrayBuffer(file);
  });
  e.target.value = '';
}

function renderIgExcelFileList() {
  const el = document.getElementById('ig-filelist-excel');
  if (!el) return;
  el.innerHTML = _ig.excelFiles.map((f, idx) => `
    <div class="ig-filerow">
      <div class="fname">📄 ${esc(f.name)}</div>
      <div class="frows">${f.rows.length} baris</div>
      <button class="frm" data-idx="${idx}" data-act="ig-remove-excel">✕</button>
    </div>
  `).join('');
  el.querySelectorAll('[data-act="ig-remove-excel"]').forEach(b => {
    b.addEventListener('click', () => {
      _ig.excelFiles.splice(Number(b.dataset.idx), 1);
      renderIgExcelFileList();
    });
  });
  const nextBtn = document.getElementById('ig-next-1');
  if (nextBtn) nextBtn.disabled = _ig.excelFiles.length === 0;
}

function renderIgStep2() {
  return `
  <div class="modal-head">
    <h3>Import Gabungan — Langkah 2/3</h3>
    <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
  <div class="ig-progress"><div class="ig-pstep done"></div><div class="ig-pstep now"></div><div class="ig-pstep"></div></div>
  <div class="step-title" style="font-size:14px; margin-bottom:4px">Upload data pendukung (CSV)</div>
  <div class="hint" style="margin-bottom:10px">Berisi No KK, kelurahan/desa, dan alamat. Desa & RT/RW otomatis diambil dari sini. Bisa lebih dari satu file, otomatis digabung.</div>
  <div class="ig-dropzone" id="ig-dz-csv">
    <div class="ig-dz-text">📄 Ketuk untuk pilih file .csv</div>
    <div class="ig-dz-sub">Bisa lebih dari satu file sekaligus</div>
  </div>
  <input type="file" id="ig-file-csv" accept=".csv" multiple style="display:none">
  <div class="ig-filelist" id="ig-filelist-csv"></div>
  <div class="btn-row" style="margin-top:14px">
    <button class="btn secondary" id="ig-back-2">← Kembali</button>
    <button class="btn" id="ig-next-2" disabled>Cocokkan Data →</button>
  </div>
  `;
}

function bindIgStep2() {
  document.getElementById('ig-dz-csv').addEventListener('click', () => document.getElementById('ig-file-csv').click());
  document.getElementById('ig-file-csv').addEventListener('change', handleIgCsvFiles);
  document.getElementById('ig-back-2').addEventListener('click', () => { openModal(renderIgStep1()); bindIgStep1(); });
  document.getElementById('ig-next-2').addEventListener('click', () => {
    doMatchGabungan();
    openModal(renderIgStep3());
    bindIgStep3();
  });
  renderIgCsvFileList();
}

function handleIgCsvFiles(e) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  let pending = files.length;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = Papa.parse(evt.target.result, { header: true, skipEmptyLines: true });
        _ig.csvFiles.push({ name: file.name, rows: parsed.data });
      } catch (err) {
        toast(`Gagal membaca ${file.name}`);
        console.error(err);
      }
      pending--;
      if (pending === 0) renderIgCsvFileList();
    };
    reader.readAsText(file);
  });
  e.target.value = '';
}

function renderIgCsvFileList() {
  const el = document.getElementById('ig-filelist-csv');
  if (!el) return;
  el.innerHTML = _ig.csvFiles.map((f, idx) => `
    <div class="ig-filerow">
      <div class="fname">📄 ${esc(f.name)}</div>
      <div class="frows">${f.rows.length} baris</div>
      <button class="frm" data-idx="${idx}" data-act="ig-remove-csv">✕</button>
    </div>
  `).join('');
  el.querySelectorAll('[data-act="ig-remove-csv"]').forEach(b => {
    b.addEventListener('click', () => {
      _ig.csvFiles.splice(Number(b.dataset.idx), 1);
      renderIgCsvFileList();
    });
  });
  const nextBtn = document.getElementById('ig-next-2');
  if (nextBtn) nextBtn.disabled = _ig.csvFiles.length === 0;
}

function doMatchGabungan() {
  // Bangun lookup alamat/desa dari semua file CSV, kunci No KK yang dinormalisasi
  const lookup = {};
  _ig.csvFiles.forEach(f => {
    if (!f.rows.length) return;
    const headers = Object.keys(f.rows[0]);
    const nokkCol = guessColumnIg(headers, ['nokk', 'no kk', 'no_kk']);
    const desaCol = guessColumnIg(headers, ['kel_name', 'kelurahan', 'desa']);
    const alamatCol = guessColumnIg(headers, ['alamat']);
    f.rows.forEach(r => {
      const kk = normKKIg(r[nokkCol]);
      if (kk && !lookup[kk]) {
        const alamat = String(r[alamatCol] || '').trim();
        lookup[kk] = {
          desa: String(r[desaCol] || '').trim(),
          alamat,
          rt: extractRTIg(alamat),
          rw: extractRWIg(alamat)
        };
      }
    });
  });

  const ready = [], needsCheck = [], skipped = [];
  const seenInBatch = new Set();

  _ig.excelFiles.forEach(f => {
    f.rows.forEach(r => {
      const raw = pick(r, 'Nama Pengurus', 'Pengurus');
      const { nama, noKK } = splitNamaPengurusIg(raw);
      if (!noKK || !nama) return;
      const kkMatch = normKKIg(noKK);
      if (seenInBatch.has(kkMatch)) return; // duplikat No KK antar file dalam batch ini, ambil kemunculan pertama saja
      seenInBatch.add(kkMatch);

      const existing = kpmData.find(k => normKKIg(k.noKK) === kkMatch);
      if (existing) {
        skipped.push({ nama, noKK });
        return;
      }

      const found = lookup[kkMatch];
      const kpmObj = {
        _id: uid(),
        nama,
        namaPengurus: nama,
        noKK,
        desa: found ? found.desa : '',
        alamat: found ? found.alamat : '',
        rt: found ? found.rt : '',
        rw: found ? found.rw : '',
        ak: String(pick(r, 'AK') || '').trim(),
        komponen: String(pick(r, 'Komponen') || '').trim(),
        hamil: Number(pick(r, 'Hamil')) || 0,
        aud: Number(pick(r, 'AUD')) || 0,
        sd: Number(pick(r, 'SD')) || 0,
        smp: Number(pick(r, 'SMP')) || 0,
        sma: Number(pick(r, 'SMA')) || 0,
        lansia: Number(pick(r, 'Lansia')) || 0,
        disabilitas: Number(pick(r, 'Disabilitas')) || 0,
        nominal: String(pick(r, 'Nominal') || '').trim(),
        nominalP2K2: String(pick(r, 'NOMINAL P2K2') || '').trim(),
        kelompok: '',
        statusAktif: true,
        statusBaku: '',
        catatanPengaduan: '',
        perluLengkapi: !found
      };

      if (found) ready.push(kpmObj);
      else needsCheck.push(kpmObj);
    });
  });

  _ig.result = { ready, needsCheck, skipped };
}

function igInitial(nama) {
  const parts = String(nama || '').trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
}

function renderIgKpmRow(k, warn) {
  const meta = warn
    ? `<span class="meta warn-txt">${esc(k.noKK)} · Alamat tidak ditemukan di CSV</span>`
    : `<span class="meta">${esc(k.noKK)}${k.desa ? ' · ' + esc(k.desa) : ''}${k.rt ? ' · RT ' + esc(k.rt) + '/RW ' + esc(k.rw) : ''}</span>`;
  return `
    <div class="ig-row ${warn ? 'warn' : 'ok'}">
      <div class="ig-avatar">${igInitial(k.nama)}</div>
      <div class="ig-row-info">
        <div class="nm">${esc(k.nama)}</div>
        ${meta}
      </div>
    </div>`;
}

function renderIgStep3() {
  const { ready, needsCheck, skipped } = _ig.result;
  const PREVIEW_LIMIT = 5;
  return `
  <div class="modal-head">
    <h3>Import Gabungan — Langkah 3/3</h3>
    <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
  <div class="ig-progress"><div class="ig-pstep done"></div><div class="ig-pstep done"></div><div class="ig-pstep now"></div></div>

  <div class="ig-stat-grid">
    <div class="ig-stat-card ok"><div class="n">${ready.length}</div><div class="l">Siap import<br>(alamat lengkap)</div></div>
    <div class="ig-stat-card warn"><div class="n">${needsCheck.length}</div><div class="l">Baru, alamat<br>belum ketemu</div></div>
    <div class="ig-stat-card skip"><div class="n">${skipped.length}</div><div class="l">Dilewati<br>(sudah ada)</div></div>
  </div>

  <div class="ig-section-title">✅ Siap diimport <span class="ig-pill">${ready.length}</span></div>
  ${ready.length ? ready.slice(0, PREVIEW_LIMIT).map(k => renderIgKpmRow(k, false)).join('') : '<div class="hint">Tidak ada.</div>'}
  ${ready.length > PREVIEW_LIMIT ? `<div class="ig-more">+ ${ready.length - PREVIEW_LIMIT} lainnya</div>` : ''}

  <div class="ig-section-title warn">⚠️ Baru, perlu dicek <span class="ig-pill">${needsCheck.length}</span></div>
  ${needsCheck.length ? needsCheck.slice(0, PREVIEW_LIMIT).map(k => renderIgKpmRow(k, true)).join('') : '<div class="hint">Tidak ada.</div>'}
  ${needsCheck.length > PREVIEW_LIMIT ? `<div class="ig-more">+ ${needsCheck.length - PREVIEW_LIMIT} lainnya</div>` : ''}
  ${needsCheck.length ? '<div class="hint">KPM di atas <strong>tetap akan ditambahkan</strong> ke aplikasi (karena memang belum ada), tapi kolom desa/alamat/RT/RW dikosongkan dulu — nanti diisi manual lewat halaman Data KPM (ditandai badge "⚠ Lengkapi Data").</div>' : ''}

  <div class="ig-section-title" style="color:var(--ink-400)">⏭️ Dilewati — sudah ada di aplikasi <span class="ig-pill" style="background:var(--ink-400)">${skipped.length}</span></div>
  <div class="hint">No KK ini sudah tercatat sebelumnya di aplikasi, jadi tidak ditimpa supaya perubahan manual (status, catatan, dll) tidak hilang.</div>

  <div class="btn-row" style="margin-top:14px">
    <button class="btn secondary" id="ig-back-3">← Kembali</button>
    <button class="btn gold" id="ig-commit" ${(ready.length + needsCheck.length) === 0 ? 'disabled' : ''}>Simpan ${ready.length + needsCheck.length} KPM ke Aplikasi</button>
  </div>
  `;
}

function bindIgStep3() {
  document.getElementById('ig-back-3').addEventListener('click', () => { openModal(renderIgStep2()); bindIgStep2(); });
  document.getElementById('ig-commit').addEventListener('click', commitImportGabungan);
}

function commitImportGabungan() {
  const { ready, needsCheck } = _ig.result;
  kpmData.push(...ready, ...needsCheck);
  saveData();
  closeModal();
  render();
  toast(`Import selesai: ${ready.length} lengkap, ${needsCheck.length} perlu dilengkapi`);
  _ig = { excelFiles: [], csvFiles: [], result: null };
}

/* ---------------- Export Excel ---------------- */
function exportPemutakhiran() {
  const rows = kpmData.map((k, i) => ({
    'No': i + 1,
    'Nama': k.nama,
    'Nama Pengurus': k.namaPengurus || '',
    'NIK Pengurus': k.nikPengurus || '',
    'No KK': k.noKK,
    'Desa': k.desa,
    'Alamat': k.alamat,
    'RT': k.rt,
    'RW': k.rw,
    'No Rekening': k.noRekening || '',
    'No Kartu': k.noKartu || '',
    'AK': k.ak,
    'Komponen': k.komponen,
    'Hamil': k.hamil || 0,
    'AUD': k.aud || 0,
    'SD': k.sd || 0,
    'SMP': k.smp || 0,
    'SMA': k.sma || 0,
    'Lansia': k.lansia || 0,
    'Disabilitas': k.disabilitas || 0,
    'Nominal': k.nominal,
    'KELOMPOK': k.kelompok,
    'NOMINAL P2K2': k.nominalP2K2,
    'PENGADUAN': k.pengaduanImport,
    'TINDAK LANJUT': k.tindakLanjutImport,
    'Status Aktif': k.statusAktif === false ? 'Nonaktif' : 'Aktif',
    'Status KPM': STATUS_LABEL[k.statusBaku] || '',
    'Catatan': k.catatanPengaduan || ''
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pemutakhiran');
  const fname = `Pemutakhiran_KPM_${todayISO()}.xlsx`;
  XLSX.writeFile(wb, fname);
  toast('Data pemutakhiran diunduh');
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  const wasOpen = document.getElementById('modal-backdrop').classList.contains('open');
  document.getElementById('modal-backdrop').classList.add('open');
  document.querySelectorAll('[data-act="close-modal"]').forEach(b => b.addEventListener('click', () => closeModal()));
  if (!wasOpen) history.pushState({ modal: true }, '');
}
function closeModal(fromPopstate) {
  document.getElementById('modal-backdrop').classList.remove('open');
  if (!fromPopstate && history.state && history.state.modal) {
    history.back();
  }
}
document.getElementById('modal-backdrop').addEventListener('click', (e) => {
  if (e.target.id === 'modal-backdrop') closeModal();
});

/* ============================================================
   INIT
   ============================================================ */
function migrateIds() {
  let changed = false;
  kpmData.forEach(k => { if (!k._id) { k._id = uid(); changed = true; } });
  if (changed) saveData();
}

function updateHeaderBadge() {
  const el = document.getElementById('pendamping-name');
  if (!el) return;
  el.textContent = settings.namaPendamping ? settings.namaPendamping : 'Atur Profil';
}

function init() {
  migrateIds();
  updateHeaderBadge();
  history.replaceState({ view: 'beranda' }, '');
  setView('beranda', false);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
init();
