import prisma from "../libs/prisma";
import {
  CreateFolderType,
  ResponseFolderType,
  toResponseFolderType,
  UpdateNameFolderType,
} from "../models/folder.model";

export class FolderService {
  // create many
  static async create(data: CreateFolderType): Promise<number> {
    // get data
    const { nama_folder, dokumentasi_borang_id, kebutuhan_dokumentasi_id } =
      data;

    // dokumentasi id
    let finalDokumentasiBorangId: number | null = dokumentasi_borang_id ?? null;

    // check dokumentasi borang
    if (!finalDokumentasiBorangId) {
      const createDokumentasiBorang = await prisma.dokumentasiBorang.create({
        data: {
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_id,
          status: null,
        },
      });

      finalDokumentasiBorangId = createDokumentasiBorang.id;
    }

    if (!finalDokumentasiBorangId) return 0;

    // call db
    const result = await prisma.folderDokumen.createMany({
      data: nama_folder.map((folder) => ({
        nama_folder: folder,
        dokumentasi_borang_id: finalDokumentasiBorangId,
      })),
    });

    return result.count;
  }

  // update
  static async updateName(params: {
    id: number;
    data: UpdateNameFolderType;
  }): Promise<ResponseFolderType | null> {
    // get params
    const { data, id } = params;

    // get data
    const { nama_folder } = data;

    // call db
    const result = await prisma.folderDokumen.update({
      where: {
        id,
      },
      data: {
        nama_folder,
      },
      select: {
        id: true,
        nama_folder: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseFolderType(result);
  }
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
