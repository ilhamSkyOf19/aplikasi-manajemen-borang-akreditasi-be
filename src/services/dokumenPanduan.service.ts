import prisma from "../libs/prisma";
import {
  CreateDokumenPanduanServiceType,
  ResponseDokumenPanduanType,
  toResponseDokumenPanduanType,
  UpdateDokumenPanduanServiceType,
} from "../models/dokumenPanduan.model";
import { StorageProvider } from "../utils/contstanst";

export class DokumenPanduanService {
  // find by periode
  static async findByPeriode(
    periode_id: number,
  ): Promise<ResponseDokumenPanduanType | null> {
    // call db
    const result = await prisma.dokumenPanduan.findFirst({
      where: {
        periode_id,
      },
      select: {
        id: true,
        id_file: true,
        periode_id: true,
        storage_provider: true,
        nama_file: true,
        created_at: true,
        updated_at: true,
      },
    });

    // return null
    if (!result) return null;

    return toResponseDokumenPanduanType({
      id: result.id,
      id_file: result.id_file,
      periode_id: result.periode_id,
      storage_provider: result.storage_provider as StorageProvider,
      nama_file: result.nama_file,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }
  // create
  static async create(
    data: CreateDokumenPanduanServiceType,
  ): Promise<ResponseDokumenPanduanType | null> {
    // get data
    const { id_file, nama_file, periode_id, storage_provider } = data;

    // call db
    const result = await prisma.dokumenPanduan.create({
      data: {
        id_file,
        periode_id,
        storage_provider,
        nama_file,
      },
      select: {
        id: true,
        id_file: true,
        periode_id: true,
        storage_provider: true,
        nama_file: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseDokumenPanduanType({
      id: result.id,
      id_file: result.id_file,
      periode_id: result.periode_id,
      storage_provider: result.storage_provider as StorageProvider,
      nama_file: result.nama_file,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  //   update
  static async update(
    data: UpdateDokumenPanduanServiceType,
  ): Promise<ResponseDokumenPanduanType | null> {
    // get data
    const { id_file, nama_file, periode_id, storage_provider } = data;

    // call db
    const result = await prisma.dokumenPanduan.update({
      where: {
        periode_id,
      },
      data: {
        id_file,
        periode_id,
        storage_provider,
        nama_file,
      },
      select: {
        id: true,
        id_file: true,
        periode_id: true,
        storage_provider: true,
        nama_file: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseDokumenPanduanType({
      id: result.id,
      id_file: result.id_file,
      periode_id: result.periode_id,
      storage_provider: result.storage_provider as StorageProvider,
      nama_file: result.nama_file,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }
}
