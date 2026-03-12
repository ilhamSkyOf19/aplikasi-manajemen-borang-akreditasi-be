import { object } from "zod";
import prisma from "../libs/prisma";
import {
  CreateDokumenBorangType,
  DaftarDokumenBorangByKriteriaWithMeta,
  DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta,
  DaftarKebutuhanDokumentasiItemType,
  KriteriaGrouped,
  PicItem,
} from "../models/dokumenBorang.model";
import { LokasiFile, Status } from "../utils/contstanst";
import { KebutuhanDokumenService } from "./kebutuhanDokumen.service";
import { PaginationType } from "../types/pagination";
import { Prisma } from "../../generated/prisma/browser";
import path from "path";
import { DriveApiService } from "./driveapi.service";
import fs from "fs";
import { FileService } from "./file.service";

export class DokumenBorangService {
  // create with file
  static async createWithFile(
    tx: Prisma.TransactionClient,
    data: {
      filename: string;
      uploadedBy: number;
      keterangan: string;
      lokasiFile: LokasiFile;
      picId: number;
      assignedBy: number;
    },
  ) {
    const dokumen = await tx.dokumenBorang.create({
      data: {
        filename: data.filename,
        keterangan: data.keterangan,
        lokasi_file: data.lokasiFile,
        status: Status.menunggu,
        uploadedById: data.uploadedBy,
      },
    });

    const result = await DokumenBorangService.createPicDokumen(tx, {
      dokumenBorangId: dokumen.id,
      picId: data.picId,
      assignedBy: data.assignedBy,
    });

    return result;
  }

  // find dokumen borang by id
  static async findByIds(ids: number[]) {
    return await prisma.dokumenBorang.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  // create pic dokumen
  static async createPicDokumen(
    tx: Prisma.TransactionClient,
    data: {
      dokumenBorangId: number;
      picId: number;
      assignedBy: number;
    },
  ) {
    return tx.picDokumenBorang.create({
      data: {
        dokumenBorangId: data.dokumenBorangId,
        picId: data.picId,
        assignedById: data.assignedBy,
      },
      select: {
        pic: {
          include: {
            kebutuhanDokumen: {
              select: {
                id: true,
                namaDokumen: true,
                kriteria: {
                  select: {
                    id: true,
                    kriteria: true,
                    namaKriteria: true,
                  },
                },
                pendekatan: {
                  select: {
                    id: true,
                    tahap: true,
                    keterangan: true,
                  },
                },
              },
            },
            picDokumen: {
              select: {
                assignedBy: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                  },
                },
                dokumenBorang: {
                  select: {
                    id: true,
                    filename: true,
                    keterangan: true,
                    createdAt: true,
                    updatedAt: true,
                    status: true,
                    uploadedBy: {
                      select: {
                        id: true,
                        nama: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // create
  static async create(
    req: Omit<CreateDokumenBorangType, "filename">,
    uploadedFiles: Express.Multer.File[],
  ): Promise<any> {
    const { assignedBy, uploadedBy, picId, keterangan, files } = req;

    const uploadedGdriveIds: string[] = [];
    const uploadedSistemPaths: string[] = [];

    let uploadIndex = 0;

    try {
      const result = await prisma.$transaction(async (tx) => {
        return Promise.all(
          files.map(async (file) => {
            // file lama - create pivot pic dokumen borang
            if (file.useOldFile) {
              return DokumenBorangService.createPicDokumen(tx, {
                dokumenBorangId: file.oldDokumenBorangId!,
                picId: picId,
                assignedBy: assignedBy,
              });
            }

            // multer
            const multerFile = uploadedFiles[uploadIndex++];

            // generate filename
            const ext = path.extname(multerFile.originalname);
            const dateString = new Date().toISOString().replace(/[:.]/g, "-");
            const finalName = `${file.filename}-${dateString}${ext}`;

            // check lokasi file
            if (file.lokasiFile === LokasiFile.GDRIVE) {
              const gdrive = await DriveApiService.upload({
                fileBuffer: multerFile.buffer,
                filename: finalName,
                mimeType: multerFile.mimetype,
                allowMimeType: ["application/pdf"],
              });

              // push gdrive id
              uploadedGdriveIds.push(gdrive.fileId!);

              // create data dokumen borang
              return this.createWithFile(tx, {
                filename: finalName,
                uploadedBy: uploadedBy,
                keterangan: keterangan,
                lokasiFile: LokasiFile.GDRIVE,
                picId: picId,
                assignedBy: assignedBy,
              });
            } else {
              const folder = "public/uploads/dokumen-borang";

              // check existing folder
              if (!fs.existsSync(folder))
                fs.mkdirSync(folder, { recursive: true });

              // file path
              const filePath = path.join(folder, finalName);

              // create file
              fs.writeFileSync(filePath, multerFile.buffer);

              // push to upload sistem paths
              uploadedSistemPaths.push(filePath);

              // create with file
              return await this.createWithFile(tx, {
                filename: finalName,
                uploadedBy: uploadedBy,
                keterangan: keterangan,
                lokasiFile: LokasiFile.SISTEM,
                picId: picId,
                assignedBy: assignedBy,
              });
            }
          }),
        );
      });

      return result;
    } catch (error) {
      // delete file
      await Promise.all(
        uploadedGdriveIds.map((id) => DriveApiService.deleteFile(id)),
      );

      // delete files
      uploadedSistemPaths.forEach((path) => FileService.deleteFile(path));

      throw error;
    }
  }

  // static async create(req: CreateDokumenBorangType): Promise<any | null> {
  //   // destructure
  //   const { assignedBy, uploadedBy, filename, keterangan, lokasiFile, picId } =
  //     req;

  //   // call db
  //   const result = await prisma.$transaction(async (tx) => {
  //     // create many dokumen borang
  //     await tx.dokumenBorang.createMany({
  //       data: filename.map((file) => ({
  //         filename: file,
  //         keterangan,
  //         lokasi_file: lokasiFile,
  //         status: Status.menunggu,
  //         uploadedById: uploadedBy!,
  //       })),
  //     });

  //     // find many file
  //     const createdDokumens = await tx.dokumenBorang.findMany({
  //       where: {
  //         uploadedById: uploadedBy,
  //         filename: { in: filename.map((file) => file) },
  //       },
  //       select: { id: true },
  //     });

  //     // create pic dokumen borang
  //     await tx.picDokumenBorang.createMany({
  //       data: createdDokumens.map((dokumen) => ({
  //         dokumenBorangId: dokumen.id,
  //         picId,
  //         assignedById: assignedBy,
  //       })),
  //     });

  //     return createdDokumens;
  //   });

  //   return result;
  // }

  // read daftar dokumen by user id
  static async readDaftarDokumen(
    userId: number,
    pagination: PaginationType,
  ): Promise<DaftarDokumenBorangByKriteriaWithMeta | null> {
    // destruct
    const { page = 1, limit = 10, search, sort } = pagination;

    // currrent page
    const currentPage = page ? page : 1;

    // search
    const conditional = {
      where: {
        userId,
        timAkreditasi: {
          picTimAkreditasi: {
            some: {
              pic: {
                kebutuhanDokumen: {
                  namaDokumen: search
                    ? {
                        contains: search,
                      }
                    : {},
                },
              },
            },
          },
        },
      },
    };

    // get total
    const totalData = await prisma.userTimAkreditasi.count(conditional);

    // get total
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.userTimAkreditasi.findMany({
      ...conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      select: {
        timAkreditasi: {
          select: {
            picTimAkreditasi: {
              select: {
                pic: {
                  select: {
                    id: true,
                    keterangan: true,
                    picDokumen: {
                      select: {
                        dokumenBorang: {
                          select: {
                            status: true,
                          },
                        },
                      },
                    },
                    kebutuhanDokumen: {
                      select: {
                        id: true,
                        kriteria: {
                          select: {
                            id: true,
                            kriteria: true,
                            namaKriteria: true,
                          },
                        },
                        pendekatan: {
                          select: {
                            id: true,
                            tahap: true,
                            keterangan: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // get count kebutuhan dokumen
    const countKebutuhanDokumen =
      await KebutuhanDokumenService.getCountKebutuhanDokumenByUserId(userId);

    // get count dokumen borang by user id and status
    const countDokumenBorangDiSetujui = await prisma.dokumenBorang.count({
      where: {
        picDokumen: {
          some: {
            pic: {
              picTimAkreditasi: {
                some: {
                  timAkreditasi: {
                    userTimAkreditasi: {
                      some: {
                        userId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // progress
    const progress =
      countDokumenBorangDiSetujui === 0
        ? 0
        : Math.floor(
            (countDokumenBorangDiSetujui / countKebutuhanDokumen) * 100,
          );
    console.log(countKebutuhanDokumen);

    // faltten pic
    const allPics: PicItem[] = result.flatMap((uta) =>
      uta.timAkreditasi.picTimAkreditasi.map((pta) => ({
        ...pta.pic,
        picDokumen: pta.pic.picDokumen.map((pd) => ({
          dokumenBorang: {
            status: pd.dokumenBorang.status as Status,
          },
        })),
      })),
    );

    // group
    const grouped = allPics.reduce<Record<number, KriteriaGrouped>>(
      (acc, pic) => {
        // destruct
        const { kriteria, pendekatan } = pic.kebutuhanDokumen;

        // kriteria id
        const kriteriaKey = kriteria.id;

        // pendekatan id
        const pendekatanKey = pendekatan.id;

        // inisialisasi kriteria jika blm ada array nya
        if (!acc[kriteriaKey]) {
          acc[kriteriaKey] = {
            kriteriaId: kriteria.id,
            namaKriteria: kriteria.namaKriteria,
            nomorKriteria: kriteria.kriteria,
            dokumenBorangStatus: pic.picDokumen.map(
              (pd) => pd.dokumenBorang.status,
            ),
            pendekatan: {},
          };
        }

        // inisialiasi pendekatan jika belum ada array nya
        if (!acc[kriteriaKey].pendekatan[pendekatanKey]) {
          acc[kriteriaKey].pendekatan[pendekatanKey] = {
            pendekatanId: pendekatan.id,
            tahap: pendekatan.tahap,
            keterangan: pendekatan.keterangan,
          };
        }

        return acc;
      },
      {},
    );
    const response = Object.values(grouped)
      .map((kriteria) => ({
        ...kriteria,
        pendekatan: Object.values(kriteria.pendekatan),
        progress,
      }))
      .sort((a, b) =>
        sort === "asc"
          ? a.kriteriaId + b.kriteriaId
          : a.kriteriaId - b.kriteriaId,
      );

    return {
      data: response,
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
    };
  }

  //   get kebutuhan dokumentasi by user id and kriteria and pendekatan
  static async findKebutuhanDokumentasiByUserAndKriteriaAndPendekatan(
    userId: number,
    kriteria: number,
    pendekatan: string,
    pagination: PaginationType,
  ): Promise<DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta | null> {
    const { page = 1, limit = 10, search } = pagination;

    // current page
    const currentPage = page ? page : 1;

    // get total data
    const totalData = await prisma.pic.count({
      where: {
        picTimAkreditasi: {
          some: {
            timAkreditasi: {
              userTimAkreditasi: {
                some: {
                  userId,
                },
              },
            },
          },
        },
        kebutuhanDokumen: {
          namaDokumen: search ? { contains: search } : {},
          kriteria: {
            kriteria,
          },
          pendekatan: {
            keterangan: pendekatan.toLowerCase(),
          },
        },
      },
    });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.userTimAkreditasi.findMany({
      where: {
        userId,
      },
      skip: (currentPage - 1) * limit,
      take: limit,
      select: {
        timAkreditasi: {
          select: {
            picTimAkreditasi: {
              where: {
                // ← TAMBAHKAN INI
                pic: {
                  kebutuhanDokumen: {
                    namaDokumen: search ? { contains: search } : {},
                    kriteria: {
                      kriteria,
                    },
                    pendekatan: {
                      keterangan: pendekatan,
                    },
                  },
                },
              },
              select: {
                pic: {
                  select: {
                    id: true,
                    keterangan: true,
                    kebutuhanDokumen: {
                      select: {
                        id: true,
                        namaDokumen: true,
                      },
                    },
                    picDokumen: {
                      select: {
                        dokumenBorang: {
                          select: {
                            status: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // flattmap
    const allKebutuhanDokumenAndStatus: DaftarKebutuhanDokumentasiItemType[] =
      result.flatMap((uta) =>
        uta.timAkreditasi.picTimAkreditasi.map((pta) => ({
          kebutuhanDokumen: {
            id: pta.pic.kebutuhanDokumen.id,
            namaDokumen: pta.pic.kebutuhanDokumen.namaDokumen,
          },
          dokumenBorangStatus: pta.pic.picDokumen.map(
            (pd) => pd.dokumenBorang.status as Status,
          ),
        })),
      );

    // final data
    const finalData = Array.from(
      allKebutuhanDokumenAndStatus
        .reduce((map, item) => {
          if (!map.has(item.kebutuhanDokumen.id)) {
            map.set(item.kebutuhanDokumen.id, item);
          }
          return map;
        }, new Map<number, DaftarKebutuhanDokumentasiItemType>())
        .values(),
    );

    return {
      data: finalData,
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
    };
  }
}
