export enum UserRole {
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
