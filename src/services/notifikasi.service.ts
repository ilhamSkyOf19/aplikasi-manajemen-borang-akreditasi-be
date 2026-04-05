import { cpuUsage } from "node:process";
import { Prisma } from "../../generated/prisma/browser";
import prisma from "../libs/prisma";
import {
  CreateNotifikasiType,
  ResponseNotifikasiType,
  ResponseNotifikasiWithMetaType,
  toResponseNotifikasiType,
  toResponseNotifikasiWithMetaType,
} from "../models/notifikasi.model";
import { PaginationType } from "../types/pagination";
import { TypeNotifikasi, UserRole } from "../utils/contstanst";
import { UserService } from "./user.service";

export class NotifikasiService {
  // =============================================
  // BASIC CREATE
  // =============================================

  static async createNotification(params: CreateNotifikasiType): Promise<void> {
    await prisma.notification.create({ data: params });
  }

  // =============================================
  // BULK CREATE
  // =============================================

  static async createBulkNotifications(
    recipientIds: number[],
    params: Omit<CreateNotifikasiType, "recipientId">,
  ): Promise<void> {
    await prisma.notification.createMany({
      data: recipientIds.map((id) => ({
        ...params,
        recipientId: id,
      })),
    });
  }

  // =============================================
  // HELPER
  // =============================================

  static async getUserIdsByRole(role: UserRole): Promise<number[]> {
    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true },
    });

    return users.map((u) => u.id);
  }

  // =============================================
  // SKENARIO 1A — WD1 MENAMBAH KRITERIA
  // =============================================

  static async notifyKriteriaDitambah(namaKriteria: string): Promise<void> {
    const allUserIdsNotWD1 = await UserService.findAllUserIds([
      UserRole.wakil_dekan_1,
    ]);

    await this.createBulkNotifications(allUserIdsNotWD1, {
      type: TypeNotifikasi.KRITERIA_DITAMBAH,
      title: "Kriteria Baru",
      message: `Kriteria "${namaKriteria}" telah ditambahkan oleh Wakil Dekan 1.`,
      kriteria: namaKriteria,
    });
  }

  // =============================================
  // SKENARIO 1B — WD1 EDIT KRITERIA
  // =============================================

  static async notifyKriteriaDiedit(namaKriteria: string): Promise<void> {
    const allUserIdsNotWD1 = await UserService.findAllUserIds([
      UserRole.wakil_dekan_1,
    ]);

    await this.createBulkNotifications(allUserIdsNotWD1, {
      type: TypeNotifikasi.KRITERIA_DIEDIT,
      title: "Kriteria Diperbarui",
      message: `Kriteria "${namaKriteria}" telah diperbarui oleh WD1.`,
      kriteria: namaKriteria,
    });
  }

  // =============================================
  // SKENARIO 1C — WD1 HAPUS KRITERIA
  // =============================================

  static async notifyKriteriaDihapus(kriteria: string): Promise<void> {
    const allUserIdsNotWD1 = await UserService.findAllUserIds([
      UserRole.wakil_dekan_1,
    ]);

    await this.createBulkNotifications(allUserIdsNotWD1, {
      type: TypeNotifikasi.KRITERIA_DIHAPUS,
      title: "Kriteria Dihapus",
      message: `Kriteria "${kriteria}" telah dihapus oleh WD1.`,
    });
  }

  // =============================================
  // SKENARIO 2A — KAPRODI MEMBUAT PIC
  // =============================================

  static async notifyPicBaruKeWD1(
    picId: number,
    namaDokumen: string,
  ): Promise<void> {
    const wd1Id = await UserService.getWD1Id();

    await this.createNotification({
      recipientId: wd1Id,
      type: TypeNotifikasi.PIC_BARU_PERLU_VERIFIKASI,
      title: "PIC Baru Menunggu Verifikasi",
      message: `Kaprodi telah membuat PIC baru untuk dokumen "${namaDokumen}". Mohon lakukan verifikasi.`,
      picId,
      kebutuhanDokumen: namaDokumen,
    });
  }

  // =============================================
  // SKENARIO 2B — REVISI PIC OLEH KAPRODI
  // =============================================

  static async notifyPicRevisiKaprodiKeWD1(
    picId: number,
    namaDokumen: string,
    title?: string,
    message?: string,
  ): Promise<void> {
    const wd1Id = await UserService.getWD1Id();

    await this.createNotification({
      recipientId: wd1Id,
      type: TypeNotifikasi.PIC_DIREVISI_KAPRODI,
      title: title ?? "Revisi PIC Menunggu Verifikasi",
      message:
        message ??
        `Kaprodi telah mengirimkan revisi untuk dokumen "${namaDokumen}". Mohon periksa kembali.`,
      picId,
      kebutuhanDokumen: namaDokumen,
    });
  }

  // =============================================
  // SKENARIO 3A — WD1 MENYETUJUI PIC
  // =============================================

  static async notifyPicDisetujuiWD1(
    picId: number,
    namaDokumen: string,
  ): Promise<void> {
    const kaprodiId = await UserService.getKaprodiId();

    await this.createNotification({
      recipientId: kaprodiId,
      type: TypeNotifikasi.PIC_DISETUJUI_WD1,
      title: "PIC Disetujui",
      message: `Dokumen "${namaDokumen}" telah disetujui oleh Wakil Dekan 1.`,
      picId,
      kebutuhanDokumen: namaDokumen,
    });
  }

  // =============================================
  // SKENARIO 3B — WD1 MEMINTA REVISI PIC
  // =============================================

  static async notifyPicDirevisiWD1(
    picId: number,
    namaDokumen: string,
    keteranganRevisi: string,
  ): Promise<void> {
    const kaprodiId = await UserService.getKaprodiId();

    console.log(kaprodiId);

    await this.createNotification({
      recipientId: kaprodiId,
      type: TypeNotifikasi.PIC_DIREVISI_WD1,
      title: "PIC Perlu Direvisi",
      message: `Wakil Dekan 1 meminta revisi untuk dokumen "${namaDokumen}". Catatan: ${keteranganRevisi}`,
      picId,
      kebutuhanDokumen: namaDokumen,
    });
  }

  //   find all user by ids user
  static async findAll(
    id: number,
    req: PaginationType & {
      isRead?: boolean;
      sort?: string;
    },
  ): Promise<ResponseNotifikasiWithMetaType | null> {
    const { limit = 10, page = 1, search, isRead, sort = "desc" } = req;

    const currentPage = page < 1 ? 1 : page;

    const conditional = {
      where: {
        recipientId: id,
        title: search
          ? {
              contains: search,
            }
          : undefined,
        isRead: isRead,
      },
    };

    const totalData = await prisma.notification.count(conditional);

    const totalPage = Math.ceil(totalData / limit);

    const skip = (currentPage - 1) * limit;
    const take = limit;

    const result = await prisma.notification.findMany({
      ...conditional,
      skip,
      take,
      orderBy: {
        createdAt: sort ? (sort as Prisma.SortOrder) : "desc",
      },
    });

    return toResponseNotifikasiWithMetaType({
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
      data: result.map((item) =>
        toResponseNotifikasiType({
          ...item,
          type: item.type as TypeNotifikasi,
          recipient: item.recipientId,
          picId: item.picId ?? undefined,
          kebutuhanDokumen: item.kebutuhanDokumen ?? undefined,
          kriteria: item.kriteria ?? undefined,
        }),
      ),
    });
  }

  // read
  static async isRead(id: number): Promise<ResponseNotifikasiType> {
    // call db
    const result = await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });

    return toResponseNotifikasiType({
      ...result,
      recipient: result.recipientId,
      type: result.type as TypeNotifikasi,
      picId: result.picId ?? undefined,
      kebutuhanDokumen: result.kebutuhanDokumen ?? undefined,
      kriteria: result.kriteria ?? undefined,
    });
  }

  // delete
  static async delete(id: number): Promise<void> {
    await prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}
