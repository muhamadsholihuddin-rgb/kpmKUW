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
let settings = loadJSON(LS_KEYS.settings, { namaPendamping: '', nip: '', tandaTanganDataUrl: '' });
let absensiStore = loadJSON(LS_KEYS.absensi, {}); // key -> [{noKK,nama,status}]

let currentView = 'beranda';
let berandaDesaFilter = '';
let dataFilter = { desa: '', kelompok: '', search: '' };
let statusSearch = '';
let absensiSel = { modul: '1', sesi: '1', desa: '', kelompok: '', tanggal: todayISO() };

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
function getKelompokList(desa) {
  const src = desa ? kpmData.filter(k => k.desa === desa) : kpmData;
  return [...new Set(src.map(k => k.kelompok).filter(Boolean))].sort();
}
function kelompokColor(name) {
  if (!name) return { bg: '#EDEDED', fg: '#7C8D88' };
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

function copyToClipboard(text, label = 'Teks') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => toast(`${label} disalin`),
      () => fallbackCopy(text, label)
    );
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label = 'Teks') {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    toast(`${label} disalin`);
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
            <td>
              <div style="display:flex;align-items:center;gap:3px">
                <strong class="kpm-name-link" data-id="${k._id}" data-act="edit-kpm">${esc(k.nama)}</strong>
                <button class="copy-icon-btn" data-act="copy-field" data-value="${esc(k.nama)}" data-label="Nama" title="Salin nama">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
              <div style="display:flex;align-items:center;gap:3px;margin-top:2px">
                <span style="color:var(--ink-400);font-size:11px">${esc(k.noKK)}</span>
                <button class="copy-icon-btn" data-act="copy-field" data-value="${esc(k.noKK)}" data-label="No KK" title="Salin No KK">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
            </td>
            <td>${esc(k.desa)}</td>
            <td><span class="badge" style="background:${kc.bg};color:${kc.fg}">${esc(k.kelompok || 'Tanpa kelompok')}</span></td>
            <td>
              <span class="badge ${k.statusAktif === false ? 'nonaktif' : 'aktif'}">${k.statusAktif === false ? 'Nonaktif' : 'Aktif'}</span>
              ${k.statusBaku ? `<br><span class="badge" style="background:var(--coral-100);color:var(--coral-500);margin-top:4px;display:inline-block">${esc(STATUS_LABEL[k.statusBaku])}</span>` : ''}
            </td>
            <td><button class="edit-icon-btn" data-id="${k._id}" data-act="edit-kpm">
              <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
            </button></td>
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
    <button class="btn secondary" id="btn-add-kpm" style="margin-bottom:12px">
      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
      Tambah KPM Manual
    </button>
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

  <div id="data-results">${renderDataResults()}</div>
  `;
}

function bindDataResultsEvents() {
  document.querySelectorAll('[data-act="edit-kpm"]').forEach(b => b.addEventListener('click', () => openEditKpm(b.dataset.id)));
  document.querySelectorAll('[data-act="copy-field"]').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(b.dataset.value, b.dataset.label);
    });
  });
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
  document.getElementById('btn-add-kpm').addEventListener('click', openAddKpm);
  bindDataResultsEvents();
}

function openAddKpm() {
  const desaList = getDesaList();
  openModal(`
    <div class="modal-head">
      <h3>Tambah KPM Manual</h3>
      <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="field">
      <label>Nama <span style="color:var(--coral-500)">*</span></label>
      <input type="text" id="add-nama" placeholder="Nama KPM">
    </div>
    <div class="field">
      <label>Nama Pengurus</label>
      <input type="text" id="add-namapengurus" placeholder="Nama pengurus (opsional)">
    </div>
    <div class="field-row">
      <div class="field">
        <label>Desa <span style="color:var(--coral-500)">*</span></label>
        <input type="text" list="add-desa-suggest" id="add-desa" placeholder="Nama desa">
        <datalist id="add-desa-suggest">${desaList.map(d => `<option value="${esc(d)}">`).join('')}</datalist>
      </div>
      <div class="field">
        <label>No KK <span style="color:var(--coral-500)">*</span></label>
        <input type="text" id="add-nokk" placeholder="16 digit No KK" inputmode="numeric">
      </div>
    </div>
    <div class="field"><label>Alamat</label><input type="text" id="add-alamat" placeholder="Alamat (opsional)"></div>
    <div class="field-row">
      <div class="field"><label>RT</label><input type="text" id="add-rt" placeholder="-"></div>
      <div class="field"><label>RW</label><input type="text" id="add-rw" placeholder="-"></div>
    </div>
    <div class="field">
      <label>Kelompok</label>
      <input type="text" id="add-kelompok" placeholder="Nama kelompok (opsional)">
    </div>
    <div class="field">
      <label>Nominal Bantuan</label>
      <input type="number" id="add-nominal" placeholder="0" inputmode="numeric">
    </div>
    <div class="field">
      <label>Status Keaktifan</label>
      <select id="add-aktif">
        <option value="aktif" selected>Aktif</option>
        <option value="nonaktif">Nonaktif</option>
      </select>
    </div>
    <div class="btn-row" style="margin-top:14px">
      <button class="btn" id="save-add-kpm">Simpan KPM Baru</button>
    </div>
  `);
  document.getElementById('save-add-kpm').addEventListener('click', () => {
    const nama = document.getElementById('add-nama').value.trim();
    const desa = document.getElementById('add-desa').value.trim();
    const noKK = document.getElementById('add-nokk').value.trim();
    if (!nama || !desa || !noKK) {
      toast('Nama, Desa, dan No KK wajib diisi');
      return;
    }
    if (kpmData.some(k => k.noKK === noKK)) {
      toast('No KK ini sudah terdaftar');
      return;
    }
    const newKpm = {
      _id: uid(),
      nama,
      namaPengurus: document.getElementById('add-namapengurus').value.trim(),
      noKK,
      desa,
      alamat: document.getElementById('add-alamat').value.trim(),
      rt: document.getElementById('add-rt').value.trim(),
      rw: document.getElementById('add-rw').value.trim(),
      kelompok: document.getElementById('add-kelompok').value.trim(),
      nominal: document.getElementById('add-nominal').value.trim(),
      statusAktif: document.getElementById('add-aktif').value === 'aktif',
      statusBaku: '',
      catatanPengaduan: ''
    };
    kpmData.push(newKpm);
    saveData();
    closeModal();
    render();
    toast('KPM baru ditambahkan');
  });
}

function openEditKpm(id) {
  const k = kpmData.find(x => x._id === id);
  if (!k) return;
  const kelompokList = getKelompokList(k.desa);
  const komponenList = [
    ['hamil', 'Hamil'], ['aud', 'AUD'], ['sd', 'SD'], ['smp', 'SMP'],
    ['sma', 'SMA'], ['lansia', 'Lansia'], ['disabilitas', 'Disabilitas']
  ].filter(([f]) => Number(k[f]) > 0);
  openModal(`
    <div class="modal-head">
      <h3>Detail KPM</h3>
      <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="field"><label>Nama</label><input type="text" value="${esc(k.nama)}" disabled></div>
    <div class="field-row">
      <div class="field"><label>Desa</label><input type="text" value="${esc(k.desa)}" disabled></div>
      <div class="field">
        <label>No KK</label>
        <input type="text" value="${esc(k.noKK)}" disabled>
      </div>
    </div>
    <div class="field"><label>Alamat</label><input type="text" value="${esc(k.alamat || '-')}" disabled></div>
    <div class="field-row">
      <div class="field"><label>RT</label><input type="text" value="${esc(k.rt || '-')}" disabled></div>
      <div class="field"><label>RW</label><input type="text" value="${esc(k.rw || '-')}" disabled></div>
    </div>
    <button class="btn ghost" id="copy-nokk" data-nokk="${esc(k.noKK)}" style="margin-bottom:12px">
      <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Salin No KK
    </button>
    <div class="field">
      <label>Komponen Dimiliki</label>
      ${komponenList.length === 0 ? `<div class="hint">Tidak ada data komponen.</div>` : `
      <div class="komp-grid" style="grid-template-columns:repeat(4,1fr)">
        ${komponenList.map(([f, l]) => `<div class="komp-cell"><div class="n">${k[f]}</div><div class="l">${l}</div></div>`).join('')}
      </div>`}
    </div>
    <div class="field">
      <label>Kelompok</label>
      <input type="text" list="kelompok-suggest" id="edit-kelompok" value="${esc(k.kelompok || '')}" placeholder="Nama kelompok">
      <datalist id="kelompok-suggest">${kelompokList.map(kl => `<option value="${esc(kl)}">`).join('')}</datalist>
    </div>
    <div class="field">
      <label>Status Keaktifan</label>
      <select id="edit-aktif">
        <option value="aktif" ${k.statusAktif !== false ? 'selected' : ''}>Aktif</option>
        <option value="nonaktif" ${k.statusAktif === false ? 'selected' : ''}>Nonaktif</option>
      </select>
    </div>
    <div class="field">
      <label>Status KPM (Pengaduan/Graduasi/PPSE)</label>
      <select id="edit-statusbaku">
        ${STATUS_OPTIONS.map(s => `<option value="${s.v}" ${k.statusBaku === s.v ? 'selected' : ''}>${s.l}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label>Catatan</label>
      <input type="text" id="edit-catatan" value="${esc(k.catatanPengaduan || '')}" placeholder="Tulis catatan (opsional)">
    </div>
    ${(k.pengaduanImport || k.tindakLanjutImport) ? `<div class="hint">Riwayat dari data lama — Pengaduan: ${esc(k.pengaduanImport || '-')}; Tindak Lanjut: ${esc(k.tindakLanjutImport || '-')}</div>` : ''}
    <div class="btn-row" style="margin-top:14px">
      <button class="btn" id="save-kpm">Simpan Perubahan</button>
    </div>
  `);
  document.getElementById('copy-nokk').addEventListener('click', () => copyToClipboard(k.noKK, 'No KK'));
  document.getElementById('save-kpm').addEventListener('click', () => {
    k.kelompok = document.getElementById('edit-kelompok').value.trim();
    k.statusAktif = document.getElementById('edit-aktif').value === 'aktif';
    k.statusBaku = document.getElementById('edit-statusbaku').value;
    k.catatanPengaduan = document.getElementById('edit-catatan').value.trim();
    saveData();
    closeModal();
    render();
    toast('Data KPM diperbarui');
  });
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
              <select class="absen-status" data-nokk="${esc(k.noKK)}" style="padding:6px 8px;font-size:12px">
                <option value="Hadir" ${statusMap[k.noKK] === 'Hadir' || !statusMap[k.noKK] ? 'selected' : ''}>Hadir</option>
                <option value="Izin" ${statusMap[k.noKK] === 'Izin' ? 'selected' : ''}>Izin</option>
                <option value="Sakit" ${statusMap[k.noKK] === 'Sakit' ? 'selected' : ''}>Sakit</option>
                <option value="Alpa" ${statusMap[k.noKK] === 'Alpa' ? 'selected' : ''}>Alpa</option>
              </select>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div style="height:64px"></div>
  <div class="sticky-actions">
    <button class="btn secondary" id="save-absensi">Simpan</button>
    <button class="btn gold" id="export-absensi-pdf">Export PDF</button>
    <button class="btn" id="share-absensi-pdf" style="background:var(--teal-700)">
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

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DAFTAR HADIR FDS', pageW / 2, 13, { align: 'center' });
  doc.setFontSize(10.5);
  const modulLine = doc.splitTextToSize(`${modulNama} — Sesi ${absensiSel.sesi}: ${sesiJudul}`, pageW - marginX * 2);
  doc.text(modulLine, pageW / 2, 19, { align: 'center' });
  const afterModulY = 19 + (modulLine.length - 1) * 4.6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Desa ${absensiSel.desa} — Kelompok ${absensiSel.kelompok}`, pageW / 2, afterModulY + 6, { align: 'center' });
  doc.text(fmtTanggalPanjang(absensiSel.tanggal), pageW / 2, afterModulY + 11.5, { align: 'center' });

  const startY = afterModulY + 17;
  const body = anggota.map((k, i) => [i + 1, k.namaPengurus || k.nama, k.noKK, k.alamat || '-', k.rt || '-', k.rw || '-', statusMap[k.noKK] || 'Hadir']);

  doc.autoTable({
    startY,
    head: [['No', 'Nama Pengurus', 'No KK', 'Alamat', 'RT', 'RW', 'Status Kehadiran']],
    body,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2.6 },
    headStyles: { fillColor: [11, 93, 82], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 42 },
      3: { cellWidth: 70 },
      4: { cellWidth: 14, halign: 'center' },
      5: { cellWidth: 14, halign: 'center' },
      6: { cellWidth: 36, halign: 'center' }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  const sigX = pageW - 70;
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
      <div style="background:var(--teal-50); border-radius:var(--radius-sm); padding:10px; text-align:center; margin-bottom:10px">
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
    <div class="btn-row" style="margin-top:10px">
      <button class="btn secondary" id="btn-import">Import Data Excel</button>
    </div>
    <input type="file" id="file-import" accept=".xlsx,.xls">
    <div class="hint">Import ulang akan memperbarui data lama berdasarkan No KK, dan menambah data KPM baru. Kalau file sumber (Excel mentah dari Dinsos) tidak punya kolom Status/Catatan, status yang sudah diatur di aplikasi tetap aman. Kalau yang diimport adalah file hasil "Export Data Pemutakhiran", status & catatannya ikut disinkronkan dari file itu.</div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn gold" id="btn-export">Export Data Pemutakhiran (Excel)</button>
    </div>
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
}

function handleUploadTtd(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    settings.tandaTanganDataUrl = evt.target.result;
    saveSettings();
    render();
    toast('Tanda tangan tersimpan');
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
      ${kpmData.length} data KPM dan seluruh riwayat absensi akan dihapus permanen dari perangkat ini. Profil pendamping tidak ikut terhapus. Aksi ini tidak bisa dibatalkan.
    </div>
    <div class="btn-row">
      <button class="btn secondary" data-act="close-modal">Batal</button>
      <button class="btn danger" id="confirm-reset">Ya, Hapus Semua</button>
    </div>
  `);
  document.getElementById('confirm-reset').addEventListener('click', () => {
    kpmData = [];
    absensiStore = {};
    saveData();
    saveAbsensi();
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
      namaPengurus: String(pick(r, 'Nama Pengurus') || '').trim(),
      noKK,
      desa: String(pick(r, 'Desa') || '').trim(),
      alamat: String(pick(r, 'Alamat') || '').trim(),
      rt: String(pick(r, 'RT') || '').trim(),
      rw: String(pick(r, 'RW') || '').trim(),
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

/* ---------------- Export Excel ---------------- */
function exportPemutakhiran() {
  const rows = kpmData.map((k, i) => ({
    'No': i + 1,
    'Nama': k.nama,
    'Nama Pengurus': k.namaPengurus || '',
    'No KK': k.noKK,
    'Desa': k.desa,
    'Alamat': k.alamat,
    'RT': k.rt,
    'RW': k.rw,
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
