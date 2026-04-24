export enum DosenRole {
  wakil_dekan_1 = "wakil_dekan_1",
  kaprodi = "kaprodi",
  tim_akreditasi = "tim_akreditasi",
}

export interface MetaType {
  totalData: number;
  currentPage: number;
  totalPage: number;
  limit: number;
}

// enum status
export enum Status {
  menunggu = "menunggu",
  revisi = "revisi",
  disetujui = "disetujui",
}

// jenis riwayat
export enum JenisRiwayat {
  dokumen_borang = "dokumen_borang",
  pic = "pic",
}

// flag revisi
export enum FlagRevisi {
  dokumen_borang = "dokumen_borang",
  kebutuhan_dokumen = "kebutuhan_dokumen",
  pic = "pic",
}

// type notifikasi
export enum TypeNotifikasi {
  KRITERIA_DITAMBAH = "KRITERIA_DITAMBAH",
  KRITERIA_DIEDIT = "KRITERIA_DIEDIT",
  KRITERIA_DIHAPUS = "KRITERIA_DIHAPUS",

  PIC_BARU_PERLU_VERIFIKASI = "PIC_BARU_PERLU_VERIFIKASI",
  PIC_DIREVISI_KAPRODI = "PIC_DIREVISI_KAPRODI",

  PIC_DISETUJUI_WD1 = "PIC_DISETUJUI_WD1",
  PIC_DIREVISI_WD1 = "PIC_DIREVISI_WD1",
}

// lokasi file
export enum LokasiFile {
  GDRIVE = "GDRIVE",
  SISTEM = "SISTEM",
}

// role priority
export const rolePriority = [
  DosenRole.wakil_dekan_1,
  DosenRole.kaprodi,
  DosenRole.tim_akreditasi,
];
