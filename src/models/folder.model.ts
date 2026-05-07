export interface CreateFolderType {
  nama_folder: string[];
  kebutuhan_dokumentasi_id: number;
  dokumentasi_borang_id?: number;
}

// response folder
export interface ResponseFolderType {
  id: number;
  nama_folder: string;
  created_at: Date;
  updated_at: Date;
}

// to response
export const toResponseFolderType = (
  folder: ResponseFolderType,
): ResponseFolderType => folder;
