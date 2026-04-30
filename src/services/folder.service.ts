import prisma from "../libs/prisma";

export class FolderService {
  // find uniqe by nama and by kebutuhan dokumentasi borang
  static async findUniqeByNama(data: {
    folder: string;
    kebutuhan_dokumentasi_pic_id?: number;
    dokumentasi_borang_id?: number;
  }): Promise<number> {
    // get data
    const { kebutuhan_dokumentasi_pic_id, folder, dokumentasi_borang_id } =
      data;
    const result = await prisma.folderDokumen.findFirst({
      where: {
        nama_folder: folder,
        dokumentasi_borang: {
          id: dokumentasi_borang_id,
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_pic_id,
        },
      },
    });

    return result?.id ?? 0;
  }

  static async findUniqeById(data: {
    id: number;
    kebutuhan_dokumentasi_pic_id?: number;
    dokumentasi_borang_id?: number;
  }): Promise<number> {
    // get data
    const { kebutuhan_dokumentasi_pic_id, id, dokumentasi_borang_id } = data;
    const result = await prisma.folderDokumen.findUnique({
      where: {
        id,
        dokumentasi_borang: {
          id: dokumentasi_borang_id,
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_pic_id,
        },
      },
    });

    return result?.id ?? 0;
  }
}
