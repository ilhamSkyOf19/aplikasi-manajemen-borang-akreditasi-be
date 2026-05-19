import { IDosen } from "./dosen.model";

// status grafik kriteria
export type NamaPendekatanType =
  | "Penetapan"
  | "Pelaksanaan"
  | "Evaluasi"
  | "Pengendalian"
  | "Peningkatan";

export const namaPendekatanArray = [
  "Penetapan",
  "Pelaksanaan",
  "Evaluasi",
  "Pengendalian",
  "Peningkatan",
];

export interface PendekatanType {
  nama_pendekatan: NamaPendekatanType;
  dokumentasi_borang_total: number;
  dokumentasi_borang_approve: number;
  dokumentasi_pending?: number | null;
  dokumentasi_revisi?: number | null;
}

export interface GrafikKriteriaType {
  id_kriteria: number;
  kode_kriteria: number;
  nama_kriteria: string;
  dosen_pic: Omit<IDosen, "password" | "created_at" | "updated_at" | "roles">[];
  total_dokumentasi_in_kriteria: number;
  total_dokumentasi_selesai_in_kriteria: number;
  total_dokumentasi_belum_selesai_in_kriteria: number;
  pendekatan: PendekatanType[];
}

export interface ResponseStatistikType {
  total_dosen: number;
  total_kriteria: number | null;
  total_dokumentasi: number | null;
  total_dokumentasi_borang_selesai: number | null;
  total_dokumentasi_borang_belum_selesai: number | null;
  total_file_selesai: number | null;
  grafik_kriteria: GrafikKriteriaType[] | null;
}

// statis for tim akreditasi
export interface ResponseStatistikTimAkreditasiType extends GrafikKriteriaType {}
