import { TipeRiwayat, Status } from "../utils/contstanst";
import { IPic } from "./pic.model";
import { ITimAkreditasi } from "./timAkreditasi.model";
import { PayloadDosenType } from "./dosen.model";
import { IKebutuhanDokumentsiPic } from "./kebutuhanDokumentasiPic.model";

export interface IRiwayatKebutuhanDokumentasiPic {
  id: number;
  tipe_riwayat: TipeRiwayat;
  kebutuhan_dokumentasi_pic?: Pick<
    IKebutuhanDokumentsiPic,
    | "id"
    | "keterangan"
    | "nama_kebutuhan_dokumentasi"
    | "pic"
    | "status"
    | "tipe_dokumentasi"
  > & {
    kriteria_pic: {
      kriteria: {
        id: number;
        nama_kriteria: string;
      };
      dosen: {
        id: number;
        nama: string;
      };
    };
    pendekatan: {
      id: number;
      tahap: string;
      keterangan: string;
    };
  };
  keterangan: string;
  created_at: Date;
  update_at: Date;
}

// create
export interface CreateRiwayatKebutuhanDOkumentasiPicType {
  status: Status;
  tipe_riwayat: TipeRiwayat;
  kebutuhan_dokumentasi_pic_id: number;
  keterangan: string;
}

// update
// export interface UpdateRiwayatType extends Partial<
//   Omit<CreateRiwayatType, "picId">
// > {}

// response create riwayat kebutuhan dokumentasi pic
export interface ResponseCreateRiwayatKebutuhanDokumentasiPicType {
  id: number;
  kebutuhan_dokumentasi_pic_id: number;
  tipe_riwayat: TipeRiwayat;
  status: Status;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}

// to response create
export const toResponseCreateRiwayatKebutuhanDokumentasiPicType = (
  riwayat: ResponseCreateRiwayatKebutuhanDokumentasiPicType,
): ResponseCreateRiwayatKebutuhanDokumentasiPicType => riwayat;

// response
export interface ResponseRiwayatKebutuhanDokumentasiPicType extends IRiwayatKebutuhanDokumentasiPic {}

// to response
export const toResponseRiwayatKebutuhanDokumentasiPicType = (
  riwayat: ResponseRiwayatKebutuhanDokumentasiPicType,
): ResponseRiwayatKebutuhanDokumentasiPicType => riwayat;
