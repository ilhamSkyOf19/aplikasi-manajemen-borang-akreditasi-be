import prisma from "../libs/prisma";
import {
  CreateDokumenBorangType,
  DaftarDokumenBorangByKriteriaWithMeta,
  DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta,
  DaftarKebutuhanDokumentasiItemType,
  KriteriaGrouped,
  PicItem,
  ResponseCreateDokumenBorangType,
  ResponseDaftarDokumenBorangByKebutuhanDokumenType,
  ResponseDokumenBorangType,
  toResponseCreateDokumenBorangType,
  toResponseDaftarDokumenBorangByKebutuhanDokumenType,
  toResponseDokumenBorangType,
} from "../models/dokumenBorang.model";
import { LokasiFile, Status } from "../utils/contstanst";
import { KebutuhanDokumenService } from "./kebutuhanDokumen.service";
import { PaginationType } from "../types/pagination";
import { Prisma } from "../../generated/prisma/browser";
import path from "path";
import { DriveApiService } from "./driveapi.service";
import fs from "fs";
import { FileService } from "./file.service";
import { Response } from "express";
import archiver from "archiver";
import driveApi from "../configs/driveapi.config";

export class DokumenBorangService {
  private static folderPath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "dokumen-borang",
  );
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
      fileId?: string;
    },
  ): Promise<ResponseCreateDokumenBorangType | null> {
    const dokumen = await tx.dokumenBorang.create({
      data: {
        filename: data.filename,
        keterangan: data.keterangan,
        lokasi_file: data.lokasiFile,
        status: Status.menunggu,
        uploadedById: data.uploadedBy,
        file_id: data.fileId,
      },
    });

    const result = await this.createPicDokumen(tx, {
      dokumenBorangId: dokumen.id,
      picId: data.picId,
      assignedBy: data.assignedBy,
    });

    return result;
  }

  // find dokumen borang by id
  static async findByIds(
    ids: number[],
  ): Promise<ResponseDokumenBorangType[] | null> {
    const result = await prisma.dokumenBorang.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        filename: true,
        keterangan: true,
        lokasi_file: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        file_id: true,
        picDokumen: {
          select: {
            assignedBy: {
              select: {
                id: true,
                nama: true,
                email: true,
              },
            },
          },
        },
        uploadedBy: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
      },
    });

    // check
    if (!result) return null;

    return result.map((item) =>
      toResponseDokumenBorangType({
        dokumen: {
          id: item.id,
          filename: item.filename,
          keterangan: item.keterangan,
          status: item.status as Status,
          lokasiFile: item.lokasi_file as LokasiFile,
          fileId: item.file_id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
        assignedBy: {
          id: item.picDokumen[0].assignedBy.id,
          nama: item.picDokumen[0].assignedBy.nama,
          email: item.picDokumen[0].assignedBy.email,
        },
        uploadedBy: {
          id: item.uploadedBy.id,
          nama: item.uploadedBy.nama,
          email: item.uploadedBy.email,
        },
      }),
    );
  }

  // create pic dokumen
  static async createPicDokumen(
    tx: Prisma.TransactionClient,
    data: {
      dokumenBorangId: number;
      picId: number;
      assignedBy: number;
    },
  ): Promise<ResponseCreateDokumenBorangType | null> {
    const result = await tx.picDokumenBorang.create({
      data: {
        dokumenBorangId: data.dokumenBorangId,
        picId: data.picId,
        assignedById: data.assignedBy,
      },
      select: {
        pic: {
          select: {
            id: true,
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
                    lokasi_file: true,
                    file_id: true,
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

    return toResponseCreateDokumenBorangType({
      pic: {
        id: result.pic.id,
      },
      kebutuhanDokumen: {
        id: result.pic.kebutuhanDokumen.id,
        namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
        kriteria: result.pic.kebutuhanDokumen.kriteria,
        pendekatan: result.pic.kebutuhanDokumen.pendekatan,
        dokumenBorang: result.pic.picDokumen.map((item) => ({
          id: item.dokumenBorang.id,
          uploadedBy: item.dokumenBorang.uploadedBy,
          assignedBy: item.assignedBy,
          dokumen: {
            id: item.dokumenBorang.id,
            filename: item.dokumenBorang.filename,
            keterangan: item.dokumenBorang.keterangan,
            fileId: item.dokumenBorang.file_id,
            createdAt: item.dokumenBorang.createdAt,
            updatedAt: item.dokumenBorang.updatedAt,
            lokasiFile: item.dokumenBorang.lokasi_file as LokasiFile,
            status: item.dokumenBorang.status as Status,
          },
        })),
      },
    });
  }

  // create
  static async create(
    req: Omit<CreateDokumenBorangType, "filename">,
    uploadedFiles: Express.Multer.File[],
  ): Promise<ResponseCreateDokumenBorangType | null> {
    const { assignedBy, uploadedBy, picId, files } = req;

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
            const finalName = `${file.filename}${ext}`;

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
              return await this.createWithFile(tx, {
                filename: finalName,
                uploadedBy: uploadedBy,
                keterangan: file.keterangan!,
                lokasiFile: LokasiFile.GDRIVE,
                picId: picId,
                assignedBy: assignedBy,
                fileId: gdrive.fileId,
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
                keterangan: file.keterangan!,
                lokasiFile: LokasiFile.SISTEM,
                picId: picId,
                assignedBy: assignedBy,
              });
            }
          }),
        );
      });

      return result[0];
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

  // read daftar dokumen by user id
  static async findDaftarDokumen(
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

        console.log(
          "status dokumen borang :",
          pic.picDokumen.map((pd) => pd.dokumenBorang.status),
        );

        // inisialisasi kriteria jika blm ada array nya
        if (!acc[kriteriaKey]) {
          acc[kriteriaKey] = {
            kriteriaId: kriteria.id,
            namaKriteria: kriteria.namaKriteria,
            nomorKriteria: kriteria.kriteria,
            dokumenBorangStatus: [],
            pendekatan: {},
          };
        }

        // push dokumen status
        const newStatuses = pic.picDokumen.map((pd) => pd.dokumenBorang.status);
        acc[kriteriaKey].dokumenBorangStatus.push(...newStatuses);

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

  // get dokumen borang by kebutuhan dokumentasi id
  static async findDokumenBorangByKebutuhanDokumentasiId(
    kebutuhanDokumentasiId: number,
  ): Promise<ResponseDaftarDokumenBorangByKebutuhanDokumenType | null> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.findFirst({
      where: {
        id: kebutuhanDokumentasiId,
      },
      select: {
        id: true,
        namaDokumen: true,
        pic: {
          where: {
            kebutuhanDokumen: {
              id: kebutuhanDokumentasiId,
            },
          },
          select: {
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
                    file_id: true,
                    status: true,
                    lokasi_file: true,
                    createdAt: true,
                    updatedAt: true,
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

    // if not found
    if (!result) return null;

    return toResponseDaftarDokumenBorangByKebutuhanDokumenType({
      kebutuhanDokumen: {
        id: result?.id,
        namaDokumen: result?.namaDokumen,
      },
      daftarDokumen: result?.pic.flatMap((pd) =>
        pd.picDokumen.map((item) =>
          toResponseDokumenBorangType({
            dokumen: {
              id: item.dokumenBorang.id,
              filename: item.dokumenBorang.filename,
              keterangan: item.dokumenBorang.keterangan,
              status: item.dokumenBorang.status as Status,
              lokasiFile: item.dokumenBorang.lokasi_file as LokasiFile,
              fileId: item.dokumenBorang.file_id,
              createdAt: item.dokumenBorang.createdAt,
              updatedAt: item.dokumenBorang.updatedAt,
            },
            assignedBy: {
              id: item.assignedBy.id,
              nama: item.assignedBy.nama,
              email: item.assignedBy.email,
            },
            uploadedBy: {
              id: item.dokumenBorang.uploadedBy.id,
              nama: item.dokumenBorang.uploadedBy.nama,
              email: item.dokumenBorang.uploadedBy.email,
            },
          }),
        ),
      ),
    });
  }

  // check filenames by filename
  static async findFileNamesByFilename(filename: string[]): Promise<string[]> {
    // map , split and join (-)
    const filenameMap = filename.map((item) => `${item}.pdf`);

    const result = await prisma.dokumenBorang.findMany({
      where: {
        filename: {
          in: filenameMap,
        },
      },
      select: {
        filename: true,
      },
    });

    return result.map((item) => item.filename);
  }

  // find dokumen borang by id
  static async dokumenBorangById(
    id: number,
  ): Promise<ResponseDokumenBorangType | null> {
    const result = await prisma.dokumenBorang.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        filename: true,
        keterangan: true,
        lokasi_file: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        file_id: true,
        picDokumen: {
          select: {
            assignedBy: {
              select: {
                id: true,
                nama: true,
                email: true,
              },
            },
          },
        },
        uploadedBy: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
      },
    });

    // check result
    if (!result) return null;

    return toResponseDokumenBorangType({
      dokumen: {
        id: result.id,
        filename: result.filename,
        keterangan: result.keterangan,
        status: result.status as Status,
        lokasiFile: result.lokasi_file as LokasiFile,
        fileId: result.file_id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
      assignedBy: {
        id: result.picDokumen[0].assignedBy.id,
        nama: result.picDokumen[0].assignedBy.nama,
        email: result.picDokumen[0].assignedBy.email,
      },
      uploadedBy: {
        id: result.uploadedBy.id,
        nama: result.uploadedBy.nama,
        email: result.uploadedBy.email,
      },
    });
  }

  // download file
  static async downloadSingleFile(
    filename: string,
    res: Response,
  ): Promise<void> {
    // check
    if (filename.includes("..")) throw new Error("FIlename tidak valid");

    // file path
    const filepath = path.join(this.folderPath, filename);

    // check existing file
    if (!fs.existsSync(filepath)) throw new Error("File tidak ada");

    // download
    res.download(filepath, filename);
  }

  // download multiple file
  static async downloadMultipleFile(
    filenames: string[],
    res: Response,
  ): Promise<void> {
    // set header
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=dokumen-borang.zip",
    );

    // set header
    res.header("Content-Type", "application/zip");

    // archive
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    // archive pipe
    archive.pipe(res);

    // iterasi
    for (const filename of filenames) {
      if (filename.includes("..")) continue;

      const filePath = path.join(this.folderPath, filename);

      // check
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: filename });
      }
    }

    await archive.finalize();
  }

  // delete dokumen borang by ids
  static async deleteByIds(ids: number[]): Promise<boolean> {
    const result = await prisma.dokumenBorang.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result ? true : false;
  }
}
