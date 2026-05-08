export interface CreateFolderType {
  nama_folder: string[];
  kebutuhan_dokumentasi_id: number;
  dokumentasi_borang_id?: number;
}

// update name folder
export interface UpdateNameFolderType {
  nama_folder: string;
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
