import { StorageProvider } from "../../generated/prisma/enums";
import { MetaType, Status, TipeDokumentasi } from "../utils/contstanst";

export interface ResponseFileDokumenForChooseWithMetaType {
  meta: MetaType;
  data: {
    id: number;
    nama_file: string;
  }[];
}
