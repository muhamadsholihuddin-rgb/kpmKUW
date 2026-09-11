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

const RINGKASAN_MATERI = [
  {
    judul: 'Bimbingan Mental dan Spiritual',
    identitas: {
      sasaran: 'KPM PKH (Keluarga Penerima Manfaat)',
      waktu: '90–120 menit (1 sesi pertemuan)',
      metode: 'Ceramah interaktif, diskusi kelompok, curah pendapat, roleplay, refleksi',
      media: 'Flipchart/papan tulis, spidol, kartu komitmen, kartu skenario roleplay'
    },
    tujuanUmum: 'Peserta mampu menguatkan nilai agama dan moral serta membangun keluarga yang harmonis sebagai fondasi kesejahteraan keluarga.',
    tujuanKhusus: [
      'Menjelaskan pentingnya nilai agama dan moral dalam kehidupan berkeluarga.',
      'Mengidentifikasi ciri-ciri keluarga harmonis dan faktor yang memengaruhinya.',
      'Memahami tanggung jawab orang tua terhadap anak dan pasangan.',
      'Mempraktikkan cara berkomunikasi yang sehat dan menyelesaikan konflik keluarga secara konstruktif.',
      'Membiasakan sikap disiplin, jujur, bersyukur, dan saling menghargai dalam keluarga.'
    ],
    materiPokok: [
      'Penguatan nilai agama dan moral.',
      'Membangun keluarga harmonis.',
      'Tanggung jawab orang tua.',
      'Komunikasi dan penyelesaian konflik dalam keluarga.',
      'Membiasakan disiplin, jujur, bersyukur, dan saling menghargai.'
    ],
    langkah: {
      pembukaan: {
        waktu: '10 menit',
        poin: [
          'Fasilitator membuka sesi dengan salam dan doa bersama sesuai keyakinan masing-masing peserta.',
          'Ice breaking singkat untuk mencairkan suasana.',
          'Fasilitator menyampaikan tujuan dan alur sesi hari ini.'
        ]
      },
      inti: {
        waktu: '60–80 menit',
        sub: [
          { judul: 'Curah Pendapat', waktu: '15 menit', poin: [
            'Fasilitator mengajukan pertanyaan pemantik: "Menurut Bapak/Ibu, apa yang membuat sebuah keluarga disebut harmonis?"',
            'Peserta menyampaikan pendapat secara bergantian, dicatat di flipchart.'
          ]},
          { judul: 'Penyampaian Materi', waktu: '20 menit', poin: [
            'Fasilitator memaparkan nilai-nilai agama dan moral sebagai fondasi keluarga, ciri keluarga harmonis, dan tanggung jawab orang tua.',
            'Diselingi tanya jawab agar peserta aktif.'
          ]},
          { judul: 'Diskusi Kelompok Kecil', waktu: '15 menit', poin: [
            'Peserta dibagi 3–4 kelompok kecil.',
            'Tiap kelompok berbagi pengalaman nyata mengenai tantangan menjaga keharmonisan keluarga sehari-hari, lalu menuliskan 1 solusi yang pernah berhasil diterapkan.'
          ]},
          { judul: 'Roleplay Penyelesaian Konflik', waktu: '15–20 menit', poin: [
            'Fasilitator membagikan kartu skenario sederhana (mis. beda pendapat soal pengeluaran rumah tangga, anak bandel, dsb).',
            '2 pasang peserta memperagakan skenario: cara yang kurang tepat vs cara komunikasi yang sehat.',
            'Diskusi bersama mengenai perbedaan dampaknya bagi keluarga.'
          ]},
          { judul: 'Curah Pendapat Nilai Keluarga', waktu: '10 menit', poin: [
            'Fasilitator mengajukan pertanyaan: "Nilai apa yang ingin Bapak/Ibu wariskan kepada anak?"',
            'Beberapa peserta berbagi secara sukarela.'
          ]}
        ]
      },
      penutup: {
        waktu: '10–15 menit',
        poin: [
          'Fasilitator merangkum poin-poin penting sesi.',
          'Kartu Komitmen: setiap peserta menuliskan 1 kebiasaan baik (disiplin/jujur/bersyukur/menghargai) yang akan diterapkan di rumah minggu ini.',
          'Doa penutup bersama.'
        ]
      }
    },
    evaluasi: [
      'Evaluasi proses: pengamatan fasilitator terhadap keaktifan peserta dalam diskusi dan roleplay.',
      'Evaluasi hasil: kartu komitmen yang diisi peserta, ditinjau kembali pada sesi berikutnya sebagai bentuk tindak lanjut.',
      'Pertanyaan reflektif penutup: "Satu hal apa yang paling berkesan dari sesi hari ini?"'
    ],
    rujukan: 'Peraturan Menteri Sosial Republik Indonesia Nomor 8 Tahun 2026.'
  },
  {
    judul: 'Pengelolaan Keuangan dan Perencanaan Usaha',
    identitas: {
      sasaran: 'KPM PKH (Keluarga Penerima Manfaat)',
      waktu: '90–120 menit (1 sesi pertemuan)',
      metode: 'Ceramah interaktif, simulasi, permainan kelompok, diskusi, curah pendapat',
      media: 'Flipchart/papan tulis, spidol, buku kas sederhana, kartu contoh barang belanja'
    },
    tujuanUmum: 'Peserta mampu mengelola keuangan keluarga secara bijak dan merintis/mengembangkan usaha keluarga.',
    tujuanKhusus: [
      'Menjelaskan cara mengatur pendapatan dan pengeluaran keluarga.',
      'Membedakan kebutuhan dan keinginan dalam berbelanja.',
      'Membiasakan menabung secara rutin.',
      'Menghindari utang konsumtif dan memahami risikonya.',
      'Merencanakan dan mengembangkan usaha keluarga sesuai potensi yang dimiliki.'
    ],
    materiPokok: [
      'Mengatur pendapatan dan pengeluaran keluarga.',
      'Membedakan kebutuhan dan keinginan.',
      'Membiasakan menabung.',
      'Menghindari utang konsumtif.',
      'Merencanakan dan mengembangkan usaha keluarga.'
    ],
    langkah: {
      pembukaan: {
        waktu: '10 menit',
        poin: [
          'Salam dan doa pembuka.',
          'Ice breaking: permainan "lempar bola pertanyaan keuangan".',
          'Fasilitator menyampaikan tujuan dan alur sesi.'
        ]
      },
      inti: {
        waktu: '60–80 menit',
        sub: [
          { judul: 'Curah Pendapat', waktu: '10 menit', poin: [
            'Fasilitator bertanya: "Apa tantangan terbesar Bapak/Ibu dalam mengatur uang belanja bulanan?"'
          ]},
          { judul: 'Penyampaian Materi', waktu: '15 menit', poin: [
            'Konsep dasar mengatur pendapatan dan pengeluaran, membedakan kebutuhan vs keinginan, pentingnya menabung, dan bahaya utang konsumtif.'
          ]},
          { judul: 'Simulasi Pencatatan Keuangan', waktu: '15 menit', poin: [
            'Peserta mencatat pemasukan dan pengeluaran seminggu terakhir di buku kas sederhana yang dibagikan fasilitator.'
          ]},
          { judul: 'Permainan "Kebutuhan vs Keinginan"', waktu: '15 menit', poin: [
            'Peserta menyortir kartu contoh barang (beras, pulsa hiburan, sabun, rokok, dsb.) ke dua kelompok: kebutuhan dan keinginan, lalu didiskusikan bersama.'
          ]},
          { judul: 'Diskusi Kelompok: Pengalaman Berutang', waktu: '10 menit', poin: [
            'Peserta berbagi pengalaman berutang dan cara-cara menghindari utang konsumtif.'
          ]},
          { judul: 'Sharing Ide Usaha Keluarga', waktu: '10–15 menit', poin: [
            'Tiap kelompok berbagi ide usaha rumahan sesuai potensi dan sumber daya di desa masing-masing (mis. olahan hasil pertanian, jasa, kerajinan).'
          ]}
        ]
      },
      penutup: {
        waktu: '10–15 menit',
        poin: [
          'Fasilitator merangkum poin-poin penting sesi.',
          'Peserta menyusun target tabungan mingguan sederhana di kartu pribadi.',
          'Doa penutup.'
        ]
      }
    },
    evaluasi: [
      'Pengamatan keaktifan peserta selama simulasi dan permainan kelompok.',
      'Hasil catatan buku kas sederhana dan target tabungan yang diisi peserta.',
      'Ditinjau kembali pada sesi berikutnya sebagai bentuk tindak lanjut.'
    ],
    rujukan: 'Peraturan Menteri Sosial Republik Indonesia Nomor 8 Tahun 2026.'
  },
  {
    judul: 'Kesehatan dan Gizi',
    identitas: {
      sasaran: 'KPM PKH (Keluarga Penerima Manfaat)',
      waktu: '90–120 menit (1 sesi pertemuan)',
      metode: 'Ceramah interaktif, demo praktik, simulasi, diskusi kelompok',
      media: 'Flipchart/papan tulis, spidol, contoh bahan pangan/gambar makanan, sabun cuci tangan'
    },
    tujuanUmum: 'Peserta mampu menerapkan pola hidup sehat dan pemenuhan gizi keluarga guna mendukung tumbuh kembang optimal dan mencegah stunting.',
    tujuanKhusus: [
      'Menjelaskan pentingnya menjaga kesehatan ibu dan anak.',
      'Menyusun menu bergizi seimbang dengan bahan pangan lokal.',
      'Mengenali tanda dan langkah pencegahan stunting.',
      'Menerapkan PHBS (Perilaku Hidup Bersih dan Sehat) dan sanitasi di rumah tangga.',
      'Memanfaatkan fasilitas kesehatan (Posyandu/Puskesmas) secara rutin.'
    ],
    materiPokok: [
      'Menjaga kesehatan ibu dan anak.',
      'Pemenuhan gizi keluarga.',
      'Pencegahan stunting.',
      'PHBS dan sanitasi.',
      'Pemanfaatan fasilitas kesehatan.'
    ],
    langkah: {
      pembukaan: {
        waktu: '10 menit',
        poin: [
          'Salam, doa, dan ice breaking (mis. tebak gambar makanan sehat).',
          'Fasilitator menyampaikan tujuan sesi.'
        ]
      },
      inti: {
        waktu: '60–80 menit',
        sub: [
          { judul: 'Curah Pendapat', waktu: '10 menit', poin: [
            'Fasilitator bertanya: "Apa saja makanan bergizi yang mudah didapat di sekitar kita?"'
          ]},
          { judul: 'Penyampaian Materi "Isi Piringku"', waktu: '15 menit', poin: [
            'Proporsi karbohidrat, protein, sayur, dan buah menggunakan bahan pangan lokal yang murah dan mudah didapat.'
          ]},
          { judul: 'Demo Praktik Menyusun Menu', waktu: '15 menit', poin: [
            'Peserta berkelompok menyusun 1 contoh menu sehari dengan bahan yang biasa mereka beli.'
          ]},
          { judul: 'Diskusi Pencegahan Stunting', waktu: '15 menit', poin: [
            'Mengenali ciri dan tahapan pencegahan stunting sejak 1.000 Hari Pertama Kehidupan (HPK).'
          ]},
          { judul: 'Simulasi Cuci Tangan Pakai Sabun', waktu: '10 menit', poin: [
            'Praktik langkah-langkah cuci tangan yang benar bersama-sama.'
          ]},
          { judul: 'Sharing Pengalaman Posyandu/Puskesmas', waktu: '10 menit', poin: [
            'Peserta berbagi hambatan dan solusi dalam memanfaatkan layanan kesehatan terdekat.'
          ]}
        ]
      },
      penutup: {
        waktu: '10–15 menit',
        poin: [
          'Fasilitator merangkum poin-poin penting sesi.',
          'Peserta menuliskan komitmen kunjungan rutin ke fasilitas kesehatan pada kartu pribadi.',
          'Doa penutup.'
        ]
      }
    },
    evaluasi: [
      'Pengamatan keaktifan peserta dalam diskusi dan demo praktik.',
      'Hasil menu kelompok yang disusun bersama.',
      'Komitmen kunjungan fasilitas kesehatan yang ditulis peserta, ditindaklanjuti pada sesi berikutnya.'
    ],
    rujukan: 'Peraturan Menteri Sosial Republik Indonesia Nomor 8 Tahun 2026.'
  },
  {
    judul: 'Kesejahteraan Sosial',
    identitas: {
      sasaran: 'KPM PKH (Keluarga Penerima Manfaat)',
      waktu: '90–110 menit (1 sesi pertemuan)',
      metode: 'Diskusi kasus, curah pendapat, roleplay, latihan pengisian formulir',
      media: 'Flipchart/papan tulis, spidol, contoh formulir pengajuan layanan sosial'
    },
    tujuanUmum: 'Peserta mampu memastikan pemenuhan hak dan perlindungan sosial bagi seluruh anggota keluarga, termasuk lansia dan penyandang disabilitas.',
    tujuanKhusus: [
      'Menjelaskan hak-hak dasar lansia dan penyandang disabilitas dalam keluarga.',
      'Menerapkan cara merawat dan mendukung kemandirian anggota keluarga yang membutuhkan.',
      'Mengidentifikasi akses layanan dan perlindungan sosial yang tersedia.',
      'Mengenali dan mencegah tindakan penelantaran serta diskriminasi dalam keluarga.'
    ],
    materiPokok: [
      'Pemenuhan hak lansia dan penyandang disabilitas.',
      'Kemandirian dan perawatan anggota keluarga yang membutuhkan.',
      'Akses terhadap layanan dan perlindungan sosial.',
      'Mencegah penelantaran dan diskriminasi.'
    ],
    langkah: {
      pembukaan: {
        waktu: '10 menit',
        poin: [
          'Salam, doa, dan ice breaking singkat.',
          'Fasilitator menyampaikan tujuan sesi.'
        ]
      },
      inti: {
        waktu: '60–75 menit',
        sub: [
          { judul: 'Diskusi Kasus', waktu: '15 menit', poin: [
            'Peserta berbagi pengalaman nyata bagaimana keluarga merawat lansia/disabilitas di rumah secara mandiri.'
          ]},
          { judul: 'Curah Pendapat Hak Dasar', waktu: '10 menit', poin: [
            'Diskusi mengenai hak-hak dasar yang perlu dipenuhi bagi lansia/disabilitas dalam keluarga.'
          ]},
          { judul: 'Penyampaian Materi', waktu: '15 menit', poin: [
            'Jenis layanan dan perlindungan sosial yang tersedia (mis. bansos lansia, kartu disabilitas, dsb).'
          ]},
          { judul: 'Roleplay Pelaporan Kasus', waktu: '15 menit', poin: [
            'Simulasi cara melaporkan dugaan penelantaran/diskriminasi kepada pihak berwenang (RT/RW, desa, Dinas Sosial).'
          ]},
          { judul: 'Latihan Mengisi Formulir Pengajuan Layanan', waktu: '10–15 menit', poin: [
            'Peserta berlatih mengisi formulir sederhana pengajuan bantuan/layanan sosial.'
          ]}
        ]
      },
      penutup: {
        waktu: '10–15 menit',
        poin: [
          'Fasilitator merangkum poin-poin penting sesi.',
          'Komitmen bersama untuk saling peduli terhadap anggota keluarga yang rentan.',
          'Doa penutup.'
        ]
      }
    },
    evaluasi: [
      'Pengamatan keaktifan peserta dalam diskusi dan roleplay.',
      'Formulir latihan yang berhasil diisi peserta.',
      'Ditindaklanjuti pada kunjungan rumah/sesi berikutnya.'
    ],
    rujukan: 'Peraturan Menteri Sosial Republik Indonesia Nomor 8 Tahun 2026.'
  },
  {
    judul: 'Fasilitasi, Mediasi, Edukasi, Motivasi dan Advokasi',
    identitas: {
      sasaran: 'KPM PKH (Keluarga Penerima Manfaat)',
      waktu: '90–120 menit (1 sesi pertemuan)',
      metode: 'Curah pendapat, simulasi, roleplay, diskusi kelompok, sesi motivasi',
      media: 'Flipchart/papan tulis, spidol, contoh formulir/dokumen, kartu RTL (Rencana Tindak Lanjut)'
    },
    tujuanUmum: 'Peserta (didampingi fasilitator) mampu memfasilitasi, memediasi, dan memotivasi diri sendiri agar mampu mengakses layanan dan menyelesaikan masalah secara mandiri.',
    tujuanKhusus: [
      'Memahami cara mengakses layanan kesehatan dan pendidikan.',
      'Membantu penyelesaian masalah administrasi kependudukan/sosial.',
      'Melakukan mediasi sederhana dengan pihak terkait (sekolah, puskesmas, desa).',
      'Membangun motivasi untuk menyelesaikan masalah secara mandiri.',
      'Mengetahui layanan/program bantuan yang sesuai dengan kebutuhan keluarga.'
    ],
    materiPokok: [
      'Membantu KPM mengakses layanan kesehatan dan pendidikan.',
      'Membantu penyelesaian masalah administrasi.',
      'Mediasi dengan pihak terkait.',
      'Memberikan motivasi agar KPM mampu menyelesaikan masalah secara mandiri.',
      'Mengarahkan KPM kepada layanan/program yang sesuai.'
    ],
    langkah: {
      pembukaan: {
        waktu: '10 menit',
        poin: [
          'Salam, doa, dan ice breaking singkat.',
          'Fasilitator menyampaikan tujuan sesi.'
        ]
      },
      inti: {
        waktu: '60–80 menit',
        sub: [
          { judul: 'Curah Pendapat', waktu: '10 menit', poin: [
            'Fasilitator bertanya: "Kesulitan apa yang paling sering dihadapi saat mengurus dokumen atau layanan?"'
          ]},
          { judul: 'Simulasi Pendampingan Dokumen', waktu: '15 menit', poin: [
            'Peserta berlatih langkah-langkah mengurus dokumen (KTP, KIS, akta kelahiran, dsb).'
          ]},
          { judul: 'Roleplay Mediasi', waktu: '15–20 menit', poin: [
            '2 peserta memperagakan proses mediasi antara KPM dan pihak layanan (mis. sekolah/puskesmas) yang awalnya berkomunikasi kurang lancar.'
          ]},
          { judul: 'Diskusi Kelompok: Hambatan Akses Layanan', waktu: '10 menit', poin: [
            'Identifikasi hambatan yang dialami peserta dan solusi bersama.'
          ]},
          { judul: 'Sesi Motivasi — Kisah Sukses', waktu: '10–15 menit', poin: [
            'Berbagi kisah sukses KPM lain yang berhasil mandiri, dilanjutkan diskusi hikmah yang bisa diambil.'
          ]},
          { judul: 'Latihan Menyusun Rencana Tindak Lanjut (RTL)', waktu: '10 menit', poin: [
            'Tiap peserta menuliskan 1 langkah konkret yang akan dilakukan untuk menyelesaikan kendala pribadinya.'
          ]}
        ]
      },
      penutup: {
        waktu: '10–15 menit',
        poin: [
          'Fasilitator merangkum poin-poin penting sesi.',
          'Pengumpulan kartu RTL peserta.',
          'Doa penutup.'
        ]
      }
    },
    evaluasi: [
      'Pengamatan keaktifan peserta dalam roleplay dan diskusi.',
      'Kartu RTL yang ditulis peserta.',
      'Ditindaklanjuti oleh pendamping pada kunjungan rumah berikutnya.'
    ],
    rujukan: 'Peraturan Menteri Sosial Republik Indonesia Nomor 8 Tahun 2026.'
  },
  {
    judul: 'P2K2 Adaptif',
    identitas: {
      sasaran: 'KPM PKH (Keluarga Penerima Manfaat)',
      waktu: '65–90 menit (bersifat fleksibel sesuai kebutuhan kelompok)',
      metode: 'Curah pendapat, diskusi kelompok, studi kasus kontekstual, refleksi',
      media: 'Flipchart/papan tulis, spidol, contoh kasus kontekstual sesuai wilayah'
    },
    tujuanUmum: 'Peserta dan pendamping mampu menyesuaikan materi P2K2 dengan kondisi dan permasalahan aktual yang dihadapi kelompok.',
    tujuanKhusus: [
      'Mengidentifikasi masalah aktual (sosial, ekonomi, kesehatan, pendidikan, keluarga, kebencanaan) yang sedang dihadapi kelompok.',
      'Merumuskan solusi bersama atas isu terkini yang relevan dengan kondisi wilayah.',
      'Menyusun rencana aksi kolektif berdasarkan hasil diskusi kelompok.'
    ],
    materiPokok: [
      'Materi disesuaikan dengan kondisi dan masalah aktual KPM.',
      'Dapat membahas isu sosial, ekonomi, kesehatan, pendidikan, keluarga, maupun kebencanaan.',
      'Fokus pada masalah nyata yang sedang dihadapi kelompok.'
    ],
    langkah: {
      pembukaan: {
        waktu: '10 menit',
        poin: [
          'Salam dan doa pembuka.',
          'Fasilitator menjelaskan bahwa sesi ini bersifat fleksibel dan disesuaikan kebutuhan kelompok saat ini.'
        ]
      },
      inti: {
        waktu: '45–60 menit',
        sub: [
          { judul: 'Curah Pendapat Masalah Aktual', waktu: '15 menit', poin: [
            'Fasilitator menggali isu yang sedang dihadapi kelompok saat ini (mis. gagal panen, wabah penyakit, kesulitan ekonomi musiman, dsb).'
          ]},
          { judul: 'Diskusi Kelompok Mencari Solusi', waktu: '15–20 menit', poin: [
            'Kelompok kecil membahas dan merumuskan solusi bersama atas isu yang terpilih.'
          ]},
          { judul: 'Studi Kasus Kontekstual', waktu: '10–15 menit', poin: [
            'Fasilitator membawakan 1 contoh kasus nyata sesuai kondisi wilayah untuk dibahas bersama.'
          ]},
          { judul: 'Refleksi Kelompok', waktu: '10 menit', poin: [
            'Tiap kelompok memaparkan hasil diskusi dan rencana aksi singkat.'
          ]}
        ]
      },
      penutup: {
        waktu: '10 menit',
        poin: [
          'Fasilitator merangkum hasil diskusi.',
          'Kesepakatan rencana aksi kolektif kelompok.',
          'Doa penutup.'
        ]
      }
    },
    evaluasi: [
      'Relevansi solusi yang dirumuskan dengan masalah aktual yang dihadapi.',
      'Komitmen rencana aksi kolektif yang disepakati kelompok.',
      'Dipantau tindak lanjutnya oleh pendamping pada pertemuan berikutnya.'
    ],
    rujukan: 'Peraturan Menteri Sosial Republik Indonesia Nomor 8 Tahun 2026.'
  },
  {
    judul: 'Materi Tambahan / Isu Relevan',
    identitas: {
      sasaran: 'KPM PKH (Keluarga Penerima Manfaat)',
      waktu: '65–100 menit (topik dan durasi fleksibel sesuai isu terkini)',
      metode: 'Penyuluhan tematik, nonton bersama, simulasi/praktik, tanya jawab',
      media: 'Proyektor/HP & speaker (bila tersedia), flipchart, materi tematik sesuai topik'
    },
    tujuanUmum: 'Peserta memperoleh edukasi tambahan sesuai kebutuhan masyarakat dan isu terkini di luar modul reguler.',
    tujuanKhusus: [
      'Memahami isu terkini yang relevan (kebijakan pemerintah, perlindungan sosial, pemberdayaan ekonomi, pencegahan kekerasan, literasi digital, dsb).',
      'Mempraktikkan keterampilan dasar terkait isu yang dibahas (mis. mengenali hoaks, keamanan digital dasar).',
      'Memanfaatkan informasi/layanan terkait isu yang dibahas untuk kepentingan keluarga.'
    ],
    materiPokok: [
      'Materi sesuai kebutuhan masyarakat dan kondisi terkini.',
      'Dapat berupa edukasi kebijakan pemerintah, perlindungan sosial, pemberdayaan ekonomi, pencegahan kekerasan, literasi digital, dan isu sosial lainnya.'
    ],
    langkah: {
      pembukaan: {
        waktu: '10 menit',
        poin: [
          'Salam dan doa pembuka.',
          'Fasilitator menyampaikan topik tematik hari ini sesuai kebutuhan/isu terkini.'
        ]
      },
      inti: {
        waktu: '45–70 menit',
        sub: [
          { judul: 'Penyuluhan Tematik', waktu: '20 menit', poin: [
            'Fasilitator atau narasumber menyampaikan materi sesuai isu terpilih.'
          ]},
          { judul: 'Nonton Bersama & Diskusi', waktu: '20 menit', poin: [
            'Menonton video edukasi singkat, dilanjutkan diskusi poin-poin pentingnya.'
          ]},
          { judul: 'Simulasi/Praktik Langsung', waktu: '15 menit', poin: [
            'Mis. praktik mengenali ciri berita hoaks, cara mengamankan akun digital, dsb. sesuai topik yang dibahas.'
          ]},
          { judul: 'Sesi Tanya Jawab', waktu: '10–15 menit', poin: [
            'Dengan narasumber/OPD terkait bila tersedia, atau fasilitator menjawab pertanyaan peserta.'
          ]}
        ]
      },
      penutup: {
        waktu: '10 menit',
        poin: [
          'Fasilitator merangkum poin-poin penting.',
          'Ajakan menerapkan hasil pembelajaran dalam kehidupan sehari-hari.',
          'Doa penutup.'
        ]
      }
    },
    evaluasi: [
      'Keaktifan peserta dalam sesi tanya jawab.',
      'Pemahaman peserta terhadap topik, dicek melalui pertanyaan lisan singkat.',
      'Rencana penerapan pribadi yang disampaikan peserta secara sukarela.'
    ],
    rujukan: 'Peraturan Menteri Sosial Republik Indonesia Nomor 8 Tahun 2026.'
  }
];


/* ---------------- State ---------------- */
let kpmData = loadJSON(LS_KEYS.data, []);
let settings = loadJSON(LS_KEYS.settings, { namaPendamping: '', nip: '', tandaTanganDataUrl: '', kelompokByDesa: {}, kecamatan: 'Gurah', kabupaten: 'Kediri', provinsi: 'Jawa Timur' });
if (!settings.kelompokByDesa) settings.kelompokByDesa = {};
if (settings.kecamatan === undefined) settings.kecamatan = 'Gurah';
if (settings.kabupaten === undefined) settings.kabupaten = 'Kediri';
if (settings.provinsi === undefined) settings.provinsi = 'Jawa Timur';
if (settings.geotagFormatWaktu === undefined) settings.geotagFormatWaktu = 'tanggal_jam'; // 'tanggal_jam' | 'tanggal'
let absensiStore = loadJSON(LS_KEYS.absensi, {}); // key -> [{noKK,nama,status}]
let materiExpanded = {}; // index -> bool (buka/tutup detail per modul)
let materiCardOpen = false; // buka/tutup seluruh kartu ringkasan materi (gulung)

let currentView = 'beranda';
let berandaDesaFilter = '';
let dataFilter = { desa: '', kelompok: '', search: '' };
let _kelompokMasterDesaSel = '';
let statusSearch = '';
let absensiSel = { modul: '1', sesi: '1', desa: '', kelompok: '', tanggal: todayISO() };
let absensiPdfMode = 'aplikasi'; // 'aplikasi' = isi status dari aplikasi, 'kosong' = kosongkan untuk tanda tangan manual
let verifKomponenSel = { desa: '', jenis: 'AUD', bulanMulai: new Date().getMonth() + 1, tahun: new Date().getFullYear() };

const RHK_LIST = [
  { id: '1', label: 'Penyaluran bansos KPM tepat sasaran & jumlah' },
  { id: '2', label: 'Pertemuan P2K2' },
  { id: '3', label: 'Verifikasi Komitmen Pendidikan/Kesehatan/Kesos' },
  { id: '4', label: 'Data KPM Graduasi' },
  { id: '5', label: 'Verifikasi, Validasi & Pemutakhiran Data KPM' },
  { id: '6', label: 'Respon kasus/pengaduan/kebencanaan/kerentanan' },
  { id: '7', label: 'Analisis Laporan Bulanan' },
  { id: '8', label: 'Direktif pimpinan (penugasan Kemensos)' },
  { id: '9', label: 'Penyebaran Berita Baik Kemensos' }
];
function rhkLabel(id) {
  const r = RHK_LIST.find(x => x.id === id);
  return r ? `RHK ${r.id} — ${r.label}` : `RHK ${id}`;
}
function jamToDecimal(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(':').map(Number);
  return h + m / 60;
}

const JENIS_KOMPONEN_EXPORT = {
  AUD: { label: 'BALITA', matchJenis: ['ANAK USIA DINI', 'AUD', 'BALITA'] },
  LANSIA: { label: 'LANSIA', matchJenis: ['LANSIA'] },
  DISABILITAS: { label: 'DISABILITAS', matchJenis: ['DISABILITAS'] }
};
const NAMA_BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

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

/* ============================================================
   KAMERA GEOTAG — ambil foto + watermark lokasi (mirip "GPS Map
   Camera"), dikompres otomatis supaya ukuran file < 500 KB.
   Foto tersimpan (opsional) di IndexedDB terpisah: kpm_geofoto_db.
   ============================================================ */
const GEOFOTO_MAX_BYTES = 500 * 1024; // 500 KB
const GEOFOTO_DB_NAME = 'kpm_geofoto_db';
const GEOFOTO_STORE = 'geofotos';
let _geoFotoDbPromise = null;

function openGeoFotoDB() {
  if (_geoFotoDbPromise) return _geoFotoDbPromise;
  _geoFotoDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(GEOFOTO_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(GEOFOTO_STORE)) {
        db.createObjectStore(GEOFOTO_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _geoFotoDbPromise;
}
async function saveGeoFoto(entry) {
  const db = await openGeoFotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GEOFOTO_STORE, 'readwrite');
    tx.objectStore(GEOFOTO_STORE).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function deleteGeoFoto(id) {
  const db = await openGeoFotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GEOFOTO_STORE, 'readwrite');
    tx.objectStore(GEOFOTO_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function getAllGeoFotos() {
  const db = await openGeoFotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GEOFOTO_STORE, 'readonly');
    const req = tx.objectStore(GEOFOTO_STORE).getAll();
    req.onsuccess = () => resolve((req.result || []).sort((a, b) => b.capturedAt - a.capturedAt));
    req.onerror = () => reject(req.error);
  });
}

let _cam = {
  stream: null,
  usingFallback: false,
  coords: null,        // {lat, lon, accuracy}
  address: null,        // hasil reverse geocode (object) atau null
  locateStatus: 'idle',  // idle | locating | ok | err
  resultBlob: null,
  resultURL: null,
  rawCanvas: null,      // foto mentah (sudah dikoreksi rotasi kamera) sebelum watermark dibakar, dipakai utk "Putar Foto"
  manualRotation: 0,    // rotasi tambahan manual (0/90/180/270) dari tombol "Putar Foto"
  capturedAt: null,     // Date saat jepret, supaya watermark & info waktu konsisten walau dirotasi ulang belakangan
  galleryCache: null
};

/** Deteksi orientasi layar HP saat ini. Dipakai supaya foto & watermark tetap
 * tegak walau HP dipegang miring/landscape saat memotret. */
function getOrientationInfo() {
  if (screen.orientation && screen.orientation.type) {
    return { type: screen.orientation.type, angle: screen.orientation.angle || 0 };
  }
  if (typeof window.orientation === 'number') {
    const a = ((window.orientation % 360) + 360) % 360;
    const type = a === 90 ? 'landscape-primary' : a === 270 ? 'landscape-secondary' : a === 180 ? 'portrait-secondary' : 'portrait-primary';
    return { type, angle: a };
  }
  return { type: 'portrait-primary', angle: 0 };
}

/** Derajat rotasi (radian, konvensi ctx.rotate — positif = searah jarum jam)
 * yang perlu diterapkan pada frame kamera mentah supaya hasil foto tegak,
 * berdasarkan orientasi HP saat tombol jepret ditekan. */
function getCaptureRotationRad() {
  const { type } = getOrientationInfo();
  if (type === 'landscape-primary') return -Math.PI / 2;
  if (type === 'landscape-secondary') return Math.PI / 2;
  if (type === 'portrait-secondary') return Math.PI;
  return 0;
}

function fmtWaktuGeotag(d, mode) {
  mode = mode || settings.geotagFormatWaktu || 'tanggal_jam';
  const hari2 = String(d.getDate()).padStart(2, '0');
  const bln2 = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()];
  const tanggalStr = `${hari2} ${bln2} ${d.getFullYear()}`;
  if (mode === 'tanggal') return tanggalStr;
  const jam2 = String(d.getHours()).padStart(2, '0');
  const mnt2 = String(d.getMinutes()).padStart(2, '0');
  return `${tanggalStr}, ${jam2}:${mnt2}`;
}
function fmtUkuranFile(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

/** Susun baris alamat dari hasil Nominatim reverse-geocode (best-effort,
 * penamaan wilayah OSM tidak selalu konsisten per daerah). */
function buildAlamatLines(nominatim) {
  if (!nominatim || !nominatim.address) return null;
  const a = nominatim.address;
  const jalan = a.road || a.pedestrian || a.residential || a.hamlet || a.neighbourhood || '';
  const desa = a.village || a.suburb || '';
  const kec = a.city_district || a.suburb || a.county || '';
  const kab = a.county || a.city || a.regency || a.municipality || '';
  const prov = a.state || '';

  const lines = [];
  const baris1 = [jalan, (desa && desa !== kec) ? desa : ''].filter(Boolean).join(', ');
  if (baris1) lines.push(baris1);
  if (kec) lines.push(kec.toLowerCase().startsWith('kec') ? kec : `Kecamatan ${kec}`);
  if (kab && kab !== kec) lines.push(kab.toLowerCase().startsWith('kab') || kab.toLowerCase().startsWith('kota') ? kab : `Kabupaten ${kab}`);
  if (prov) lines.push(prov);

  if (lines.length === 0 && nominatim.display_name) {
    // fallback: pakai display_name, potong maksimal 4 bagian pertama
    return nominatim.display_name.split(',').slice(0, 4).map(s => s.trim());
  }
  return lines;
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('geocode gagal');
    return await res.json();
  } catch (e) {
    return null;
  }
}

function requestLocation() {
  _cam.locateStatus = 'locating';
  _cam.coords = null;
  _cam.address = null;
  updateCamStatusChip();
  if (!('geolocation' in navigator)) {
    _cam.locateStatus = 'err';
    updateCamStatusChip();
    return;
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    _cam.coords = { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy };
    const geo = await reverseGeocode(_cam.coords.lat, _cam.coords.lon);
    _cam.address = buildAlamatLines(geo);
    _cam.locateStatus = 'ok';
    updateCamStatusChip();
  }, () => {
    _cam.locateStatus = 'err';
    updateCamStatusChip();
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
}

function updateCamStatusChip() {
  const el = document.getElementById('cam-status-chip');
  if (el) {
    if (_cam.locateStatus === 'locating') {
      el.className = 'cam-chip locating';
      el.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg> Mencari lokasi…`;
    } else if (_cam.locateStatus === 'ok') {
      el.className = 'cam-chip ok';
      el.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 22s7-5.3 7-11a7 7 0 10-14 0c0 5.7 7 11 7 11z"/></svg> Lokasi didapat`;
    } else {
      el.className = 'cam-chip err';
      el.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 22s7-5.3 7-11a7 7 0 10-14 0c0 5.7 7 11 7 11z"/></svg> Lokasi tidak tersedia`;
    }
  }
  updateCamLiveWatermark();
}

/** Susun teks watermark (alamat/koordinat/waktu) — dipakai baik untuk preview
 * langsung di layar kamera (live) maupun untuk digambar ke foto hasil jepretan. */
function buildWatermarkLines() {
  const lines = [];
  if (_cam.address && _cam.address.length) lines.push(..._cam.address);
  else if (_cam.coords) lines.push('Alamat tidak terdeteksi');
  if (_cam.coords) lines.push(`${_cam.coords.lat.toFixed(6)}, ${_cam.coords.lon.toFixed(6)}`);
  lines.push(fmtWaktuGeotag(new Date()));
  return lines;
}

function updateCamLiveWatermark() {
  const el = document.getElementById('cam-live-watermark');
  if (!el) return;
  const lines = buildWatermarkLines();
  el.innerHTML = lines.map((ln, i) => `<span>${i === 0 ? '📍 ' : ''}${esc(ln)}</span>`).join('');
}

let _camWatermarkTimer = null;
function startCamWatermarkTimer() {
  stopCamWatermarkTimer();
  _camWatermarkTimer = setInterval(updateCamLiveWatermark, 15000);
}
function stopCamWatermarkTimer() {
  if (_camWatermarkTimer) { clearInterval(_camWatermarkTimer); _camWatermarkTimer = null; }
}

/** Tambah/lepas kelas orientasi pada overlay fullscreen supaya preview video
 * ikut diputar mengikuti posisi HP (agar tampilan live cocok dengan hasil foto). */
function updateCamOrientationClass() {
  const overlay = document.getElementById('cam-fullscreen');
  if (!overlay) return;
  overlay.classList.remove('orient-landscape-primary', 'orient-landscape-secondary', 'orient-portrait-secondary');
  const { type } = getOrientationInfo();
  if (type === 'landscape-primary') overlay.classList.add('orient-landscape-primary');
  else if (type === 'landscape-secondary') overlay.classList.add('orient-landscape-secondary');
  else if (type === 'portrait-secondary') overlay.classList.add('orient-portrait-secondary');
}
function handleCamOrientationChange() {
  if (!document.body.classList.contains('cam-fs-active')) return;
  updateCamOrientationClass();
}
window.addEventListener('orientationchange', handleCamOrientationChange);
window.addEventListener('resize', handleCamOrientationChange);
if (screen.orientation && screen.orientation.addEventListener) {
  screen.orientation.addEventListener('change', handleCamOrientationChange);
}

async function startCameraStream() {
  const video = document.getElementById('cam-video');
  if (!video) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false
    });
    _cam.stream = stream;
    _cam.usingFallback = false;
    video.srcObject = stream;
    await video.play().catch(() => {});
  } catch (e) {
    _cam.usingFallback = true;
    render();
  }
}
function stopCameraStream() {
  if (_cam.stream) {
    _cam.stream.getTracks().forEach(t => t.stop());
    _cam.stream = null;
  }
}

document.addEventListener('visibilitychange', () => {
  if (currentView !== 'kamera') return;
  if (document.hidden) stopCameraStream();
  else if (!_cam.usingFallback && !_cam.resultBlob) startCameraStream();
});

/** Gambar overlay geotag (alamat + koordinat + waktu) di atas canvas foto.
 * capturedAt dikunci dari saat jepret, supaya kalau foto diputar ulang lewat
 * tombol "Putar Foto" nanti, waktunya tidak berubah jadi waktu sekarang. */
async function drawGeotagOverlay(canvas, capturedAt) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  try { await document.fonts.ready; } catch (e) {}

  const lines = [];
  if (_cam.address && _cam.address.length) lines.push(..._cam.address);
  else if (_cam.coords) lines.push('Alamat tidak terdeteksi');
  if (_cam.coords) {
    lines.push(`${_cam.coords.lat.toFixed(6)}, ${_cam.coords.lon.toFixed(6)}`);
  }
  lines.push(fmtWaktuGeotag(capturedAt || new Date()));

  const fontSize = Math.max(15, Math.round(w / 34));
  const lineHeight = Math.round(fontSize * 1.35);
  const padX = Math.round(w * 0.035);
  const padY = Math.round(w * 0.03);

  ctx.font = `700 ${fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';

  let maxTextW = 0;
  lines.forEach((ln, i) => {
    const text = i === 0 ? `📍 ${ln}` : ln;
    maxTextW = Math.max(maxTextW, ctx.measureText(text).width);
  });

  const blockH = lines.length * lineHeight + padY;
  const gradTop = h - blockH - padY * 0.6;
  const grad = ctx.createLinearGradient(0, gradTop, 0, h);
  grad.addColorStop(0, 'rgba(11,15,20,0)');
  grad.addColorStop(1, 'rgba(11,15,20,0.62)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, gradTop, w, h - gradTop);

  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = Math.max(2, fontSize * 0.12);
  ctx.fillStyle = '#ffffff';

  let y = h - padY - (lines.length - 1) * lineHeight;
  lines.forEach((ln, i) => {
    const text = i === 0 ? `📍 ${ln}` : ln;
    ctx.font = i === lines.length - 1
      ? `600 ${Math.round(fontSize * 0.85)}px Inter, Arial, sans-serif`
      : `700 ${fontSize}px Inter, Arial, sans-serif`;
    ctx.fillText(text, w - padX, y);
    y += lineHeight;
  });
  ctx.shadowBlur = 0;
}

/** Kompres canvas jadi JPEG di bawah GEOFOTO_MAX_BYTES (turunkan kualitas,
 * lalu perkecil dimensi kalau kualitas minimum masih kebesaran). */
async function canvasToBlobUnderLimit(canvas, maxBytes = GEOFOTO_MAX_BYTES) {
  let cnv = canvas, quality = 0.92, lastBlob = null;
  for (let attempt = 0; attempt < 16; attempt++) {
    lastBlob = await new Promise(res => cnv.toBlob(res, 'image/jpeg', quality));
    if (!lastBlob) break;
    if (lastBlob.size <= maxBytes) return lastBlob;
    if (quality > 0.45) {
      quality -= 0.08;
    } else {
      const nw = Math.round(cnv.width * 0.85), nh = Math.round(cnv.height * 0.85);
      if (nw < 360 || nh < 360) break;
      const c2 = document.createElement('canvas');
      c2.width = nw; c2.height = nh;
      c2.getContext('2d').drawImage(cnv, 0, 0, nw, nh);
      cnv = c2; quality = 0.82;
    }
  }
  return lastBlob;
}

/** Putar canvas `src` sejumlah `deg` (0/90/180/270) derajat searah jarum jam,
 * mengembalikan canvas baru (dimensi ditukar untuk 90/270). */
function rotateCanvas(src, deg) {
  const rot = ((deg % 360) + 360) % 360;
  if (rot === 0) {
    const c = document.createElement('canvas');
    c.width = src.width; c.height = src.height;
    c.getContext('2d').drawImage(src, 0, 0);
    return c;
  }
  const swap = rot === 90 || rot === 270;
  const c = document.createElement('canvas');
  c.width = swap ? src.height : src.width;
  c.height = swap ? src.width : src.height;
  const ctx = c.getContext('2d');
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate(rot * Math.PI / 180);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return c;
}

/** Susun ulang hasil foto dari canvas mentah (_cam.rawCanvas): terapkan rotasi
 * manual (kalau ada, dari tombol "Putar Foto"), lalu gambar ulang watermark
 * dari awal supaya tulisannya selalu tegak & waktu tetap konsisten. */
async function finalizeResultFromRaw() {
  if (!_cam.rawCanvas) return;
  const canvas = rotateCanvas(_cam.rawCanvas, _cam.manualRotation || 0);
  await drawGeotagOverlay(canvas, _cam.capturedAt);
  const blob = await canvasToBlobUnderLimit(canvas);
  if (_cam.resultURL) URL.revokeObjectURL(_cam.resultURL);
  _cam.resultBlob = blob;
  _cam.resultURL = URL.createObjectURL(blob);
  render();
}

function rotateResultPhoto() {
  _cam.manualRotation = ((_cam.manualRotation || 0) + 90) % 360;
  finalizeResultFromRaw();
}

async function processCapturedCanvas(canvas) {
  _cam.rawCanvas = canvas;
  _cam.manualRotation = 0;
  _cam.capturedAt = new Date();
  stopCameraStream();
  await finalizeResultFromRaw();
}

function capturePhotoFromVideo() {
  const video = document.getElementById('cam-video');
  if (!video || !video.videoWidth) { toast('Kamera belum siap'); return; }
  const vw = video.videoWidth, vh = video.videoHeight;
  // Koreksi rotasi berdasarkan orientasi HP saat ini, supaya isi foto tegak
  // walau HP dipegang landscape/miring saat menjepret (lihat getCaptureRotationRad).
  const rot = getCaptureRotationRad();
  const swap = rot === Math.PI / 2 || rot === -Math.PI / 2;
  const canvas = document.createElement('canvas');
  canvas.width = swap ? vh : vw;
  canvas.height = swap ? vw : vh;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rot);
  ctx.drawImage(video, -vw / 2, -vh / 2, vw, vh);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  processCapturedCanvas(canvas);
}

function capturePhotoFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1600;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) { height = Math.round(height * maxDim / width); width = maxDim; }
        else { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      processCapturedCanvas(canvas);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function retakePhoto() {
  if (_cam.resultURL) URL.revokeObjectURL(_cam.resultURL);
  _cam.resultBlob = null;
  _cam.resultURL = null;
  _cam.rawCanvas = null;
  _cam.manualRotation = 0;
  _cam.capturedAt = null;
  _cam.locateStatus = 'idle'; // paksa bindKameraView minta ulang lokasi terbaru
  render();
}

function downloadGeoFotoBlob(blob) {
  const a = document.createElement('a');
  const namaFile = `Geotag_${todayISO()}_${Date.now()}.jpg`;
  a.href = URL.createObjectURL(blob);
  a.download = namaFile;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

async function saveResultToGallery() {
  if (!_cam.resultBlob) return;
  const entry = {
    id: uid(),
    blob: _cam.resultBlob,
    size: _cam.resultBlob.size,
    lat: _cam.coords ? _cam.coords.lat : null,
    lon: _cam.coords ? _cam.coords.lon : null,
    alamat: _cam.address ? _cam.address.join(', ') : '',
    capturedAt: Date.now()
  };
  await saveGeoFoto(entry);
  toast('Foto disimpan ke galeri');
  _cam.galleryCache = null;
  render();
}

async function refreshCamGallery() {
  const wrap = document.getElementById('cam-gallery-wrap');
  if (!wrap) return;
  const list = await getAllGeoFotos();
  _cam.galleryCache = list;
  wrap.innerHTML = renderCamGalleryHTML(list);
  bindCamGalleryEvents();
}

function renderCamGalleryHTML(list) {
  if (!list || list.length === 0) {
    return `<div class="hint" style="margin-top:10px">Belum ada foto tersimpan di galeri.</div>`;
  }
  return `<div class="cam-gallery">${list.map(item => `
    <div class="cam-gallery-item" data-cam-view="${item.id}">
      <img src="${URL.createObjectURL(item.blob)}" alt="">
      <span class="cam-gallery-size">${fmtUkuranFile(item.size)}</span>
      <button class="cam-gallery-del" data-cam-del="${item.id}" aria-label="Hapus"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>`).join('')}</div>`;
}

function bindCamGalleryEvents() {
  document.querySelectorAll('[data-cam-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-cam-del]')) return;
      const item = (_cam.galleryCache || []).find(x => x.id === el.dataset.camView);
      if (!item) return;
      openModal(`
        <div class="modal-head"><h3>Foto Geotag</h3><button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
        <div class="cam-view-large"><img src="${URL.createObjectURL(item.blob)}" alt=""></div>
        <div class="cam-info-card">
          <div class="cam-info-row"><b>Ukuran</b><span>${fmtUkuranFile(item.size)}</span></div>
          ${item.alamat ? `<div class="cam-info-row"><b>Alamat</b><span>${esc(item.alamat)}</span></div>` : ''}
          ${item.lat ? `<div class="cam-info-row"><b>Koordinat</b><span>${item.lat.toFixed(6)}, ${item.lon.toFixed(6)}</span></div>` : ''}
          <div class="cam-info-row"><b>Waktu</b><span>${fmtWaktuGeotag(new Date(item.capturedAt))}</span></div>
        </div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn secondary" id="cam-large-download">Unduh</button>
        </div>
      `);
      document.getElementById('cam-large-download').addEventListener('click', () => downloadGeoFotoBlob(item.blob));
    });
  });
  document.querySelectorAll('[data-cam-del]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.camDel;
      await deleteGeoFoto(id);
      toast('Foto dihapus');
      refreshCamGallery();
    });
  });
}

function renderKameraView() {
  if (_cam.resultBlob) {
    return `
    <div class="cam-wrap">
      <img class="cam-result" src="${_cam.resultURL}" alt="Hasil foto">
    </div>
    <div class="cam-info-card">
      <div class="cam-info-row"><b>Ukuran file</b>
        <span>${fmtUkuranFile(_cam.resultBlob.size)}
          <span class="cam-size-pill ${_cam.resultBlob.size <= GEOFOTO_MAX_BYTES ? 'ok' : 'warn'}">${_cam.resultBlob.size <= GEOFOTO_MAX_BYTES ? '≤ 500 KB' : '> 500 KB (foto sangat kompleks)'}</span>
        </span>
      </div>
      ${_cam.address && _cam.address.length ? `<div class="cam-info-row"><b>Alamat</b><span>${esc(_cam.address.join(', '))}</span></div>` : `<div class="cam-info-row"><b>Alamat</b><span>Tidak terdeteksi</span></div>`}
      ${_cam.coords ? `<div class="cam-info-row"><b>Koordinat</b><span>${_cam.coords.lat.toFixed(6)}, ${_cam.coords.lon.toFixed(6)}</span></div>` : ''}
      <div class="cam-info-row"><b>Waktu</b><span>${fmtWaktuGeotag(_cam.capturedAt || new Date())}</span></div>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn secondary" id="cam-retake">Ambil Ulang</button>
      <button class="btn gold" id="cam-download">Unduh Foto</button>
    </div>
    <button class="btn secondary" id="cam-rotate" style="margin-top:8px">↻ Putar Foto 90°</button>
    <div class="hint" style="text-align:center; margin-top:4px">Kalau foto/watermark masih miring, tekan ini sampai posisinya tegak.</div>
    <button class="btn" id="cam-save-gallery" style="margin-top:8px">Simpan ke Galeri</button>

    <div class="section-title">Galeri Foto Geotag</div>
    <div id="cam-gallery-wrap"><div class="hint">Memuat galeri…</div></div>
    `;
  }

  if (_cam.usingFallback) {
    return `
    <div class="cam-wrap">
      <div class="cam-fallback">
        <svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2.2A2 2 0 0110.2 5h3.6a2 2 0 011.7.8L17 8h3a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0120 20H4a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 014 8z"/><circle cx="12" cy="13.5" r="3.6"/></svg>
        <p>Kamera langsung tidak tersedia di browser ini (izin ditolak atau tidak didukung). Gunakan kamera bawaan HP.</p>
        <button class="btn gold" id="cam-fallback-btn" type="button">Buka Kamera HP</button>
        <input type="file" id="cam-fallback-input" accept="image/*" capture="environment" style="display:none">
      </div>
    </div>
    <div class="hint" style="text-align:center; margin-top:10px">Foto akan otomatis diberi watermark lokasi &amp; dikompres di bawah 500 KB.</div>

    <div class="section-title">Galeri Foto Geotag</div>
    <div id="cam-gallery-wrap"><div class="hint">Memuat galeri…</div></div>
    `;
  }

  // Kamera langsung dibuka di layar penuh (di luar frame aplikasi), lihat openCameraFullscreen().
  return `
  <div class="hint" style="text-align:center; margin:26px 0 10px">Kamera dibuka di layar penuh…</div>

  <div class="section-title">Galeri Foto Geotag</div>
  <div id="cam-gallery-wrap"><div class="hint">Memuat galeri…</div></div>
  `;
}

/** Render markup video kamera langsung (dipasang ke dalam overlay fullscreen, bukan ke #main,
 * supaya tampilan kamera mengisi seluruh layar dan menyesuaikan saat HP dirotasi). */
function renderCamFullscreenHTML() {
  return `
    <button class="cam-fs-close" id="cam-fs-close" type="button" aria-label="Tutup kamera">
      <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <video id="cam-video" playsinline muted autoplay></video>
    <div class="cam-status"><span id="cam-status-chip" class="cam-chip locating">Mencari lokasi…</span></div>
    <div class="cam-live-watermark" id="cam-live-watermark"></div>
    <div class="cam-shutter-bar">
      <button class="cam-shutter" id="cam-shutter-btn" type="button" aria-label="Ambil foto">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
      </button>
    </div>
  `;
}

function openCameraFullscreen() {
  const overlay = document.getElementById('cam-fullscreen');
  const inner = document.getElementById('cam-fs-inner');
  if (!overlay || !inner) return;
  inner.innerHTML = renderCamFullscreenHTML();
  overlay.classList.add('open');
  document.body.classList.add('cam-fs-active');
  updateCamOrientationClass();
  document.getElementById('cam-fs-close').addEventListener('click', () => setView('beranda'));
  document.getElementById('cam-shutter-btn').addEventListener('click', capturePhotoFromVideo);
  updateCamStatusChip();
  startCamWatermarkTimer();
  startCameraStream();
  if (_cam.locateStatus === 'idle') requestLocation();
}

function closeCameraFullscreen() {
  const overlay = document.getElementById('cam-fullscreen');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('cam-fs-active');
  stopCamWatermarkTimer();
}

function bindKameraView() {
  updateCamStatusChip();
  if (_cam.resultBlob) {
    closeCameraFullscreen();
    document.getElementById('cam-retake').addEventListener('click', retakePhoto);
    document.getElementById('cam-download').addEventListener('click', () => downloadGeoFotoBlob(_cam.resultBlob));
    document.getElementById('cam-rotate').addEventListener('click', rotateResultPhoto);
    document.getElementById('cam-save-gallery').addEventListener('click', saveResultToGallery);
  } else if (_cam.usingFallback) {
    closeCameraFullscreen();
    const inp = document.getElementById('cam-fallback-input');
    document.getElementById('cam-fallback-btn').addEventListener('click', () => inp.click());
    inp.addEventListener('change', () => {
      if (inp.files && inp.files[0]) capturePhotoFromFile(inp.files[0]);
    });
  } else {
    openCameraFullscreen();
  }
  refreshCamGallery();
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
function shiftISODate(iso, delta) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}
function fmtTanggalHari(iso) {
  const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const d = new Date(iso + 'T00:00:00');
  return `${hari[d.getDay()]}, ${fmtTanggalPanjang(iso)}`;
}
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
  kamera: ['Dokumentasi', 'Kamera', 'Foto lapangan dengan watermark lokasi'],
  pengaturan: ['Akun', 'Pengaturan', 'Profil, data, & pemutakhiran']
};

function setView(view, push = true) {
  const prevView = currentView;
  if (prevView === 'kamera' && view !== 'kamera') {
    stopCameraStream();
    closeCameraFullscreen();
    if (_cam.resultURL) { URL.revokeObjectURL(_cam.resultURL); }
    _cam.resultBlob = null;
    _cam.resultURL = null;
    _cam.locateStatus = 'idle';
  }
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
  else if (currentView === 'kamera') { main.innerHTML = renderKameraView(); bindKameraView(); }
  else if (currentView === 'pengaturan') { main.innerHTML = renderPengaturanView(); bindPengaturanView(); }
}

/* ============================================================
   RINGKASAN MATERI P2K2
   ============================================================ */
const JUDUL_PDF_MATERI = 'RINGKASAN MATERI P2K2 MENURUT PERMENSOS NO 8 TAHUN 2026';

function renderMateriCard() {
  return `
  <div class="section-title" data-act="toggle-materi-card" style="display:flex; align-items:center; justify-content:space-between; cursor:pointer">
    <span>Ringkasan Materi P2K2</span>
    <svg viewBox="0 0 24 24" width="18" height="18" style="stroke:var(--ink-400); fill:none; stroke-width:2; transform:rotate(${materiCardOpen ? '180deg' : '0deg'}); transition:transform .15s"><path d="M6 9l6 6 6-6"/></svg>
  </div>
  ${!materiCardOpen ? `<div class="hint" style="margin:-4px 2px 4px">Tap untuk membuka ${RINGKASAN_MATERI.length} modul materi P2K2.</div>` : `
  <div class="card" style="padding:6px 12px">
    ${RINGKASAN_MATERI.map((m, i) => {
      const open = !!materiExpanded[i];
      const label = (t) => `<div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:var(--navy-800); margin:10px 0 4px">${t}</div>`;
      const ul = (items) => `<ul style="margin:0 0 4px; padding-left:20px">${items.map(p => `<li style="font-size:12.5px; color:var(--ink-600); line-height:1.5; margin-bottom:3px">${esc(p)}</li>`).join('')}</ul>`;
      return `
      <div style="border-bottom:${i < RINGKASAN_MATERI.length - 1 ? '1px solid var(--line)' : 'none'}; padding:9px 0">
        <div class="row" data-act="toggle-materi" data-idx="${i}" style="cursor:pointer; align-items:center">
          <div class="k">
            <div style="font-weight:800; font-size:14px; font-family:'Poppins',sans-serif; color:var(--navy-800); line-height:1.35">${i + 1}. ${esc(m.judul)}</div>
          </div>
          <div class="v">
            <svg viewBox="0 0 24 24" width="18" height="18" style="stroke:var(--ink-400); fill:none; stroke-width:2; transform:rotate(${open ? '180deg' : '0deg'}); transition:transform .15s"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        ${open ? `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 10px; font-size:11px; color:var(--ink-400); margin:6px 0 4px">
          <div><strong style="color:var(--ink-600)">Waktu:</strong> ${esc(m.identitas.waktu)}</div>
          <div><strong style="color:var(--ink-600)">Sasaran:</strong> ${esc(m.identitas.sasaran)}</div>
          <div style="grid-column:1/-1"><strong style="color:var(--ink-600)">Metode:</strong> ${esc(m.identitas.metode)}</div>
          <div style="grid-column:1/-1"><strong style="color:var(--ink-600)">Media:</strong> ${esc(m.identitas.media)}</div>
        </div>

        ${label('Tujuan Umum')}
        <div style="font-size:12.5px; color:var(--ink-600); font-style:italic; line-height:1.5">${esc(m.tujuanUmum)}</div>

        ${label('Tujuan Khusus')}
        ${ul(m.tujuanKhusus)}

        ${label('Materi Pokok')}
        ${ul(m.materiPokok)}

        ${label('Langkah Kegiatan — Pembukaan (' + esc(m.langkah.pembukaan.waktu) + ')')}
        ${ul(m.langkah.pembukaan.poin)}

        ${label('Langkah Kegiatan — Inti (' + esc(m.langkah.inti.waktu) + ')')}
        ${m.langkah.inti.sub.map(s => `
          <div style="font-size:12px; font-weight:700; color:var(--navy-800); margin:6px 0 2px">${esc(s.judul)} <span style="font-weight:500; color:var(--ink-400)">(${esc(s.waktu)})</span></div>
          ${ul(s.poin)}
        `).join('')}

        ${label('Langkah Kegiatan — Penutup (' + esc(m.langkah.penutup.waktu) + ')')}
        ${ul(m.langkah.penutup.poin)}

        ${label('Evaluasi / Penilaian')}
        ${ul(m.evaluasi)}

        <div style="font-size:10.5px; color:var(--ink-400); margin-top:6px">Rujukan: ${esc(m.rujukan)}</div>

        <div style="display:flex; gap:8px; margin-top:10px">
          <button class="btn ghost" type="button" data-act="export-materi" data-idx="${i}" style="font-size:12px; padding:7px 12px">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 11h3"/></svg>
            Export PDF
          </button>
          <button class="btn ghost" type="button" data-act="share-materi" data-idx="${i}" style="font-size:12px; padding:7px 12px; width:auto">
            <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-3.9M8.6 13.5l6.8 3.9"/></svg>
          </button>
        </div>` : ''}
      </div>`;
    }).join('')}
  </div>`}
  `;
}

function bindMateriCard() {
  document.querySelector('[data-act="toggle-materi-card"]')?.addEventListener('click', () => {
    materiCardOpen = !materiCardOpen;
    render();
  });
  document.querySelectorAll('[data-act="toggle-materi"]').forEach(row => {
    row.addEventListener('click', () => {
      const idx = row.dataset.idx;
      materiExpanded[idx] = !materiExpanded[idx];
      render();
    });
  });
  document.querySelectorAll('[data-act="export-materi"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      exportRingkasanMateriPDF(Number(btn.dataset.idx));
    });
  });
  document.querySelectorAll('[data-act="share-materi"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      shareRingkasanMateriPDF(Number(btn.dataset.idx));
    });
  });
}

function buildRingkasanMateriDoc(idx) {
  const m = RINGKASAN_MATERI[idx];
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const marginBottom = 18;
  const lineH = 5;
  const bulletIndent = 6;
  const textW = pageW - marginX * 2 - bulletIndent;
  let y = 0;

  const ensureSpace = (needed) => {
    if (y + needed > pageH - marginBottom) {
      doc.addPage();
      y = 18;
    }
  };

  // Kop surat (hanya di halaman pertama)
  const logoH = 13;
  try { if (typeof LOGO_KEMENSOS !== 'undefined') { const w = logoH * LOGO_KEMENSOS_RATIO; doc.addImage(LOGO_KEMENSOS, 'JPEG', marginX, 8, w, logoH); } } catch (e) {}
  try { if (typeof LOGO_PKH !== 'undefined') { const w = logoH * LOGO_PKH_RATIO; doc.addImage(LOGO_PKH, 'JPEG', pageW - marginX - w, 8, w, logoH); } } catch (e) {}

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  const titleLines = doc.splitTextToSize(JUDUL_PDF_MATERI, pageW - marginX * 2 - 60);
  doc.text(titleLines, pageW / 2, 13, { align: 'center' });
  let cursorY = 13 + (titleLines.length - 1) * 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const lokasi = [settings.kecamatan, settings.kabupaten, settings.provinsi].filter(Boolean).join(', ');
  if (lokasi) { cursorY += 6; doc.text(lokasi, pageW / 2, cursorY, { align: 'center' }); }

  const headerBottomY = Math.max(cursorY + 4, 8 + logoH + 3);
  doc.setDrawColor(11, 93, 82);
  doc.setLineWidth(0.5);
  doc.line(marginX, headerBottomY, pageW - marginX, headerBottomY);
  y = headerBottomY + 8;

  // Judul modul
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  const modulLines = doc.splitTextToSize(`MODUL ${idx + 1}: ${m.judul.toUpperCase()}`, pageW - marginX * 2);
  ensureSpace(modulLines.length * lineH + 4);
  doc.setTextColor(11, 93, 82);
  doc.text(modulLines, marginX, y);
  doc.setTextColor(20, 20, 20);
  y += modulLines.length * lineH + 5;

  // A. Identitas Modul (tabel ringkas 2 kolom)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  ensureSpace(lineH + 2);
  doc.setTextColor(11, 93, 82);
  doc.text('A. IDENTITAS MODUL', marginX, y);
  doc.setTextColor(20, 20, 20);
  y += lineH + 1.5;

  const identRows = [
    ['Sasaran', m.identitas.sasaran],
    ['Alokasi Waktu', m.identitas.waktu],
    ['Metode', m.identitas.metode],
    ['Media/Alat Bantu', m.identitas.media]
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const labelW = 34;
  identRows.forEach(([label, val]) => {
    const valLines = doc.splitTextToSize(val, pageW - marginX * 2 - labelW);
    ensureSpace(valLines.length * lineH);
    doc.setFont('helvetica', 'bold');
    doc.text(label, marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(valLines, marginX + labelW, y);
    y += valLines.length * lineH;
  });
  y += 5;

  const renderHeading = (text) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    ensureSpace(lineH + 2);
    doc.setTextColor(11, 93, 82);
    doc.text(text, marginX, y);
    doc.setTextColor(20, 20, 20);
    y += lineH + 1.5;
  };

  const renderBulletList = (items, indentExtra) => {
    const ix = indentExtra || 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    items.forEach(p => {
      const pLines = doc.splitTextToSize(p, textW - ix);
      ensureSpace(pLines.length * lineH);
      doc.text('•', marginX + 1 + ix, y);
      doc.text(pLines, marginX + bulletIndent + ix, y);
      y += pLines.length * lineH;
    });
  };

  const renderNumberedList = (items) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    items.forEach((p, i) => {
      const pLines = doc.splitTextToSize(p, textW);
      ensureSpace(pLines.length * lineH);
      doc.text(`${i + 1}.`, marginX + 1, y);
      doc.text(pLines, marginX + bulletIndent, y);
      y += pLines.length * lineH;
    });
  };

  // B. Tujuan Pembelajaran
  renderHeading('B. TUJUAN PEMBELAJARAN');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  const tujuanUmumLines = doc.splitTextToSize('Tujuan Umum: ' + m.tujuanUmum, pageW - marginX * 2);
  ensureSpace(tujuanUmumLines.length * lineH + 3);
  doc.text(tujuanUmumLines, marginX, y);
  y += tujuanUmumLines.length * lineH + 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  ensureSpace(lineH);
  doc.text('Tujuan Khusus — setelah mengikuti sesi ini peserta mampu:', marginX, y);
  y += lineH + 1;
  renderNumberedList(m.tujuanKhusus);
  y += 5;

  // C. Materi Pokok
  renderHeading('C. MATERI POKOK');
  renderNumberedList(m.materiPokok);
  y += 5;

  // D. Langkah-Langkah Kegiatan
  renderHeading('D. LANGKAH-LANGKAH KEGIATAN');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  ensureSpace(lineH);
  doc.text(`1. Pembukaan (${m.langkah.pembukaan.waktu})`, marginX, y);
  y += lineH + 1;
  renderBulletList(m.langkah.pembukaan.poin);
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  ensureSpace(lineH);
  doc.text(`2. Kegiatan Inti (${m.langkah.inti.waktu})`, marginX, y);
  y += lineH + 1;
  m.langkah.inti.sub.forEach((s, i) => {
    const letter = String.fromCharCode(97 + i); // a, b, c...
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(10);
    const subLines = doc.splitTextToSize(`${letter}. ${s.judul} (${s.waktu})`, textW - 6);
    ensureSpace(subLines.length * lineH);
    doc.text(subLines, marginX + 6, y);
    y += subLines.length * lineH + 0.5;
    renderBulletList(s.poin, 6);
    y += 2.5;
  });
  y += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  ensureSpace(lineH);
  doc.text(`3. Penutup (${m.langkah.penutup.waktu})`, marginX, y);
  y += lineH + 1;
  renderBulletList(m.langkah.penutup.poin);
  y += 5;

  // E. Evaluasi
  renderHeading('E. EVALUASI / PENILAIAN');
  renderBulletList(m.evaluasi);
  y += 5;

  // F. Rujukan
  renderHeading('F. RUJUKAN');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const rujukanLines = doc.splitTextToSize(m.rujukan, pageW - marginX * 2);
  ensureSpace(rujukanLines.length * lineH);
  doc.text(rujukanLines, marginX, y);
  y += rujukanLines.length * lineH;

  const fname = `Ringkasan_Materi_P2K2_Modul${idx + 1}_${m.judul.replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 40)}.pdf`;
  return { doc, fname };
}

function exportRingkasanMateriPDF(idx) {
  const { doc, fname } = buildRingkasanMateriDoc(idx);
  doc.save(fname);
  toast('PDF ringkasan materi diunduh');
}

async function shareRingkasanMateriPDF(idx) {
  const { doc, fname } = buildRingkasanMateriDoc(idx);
  const blob = doc.output('blob');
  const file = new File([blob], fname, { type: 'application/pdf' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: fname, text: RINGKASAN_MATERI[idx].judul });
    } catch (e) {
      if (e.name !== 'AbortError') toast('Gagal membuka menu share');
    }
  } else {
    doc.save(fname);
    toast('Share tidak didukung di perangkat ini — PDF diunduh');
  }
}


/* ============================================================
   BERANDA (DASHBOARD)
   ============================================================ */
function renderBeranda() {
  const materiHtml = renderMateriCard();
  if (kpmData.length === 0) {
    return materiHtml + `
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
  ${materiHtml}

  <div class="stat-grid">
    <div class="stat-card">
      <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      <div class="stat-num">${total}</div>
      <div class="stat-label">Total KPM Dampingan</div>
    </div>
    <div class="stat-card gold">
      <svg viewBox="0 0 24 24"><path d="M12 21s7-5.3 7-11a7 7 0 10-14 0c0 5.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>
      <div class="stat-num">${desaList.length}</div>
      <div class="stat-label">Sebaran per Desa</div>
    </div>
  </div>

  <div class="section-title">Rincian per Desa</div>
  <div class="card" style="padding:10px 12px">
    <div style="display:flex; gap:8px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:2px">
      ${desaList.map(d => {
        const n = kpmData.filter(k => k.desa === d).length;
        return `<div style="flex-shrink:0; background:var(--navy-50); border-radius:10px; padding:6px 12px; text-align:center; min-width:60px">
          <div style="font-family:'Poppins',sans-serif; font-weight:800; font-size:14px; color:var(--navy-800)">${n}</div>
          <div style="font-size:9.5px; color:var(--ink-600); font-weight:600; white-space:nowrap">${esc(d)}</div>
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
  bindMateriCard();
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

function renderKomponenDetailRow(a) {
  return `
  <div class="row" data-komp-row="${esc(a._localId)}" style="border-bottom:1px solid var(--line); padding:8px 0">
    <div class="k">${esc(a.nama)}${a.nik ? `<br><span style="color:var(--ink-400);font-size:11px">${esc(a.nik)}</span>` : ''}</div>
    <div class="v" style="text-align:right; display:flex; align-items:center; gap:8px; justify-content:flex-end">
      <span>
        <span class="badge" style="background:var(--navy-100);color:var(--navy-800)">${esc(a.jenis || '-')}</span>
        ${a.status ? `<br><span style="color:var(--ink-400);font-size:11px">${esc(a.status)}</span>` : ''}
      </span>
      <button class="icon-btn-sm" type="button" data-act="del-komponen" data-localid="${esc(a._localId)}" title="Hapus anggota">
        <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
      </button>
    </div>
  </div>`;
}

function bindKomponenDetailEvents(k) {
  const listEl = document.getElementById('komponen-detail-list');
  const labelEl = document.getElementById('komponen-detail-summary');
  const refreshCount = () => {
    if (labelEl) labelEl.textContent = `Anggota Komponen${k.komponenDetail?.length ? ` (${k.komponenDetail.length})` : ''}`;
  };
  listEl?.querySelectorAll('[data-act="del-komponen"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lid = btn.dataset.localid;
      k.komponenDetail = (k.komponenDetail || []).filter(a => a._localId !== lid);
      document.querySelector(`[data-komp-row="${lid}"]`)?.remove();
      refreshCount();
      saveData();
      render();
    });
  });
  document.getElementById('btn-add-komponen')?.addEventListener('click', () => {
    const nama = document.getElementById('add-komp-nama').value.trim();
    const nik = document.getElementById('add-komp-nik').value.trim();
    const jenis = document.getElementById('add-komp-jenis').value.trim();
    const status = document.getElementById('add-komp-status').value.trim();
    if (!nama) { toast('Nama anggota tidak boleh kosong'); return; }
    if (!Array.isArray(k.komponenDetail)) k.komponenDetail = [];
    const entry = { _localId: uid(), nama, nik, jenis, status };
    k.komponenDetail.push(entry);
    listEl.insertAdjacentHTML('beforeend', renderKomponenDetailRow(entry));
    document.querySelector(`[data-komp-row="${entry._localId}"] [data-act="del-komponen"]`).addEventListener('click', function handler() {
      k.komponenDetail = (k.komponenDetail || []).filter(a => a._localId !== entry._localId);
      document.querySelector(`[data-komp-row="${entry._localId}"]`)?.remove();
      refreshCount();
      saveData();
      render();
    });
    document.getElementById('add-komp-nama').value = '';
    document.getElementById('add-komp-nik').value = '';
    document.getElementById('add-komp-jenis').value = '';
    document.getElementById('add-komp-status').value = '';
    refreshCount();
    saveData();
    render();
    toast('Anggota komponen ditambahkan');
  });
}

function openEditKpm(id) {
  openKpmForm(kpmData.find(x => x._id === id));
}

// k = null -> mode tambah KPM baru manual. k = objek -> mode edit KPM yang sudah ada.
function openKpmForm(k) {
  const isNew = !k;
  if (isNew) k = null; // hanya untuk kejelasan; nilai default diambil dari '' di bawah
  if (!isNew && Array.isArray(k.komponenDetail)) {
    k.komponenDetail.forEach(a => { if (!a._localId) a._localId = uid(); });
  }
  const kelompokList = getKelompokList(k ? k.desa : '');
  const komponenFields = KOMPONEN_FIELDS;
  openModal(`
    <div class="modal-head">
      <h3>${isNew ? 'Tambah KPM Manual' : 'Detail KPM'}</h3>
      <button class="modal-close" data-act="close-modal"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="field-row">
      <div class="field"><label>Nama</label><input type="text" id="edit-nama" value="${esc(k?.nama || '')}" placeholder="Nama KPM"></div>
      <div class="field">
        <label>Kelompok</label>
        <input type="text" list="kelompok-suggest" id="edit-kelompok" value="${esc(k?.kelompok || '')}" placeholder="Nama kelompok">
        <datalist id="kelompok-suggest">${kelompokList.map(kl => `<option value="${esc(kl)}">`).join('')}</datalist>
      </div>
    </div>
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
    ${!isNew ? `
    <div class="btn-row" style="margin-bottom:12px">
      <button class="btn ghost" id="copy-nokk" data-nokk="${esc(k.noKK)}">
        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Salin No KK
      </button>
      <button class="btn ghost" id="copy-nik" data-nik="${esc(k.nikPengurus || '')}">
        <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Salin NIK
      </button>
    </div>` : ''}
    ${!isNew ? `
    <details class="foto-details" style="margin-bottom:14px">
      <summary class="foto-summary">
        <span id="komponen-detail-summary">Anggota Komponen${k?.komponenDetail?.length ? ` (${k.komponenDetail.length})` : ''}</span>
        <svg class="chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
      </summary>
      <div class="foto-body">
        <div id="komponen-detail-list">
          ${(k.komponenDetail || []).map(a => renderKomponenDetailRow(a)).join('')}
        </div>
        <div class="card" style="background:var(--navy-50); padding:10px; margin-top:8px">
          <div class="field-row">
            <div class="field"><label>Nama Anggota</label><input type="text" id="add-komp-nama" placeholder="Nama anggota"></div>
            <div class="field"><label>NIK (opsional)</label><input type="text" id="add-komp-nik" placeholder="NIK"></div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Jenis Komponen</label>
              <input type="text" list="komponen-jenis-suggest" id="add-komp-jenis" placeholder="Contoh: SEKOLAH">
              <datalist id="komponen-jenis-suggest">
                <option value="ANAK USIA DINI"><option value="SEKOLAH"><option value="LANSIA"><option value="DISABILITAS"><option value="HAMIL">
              </datalist>
            </div>
            <div class="field"><label>Status (opsional)</label><input type="text" id="add-komp-status" placeholder="Status"></div>
          </div>
          <button class="btn secondary" type="button" id="btn-add-komponen" style="margin-top:2px">+ Tambah Anggota</button>
        </div>
      </div>
    </details>` : `<div class="hint">Anggota komponen bisa ditambahkan setelah data ini disimpan (buka lagi lewat Data KPM).</div>`}
    <div class="field-row-compact">
      <div class="field w-narrow"><label>RT</label><input type="text" id="edit-rt" value="${esc(k?.rt || '')}" placeholder="RT"></div>
      <div class="field w-narrow"><label>RW</label><input type="text" id="edit-rw" value="${esc(k?.rw || '')}" placeholder="RW"></div>
      <div class="field"><label>No Rekening</label><input type="text" id="edit-noRekening" value="${esc(k?.noRekening || '')}" placeholder="No. rekening"></div>
      <div class="field"><label>No Kartu</label><input type="text" id="edit-noKartu" value="${esc(k?.noKartu || '')}" placeholder="No. kartu"></div>
    </div>
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
    document.getElementById('copy-nik').addEventListener('click', () => {
      const nik = document.getElementById('edit-nik-pengurus').value.trim();
      if (!nik) { toast('NIK Pengurus masih kosong'); return; }
      copyToClipboard(nik, 'NIK Pengurus disalin');
    });
    bindKomponenDetailEvents(k);
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
      doc.addImage(LOGO_KEMENSOS, 'JPEG', marginX, 8, w, logoH);
    }
  } catch (e) {}
  try {
    if (typeof LOGO_PKH !== 'undefined') {
      const w = logoH * LOGO_PKH_RATIO;
      doc.addImage(LOGO_PKH, 'JPEG', pageW - marginX - w, 8, w, logoH);
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

function buildVerifikasiKomponenDoc(sel) {
  const cfg = JENIS_KOMPONEN_EXPORT[sel.jenis];
  const desaFilter = sel.desa;
  const kpmList = kpmData.filter(k => (!desaFilter || k.desa === desaFilter) && Array.isArray(k.komponenDetail) && k.komponenDetail.length);

  const rows = [];
  kpmList.forEach(k => {
    k.komponenDetail.forEach(a => {
      const jenisUp = String(a.jenis || '').toUpperCase();
      if (cfg.matchJenis.some(m => jenisUp.includes(m))) {
        rows.push({ pengurus: k.namaPengurus || k.nama, nama: a.nama, noKK: k.noKK, nik: a.nik || '-', alamat: k.alamat || '-', rt: k.rt || '-', rw: k.rw || '-' });
      }
    });
  });
  rows.sort((a, b) => a.pengurus.localeCompare(b.pengurus));

  const bulanIdx = [0, 1, 2].map(i => (sel.bulanMulai - 1 + i) % 12);
  const bulanLabels = bulanIdx.map(i => NAMA_BULAN[i]);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 12;

  const logoH = 15;
  try { if (typeof LOGO_PKH !== 'undefined') { const w = logoH * LOGO_PKH_RATIO; doc.addImage(LOGO_PKH, 'JPEG', marginX, 8, w, logoH); } } catch (e) {}
  try { if (typeof LOGO_KEMENSOS !== 'undefined') { const w = logoH * LOGO_KEMENSOS_RATIO; doc.addImage(LOGO_KEMENSOS, 'JPEG', pageW - marginX - w, 8, w, logoH); } } catch (e) {}

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('PROGRAM KELUARGA HARAPAN', pageW / 2, 12, { align: 'center' });
  doc.text(`KECAMATAN ${(settings.kecamatan || '').toUpperCase()}`, pageW / 2, 18, { align: 'center' });
  doc.text(`KABUPATEN ${(settings.kabupaten || '').toUpperCase()} - PROVINSI ${(settings.provinsi || '').toUpperCase()}`, pageW / 2, 24, { align: 'center' });

  doc.setFontSize(11.5);
  doc.text(`DAFTAR VERIFIKASI KOMITMEN ${cfg.label}`, pageW / 2, 33, { align: 'center' });
  const desaLabel = desaFilter ? `DESA ${desaFilter.toUpperCase()}` : 'SELURUH DESA DAMPINGAN';
  doc.text(`PENERIMA BANSOS PKH ${desaLabel} KECAMATAN ${(settings.kecamatan || '').toUpperCase()}`, pageW / 2, 39, { align: 'center' });

  const startY = 46;
  const body = rows.map((r, i) => [i + 1, r.pengurus, r.nama, r.noKK, r.nik, r.alamat, r.rt, r.rw, '', '', '']);

  doc.autoTable({
    startY,
    margin: { left: marginX, right: marginX },
    head: [['No', 'Nama Pengurus', `Nama ${cfg.label.charAt(0) + cfg.label.slice(1).toLowerCase()}`, 'No. KK', `NIK ${cfg.label.charAt(0) + cfg.label.slice(1).toLowerCase()}`, 'Alamat', 'RT', 'RW', ...bulanLabels]],
    body,
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2 },
    headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold', fontSize: 8.5, halign: 'center' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 38 },
      2: { cellWidth: 38 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 40 },
      6: { cellWidth: 9, halign: 'center' },
      7: { cellWidth: 9, halign: 'center' },
      8: { cellWidth: 14, halign: 'center' },
      9: { cellWidth: 14, halign: 'center' },
      10: { cellWidth: 14, halign: 'center' }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 12;
  const sigXKanan = pageW - marginX - 55;
  const sigXKiri = marginX + 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Kolom kiri: Mengetahui (Bidan / Kepala Puskesmas — nama diisi tangan)
  doc.text('Mengetahui,', sigXKiri, finalY);
  doc.text('_______________________', sigXKiri, finalY + 24);
  doc.text('(...........................)', sigXKiri, finalY + 29);

  // Kolom kanan: Pendamping Sosial
  doc.text('Pendamping Sosial', sigXKanan, finalY);
  doc.text('_______________________', sigXKanan, finalY + 24);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.namaPendamping || '(...........................)', sigXKanan, finalY + 29);
  doc.setFont('helvetica', 'normal');
  if (settings.nip) doc.text(`NIP. ${settings.nip}`, sigXKanan, finalY + 34);

  const fname = `Verifikasi_${cfg.label}_${desaFilter || 'SemuaDesa'}_${sel.tahun}.pdf`;
  return { doc, fname, jumlah: rows.length };
}

function buildVerifikasiKomponenRows(sel) {
  const cfg = JENIS_KOMPONEN_EXPORT[sel.jenis];
  const desaFilter = sel.desa;
  const kpmList = kpmData.filter(k => (!desaFilter || k.desa === desaFilter) && Array.isArray(k.komponenDetail) && k.komponenDetail.length);
  const rows = [];
  kpmList.forEach(k => {
    k.komponenDetail.forEach(a => {
      const jenisUp = String(a.jenis || '').toUpperCase();
      if (cfg.matchJenis.some(m => jenisUp.includes(m))) {
        rows.push({ pengurus: k.namaPengurus || k.nama, nama: a.nama, noKK: k.noKK, nik: a.nik || '-', alamat: k.alamat || '-', rt: k.rt || '-', rw: k.rw || '-' });
      }
    });
  });
  rows.sort((a, b) => a.pengurus.localeCompare(b.pengurus));
  return { cfg, rows };
}

function exportVerifikasiKomponenExcel() {
  const { cfg, rows } = buildVerifikasiKomponenRows(verifKomponenSel);
  if (!rows.length) { toast('Tidak ada data anggota komponen untuk kombinasi ini'); return; }
  const bulanIdx = [0, 1, 2].map(i => (verifKomponenSel.bulanMulai - 1 + i) % 12);
  const bulanLabels = bulanIdx.map(i => NAMA_BULAN[i]);
  const namaLabel = cfg.label.charAt(0) + cfg.label.slice(1).toLowerCase();
  const excelRows = rows.map((r, i) => ({
    'No': i + 1,
    'Nama Pengurus': r.pengurus,
    [`Nama ${namaLabel}`]: r.nama,
    'No. KK': r.noKK,
    [`NIK ${namaLabel}`]: r.nik,
    'Alamat': r.alamat,
    'RT': r.rt,
    'RW': r.rw,
    [bulanLabels[0]]: '',
    [bulanLabels[1]]: '',
    [bulanLabels[2]]: ''
  }));
  const ws = XLSX.utils.json_to_sheet(excelRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Verifikasi ${namaLabel}`);
  const fname = `Verifikasi_${cfg.label}_${verifKomponenSel.desa || 'SemuaDesa'}_${verifKomponenSel.tahun}.xlsx`;
  XLSX.writeFile(wb, fname);
  toast(`Excel diunduh — ${rows.length} anggota`);
}

function exportVerifikasiKomponenPDF() {
  const res = buildVerifikasiKomponenDoc(verifKomponenSel);
  if (!res.jumlah) { toast('Tidak ada data anggota komponen untuk kombinasi ini'); return; }
  res.doc.save(res.fname);
  toast(`PDF diunduh — ${res.jumlah} anggota`);
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
    <div class="field-row">
      <div class="field"><label>Kecamatan</label><input type="text" id="set-kecamatan" value="${esc(settings.kecamatan)}" placeholder="Contoh: Gurah"></div>
      <div class="field"><label>Kabupaten</label><input type="text" id="set-kabupaten" value="${esc(settings.kabupaten)}" placeholder="Contoh: Kediri"></div>
    </div>
    <div class="field"><label>Provinsi</label><input type="text" id="set-provinsi" value="${esc(settings.provinsi)}" placeholder="Contoh: Jawa Timur"></div>
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

  <div class="section-title">Kamera Geotag</div>
  <div class="card">
    <div class="field">
      <label>Info Waktu pada Watermark Foto</label>
      <select id="set-geotag-format">
        <option value="tanggal_jam" ${settings.geotagFormatWaktu !== 'tanggal' ? 'selected' : ''}>Tanggal &amp; Jam</option>
        <option value="tanggal" ${settings.geotagFormatWaktu === 'tanggal' ? 'selected' : ''}>Tanggal saja</option>
      </select>
    </div>
    <div class="hint">Mengatur info waktu yang ditampilkan pada watermark foto kamera geotag (berlaku untuk foto baru).</div>
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

  <div class="section-title">📋 Export Verifikasi Komponen</div>
  <div class="card" style="border:1.5px solid var(--navy-100)">
    <div class="hint" style="margin-bottom:10px">
      Cetak Daftar Verifikasi Komitmen (Balita/AUD, Lansia, atau Disabilitas) per desa, format siap tanda tangan basah. Data diambil dari "Anggota Komponen" yang sudah tersimpan di tiap KPM.
    </div>
    <div class="field-row">
      <div class="field">
        <label>Jenis Komponen</label>
        <select id="vk-jenis">
          <option value="AUD" ${verifKomponenSel.jenis === 'AUD' ? 'selected' : ''}>Balita / Anak Usia Dini</option>
          <option value="LANSIA" ${verifKomponenSel.jenis === 'LANSIA' ? 'selected' : ''}>Lansia</option>
          <option value="DISABILITAS" ${verifKomponenSel.jenis === 'DISABILITAS' ? 'selected' : ''}>Disabilitas</option>
        </select>
      </div>
      <div class="field">
        <label>Desa</label>
        <select id="vk-desa">
          <option value="">Semua Desa</option>
          ${getDesaList().map(d => `<option value="${esc(d)}" ${verifKomponenSel.desa === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Bulan Mulai (3 bulan berjalan)</label>
        <select id="vk-bulan">
          ${NAMA_BULAN.map((b, i) => `<option value="${i + 1}" ${verifKomponenSel.bulanMulai === i + 1 ? 'selected' : ''}>${b}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Tahun</label><input type="number" id="vk-tahun" value="${verifKomponenSel.tahun}"></div>
    </div>
    <button class="btn gold" id="btn-export-verifikasi">Export PDF</button>
    <button class="btn secondary" id="btn-export-verifikasi-excel" style="margin-top:8px">Export Excel (untuk koreksi manual)</button>
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
    settings.kecamatan = document.getElementById('set-kecamatan').value.trim();
    settings.kabupaten = document.getElementById('set-kabupaten').value.trim();
    settings.provinsi = document.getElementById('set-provinsi').value.trim();
    saveSettings();
    updateHeaderBadge();
    toast('Profil disimpan');
  });
  document.getElementById('set-geotag-format').addEventListener('change', (e) => {
    settings.geotagFormatWaktu = e.target.value;
    saveSettings();
    toast('Pengaturan watermark waktu disimpan');
  });
  document.getElementById('btn-import').addEventListener('click', () => document.getElementById('file-import').click());
  document.getElementById('file-import').addEventListener('change', handleImportExcel);
  document.getElementById('btn-import-gabungan').addEventListener('click', openImportGabunganModal);
  document.getElementById('btn-import-komponen').addEventListener('click', () => document.getElementById('file-import-komponen').click());
  document.getElementById('file-import-komponen').addEventListener('change', handleImportKomponen);

  document.getElementById('vk-jenis').addEventListener('change', (e) => { verifKomponenSel.jenis = e.target.value; });
  document.getElementById('vk-desa').addEventListener('change', (e) => { verifKomponenSel.desa = e.target.value; });
  document.getElementById('vk-bulan').addEventListener('change', (e) => { verifKomponenSel.bulanMulai = Number(e.target.value); });
  document.getElementById('vk-tahun').addEventListener('change', (e) => { verifKomponenSel.tahun = Number(e.target.value) || new Date().getFullYear(); });
  document.getElementById('btn-export-verifikasi').addEventListener('click', exportVerifikasiKomponenPDF);
  document.getElementById('btn-export-verifikasi-excel').addEventListener('click', exportVerifikasiKomponenExcel);
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
  const str = String(raw || '').trim();
  if (!str) return { nama: '', noKK: '' };
  // Format lama: nama di baris pertama, No KK di baris terakhir (dipisah Enter dalam satu sel)
  const parts = str.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    return { nama: parts[0], noKK: parts[parts.length - 1] };
  }
  // Format satu baris: "NAMA 16DIGITNOKK" dipisah spasi, contoh: "PANAJI 3506101906200001"
  const m = str.match(/^(.*\S)\s+(\d{16})\s*$/);
  if (m) {
    return { nama: m[1].trim(), noKK: m[2] };
  }
  return { nama: str, noKK: '' };
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
    'Catatan': k.catatanPengaduan || '',
    'Anggota Komponen': (k.komponenDetail || []).map(a => `${a.nama} (${a.jenis || '-'})`).join('; ')
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
