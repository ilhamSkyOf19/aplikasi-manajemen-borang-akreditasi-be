import { LokasiFile, MetaType, Status } from "../utils/contstanst";
import { IKriteria } from "./kriteria.model";
import { IPendekatan } from "./pendekatan.model";
import { IPic } from "./pic.model";
import { PayloadUserType } from "./user.model";

export interface IDokumenBorang {
  id: number;
  filename: string;
  keterangan: string;
  lokasiFile: LokasiFile;
  status: Status;
  fileId?: string | null;
  uploadedBy: PayloadUserType;
  pic: Omit<IPic, "statusRiwayat" | "status" | "keterangan"> & {
    assignedBy: PayloadUserType;
  };
  createdAt: Date;
  updatedAt: Date;
}

// create dokumen borang
export type FileItem = {
  useOldFile: boolean;
  oldDokumenBorangId?: number;
  lokasiFile?: LokasiFile;
  filename?: string;
  keterangan?: string;
};

export type CreateDokumenBorangType = {
  uploadedBy: number;
  assignedBy: number;
  picId: number;
  files: FileItem[];
};

// response dokumen borang
export interface ResponseDokumenBorangType {
  assignedBy: Pick<PayloadUserType, "id" | "nama" | "email">;
  dokumen: Pick<
    IDokumenBorang,
    | "id"
    | "filename"
    | "keterangan"
    | "lokasiFile"
    | "createdAt"
    | "updatedAt"
    | "status"
    | "fileId"
  >;
  uploadedBy: Pick<PayloadUserType, "id" | "nama" | "email">;
}

// to response dokumen borang type
export const toResponseDokumenBorangType = (
  dokumenBorang: ResponseDokumenBorangType,
): ResponseDokumenBorangType => dokumenBorang;

// response dokumen borang by kebutuhan dokumen
export interface ResponseDaftarDokumenBorangByKebutuhanDokumenType {
  pic: {
    id?: number | null;
  };
  kebutuhanDokumen: {
    id: number;
    namaDokumen: string;
  };
  daftarDokumen: ResponseDokumenBorangType[];
}

// to response dokumen borang by kebutuhan dokumen
export const toResponseDaftarDokumenBorangByKebutuhanDokumenType = (
  daftarDokumen: ResponseDaftarDokumenBorangByKebutuhanDokumenType,
) => daftarDokumen;

// response create dokumen borang
export interface ResponseCreateDokumenBorangType {
  pic: {
    id: number;
  };
  kebutuhanDokumen: {
    id: number;
    namaDokumen: string;
    kriteria: Pick<IKriteria, "id" | "kriteria" | "namaKriteria">;
    pendekatan: Pick<IPendekatan, "id" | "tahap" | "keterangan">;
    dokumenBorang: ResponseDokumenBorangType[];
  };
}

// to response create
export const toResponseCreateDokumenBorangType = (
  dokumenBorang: ResponseCreateDokumenBorangType,
) => dokumenBorang;

// pic item
export interface PicItem {
  id: number;
  kebutuhanDokumen: {
    kriteria: {
      id: number;
      kriteria: number;
      namaKriteria: string;
    };
    pendekatan: {
      id: number;
      tahap: string;
      keterangan: string;
    };
  };
  picDokumen: {
    dokumenBorang: {
      status: Status;
    };
  }[];
}

// pendekatan group
export interface PendekatanGrouped {
  pendekatanId: number;
  tahap: string;
  keterangan: string;
}

// kriteria group
export interface KriteriaGrouped {
  kriteriaId: number;
  nomorKriteria: number;
  namaKriteria: string;
  pendekatan: Record<number, PendekatanGrouped>;
  dokumenBorangStatus: Status[];
}

// daftar dokumen
export interface DaftarDokumenBorangByKriteria extends Omit<
  KriteriaGrouped,
  "pendekatan"
> {
  pendekatan: PendekatanGrouped[];
  progress: number;
}

// daftar dokumen with meta
export interface DaftarDokumenBorangByKriteriaWithMeta {
  data: DaftarDokumenBorangByKriteria[];
  meta: MetaType;
}

// type daftar kebutuhan dokumentasi
export interface DaftarKebutuhanDokumentasiItemType {
  kebutuhanDokumen: {
    id: number;
    namaDokumen: string;
  };
  dokumenBorangStatus: Status[];
}

// daftar kebutuhan dokumentasi by kriteria and pendekatan
export interface DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta {
  data: DaftarKebutuhanDokumentasiItemType[];
  meta: MetaType;
}
