export interface ResponseDistribusiKebutuhanDokumentasiType {
  id: number;
  is_active: boolean;
  periode_id: number;
  created_at: Date;
  updated_at: Date;
}

// create
export interface CreateDistribusiType {
  periode_id: number;
}
