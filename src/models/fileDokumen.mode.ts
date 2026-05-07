import { MetaType } from "../utils/contstanst";

export interface ResponseFileDokumenForChooseWithMetaType {
  meta: MetaType;
  data: {
    id: number;
    nama_file: string;
  }[];
}
