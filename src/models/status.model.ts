import { Status, TipeRiwayat } from "../utils/contstanst";

// update status
export interface UpdateStatusType {
  status: Status;
  keterangan: string;
  jenisRiwayat: TipeRiwayat;
}
