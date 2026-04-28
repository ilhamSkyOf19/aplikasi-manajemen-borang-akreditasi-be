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
  PENDING = "PENDING",
  REVISION = "REVISION",
  APPROVED = "APPROVED",
}

// tipe dokumentasi
export enum TipeDokumentasi {
  DEFAULT = "DEFAULT",
  PENELITIAN = "PENELITIAN",
}

// jenis riwayat
export enum TipeRiwayat {
  DOKUMENTASI_BORANG = "DOKUMENTASI_BORANG",
  KEBUTUHAN_DOKUMENTASI = "KEBUTUHAN_DOKUMENTASI",
}

// flag revisi
// export enum FlagRevisi {
//   dokumen_borang = "dokumen_borang",
//   kebutuhan_dokumen = "kebutuhan_dokumen",
//   pic = "pic",
// }

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
export enum StorageProvider {
  GDRIVE = "GDRIVE",
  SISTEM = "SISTEM",
}

// role priority
export const rolePriority = [
  DosenRole.wakil_dekan_1,
  DosenRole.kaprodi,
  DosenRole.tim_akreditasi,
];

// sort type asc or desc
export type SortOrder = "asc" | "desc";

// folder global upload
export const FOLDER_GLOBAL_UPLOAD = "public/uploads/dokumentasi-borang";
