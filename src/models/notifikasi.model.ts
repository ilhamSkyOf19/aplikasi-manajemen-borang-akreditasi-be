import { MetaType, TypeNotifikasi } from "../utils/contstanst";

export interface INotifikasi {
  id: number;
  recipient: number;
  type: TypeNotifikasi;
  title: string;
  message: string;
  isRead: boolean;
  picId?: number;
  kebutuhanDokumen?: string;
  kriteria?: string;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateNotifikasiType {
  recipientId: number;
  type: TypeNotifikasi;
  title: string;
  message: string;
  picId?: number;
  kebutuhanDokumen?: string;
  kriteria?: string;
}

// response
export interface ResponseNotifikasiType extends INotifikasi {}

// to response
export const toResponseNotifikasiType = (
  notifikasi: ResponseNotifikasiType,
): ResponseNotifikasiType => notifikasi;

export interface ResponseNotifikasiWithMetaType {
  data: INotifikasi[];
  meta: MetaType;
}

// to response
export const toResponseNotifikasiWithMetaType = (
  notifikasi: ResponseNotifikasiWithMetaType,
): ResponseNotifikasiWithMetaType => notifikasi;
