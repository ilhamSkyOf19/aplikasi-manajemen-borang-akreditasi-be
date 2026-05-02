import { startsWith } from "zod";
import prisma from "../libs/prisma";
import {
  CreateDosenType,
  LoginDosenType,
  PayloadDosenType,
  ResponseDosenChooseWithMetaType,
  ResponseDosenType,
  ResponseDosenWithMetaType,
  toDosenResponse,
  UpdateDosenType,
} from "../models/dosen.model";
import { PaginationType } from "../types/pagination";
import { DosenRole } from "../utils/contstanst";
import { SortOrder } from "../../generated/prisma/internal/prismaNamespaceBrowser";
import { Prisma } from "../../generated/prisma/client";

export class DosenServices {
  // create
  static async create(
    req: Omit<CreateDosenType, "confirmPassword">,
  ): Promise<ResponseDosenType | null> {
    const result = await prisma.$transaction(async (tx) => {
      const dosen = await tx.dosen.create({
        data: {
          nama: req.nama,
          nidn: req.nidn,
          email: req.email,
          password: req.password,
        },
      });

      await tx.dosenRole.createMany({
        data: req.roles.map((role) => ({
          dosen_id: dosen.id,
          role,
        })),
        skipDuplicates: true,
      });

      return tx.dosen.findUnique({
        where: {
          id: dosen.id,
        },
        select: {
          id: true,
          nama: true,
          nidn: true,
          email: true,
          created_at: true,
          updated_at: true,
          dosenRole: {
            select: {
              role: true,
            },
          },
        },
      });
    });

    // check result
    if (!result) return null;
    const { dosenRole, ...dataDosen } = result;

    return toDosenResponse({
      ...dataDosen,
      roles: result?.dosenRole.map((dr) => dr.role) as DosenRole[],
    });
  }

  // //   // find user by email or name & password
  static async findDosenByIdentifier({
    identifier,
  }: Omit<LoginDosenType, "password" | "role">): Promise<
    (ResponseDosenType & { password: string }) | null
  > {
    // find user by email or name
    const dosen = await prisma.dosen.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            nidn: identifier,
          },
        ],
      },

      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        dosenRole: {
          select: {
            role: true,
          },
        },
        password: true,
        created_at: true,
        updated_at: true,
      },
    });

    // check
    if (!dosen) return null;

    return {
      id: dosen.id,
      nama: dosen.nama,
      email: dosen.email,
      nidn: dosen.nidn,
      roles: dosen.dosenRole.map((dr) => dr.role) as DosenRole[],
      password: dosen.password,
      created_at: dosen.created_at,
      updated_at: dosen.updated_at,
    };
  }

  // find dosen by id and role
  static async findByIdAndRole(data: {
    id: number;
    role: DosenRole;
  }): Promise<ResponseDosenType | null> {
    const dosen = await prisma.dosen.findUnique({
      where: {
        id: data.id,
        dosenRole: {
          some: {
            role: data.role,
          },
        },
      },
      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        dosenRole: {
          select: {
            role: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    // check
    if (!dosen) return null;

    return {
      id: dosen.id,
      nama: dosen.nama,
      email: dosen.email,
      nidn: dosen.nidn,
      created_at: dosen.created_at,
      updated_at: dosen.updated_at,
      roles: [
        dosen.dosenRole.find((dr) => dr.role === data.role)!.role,
      ] as DosenRole[],
    };
  }

  // find by id and role
  static async findById(id: number): Promise<ResponseDosenType | null> {
    const dosen = await prisma.dosen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        dosenRole: {
          select: {
            role: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    // check
    if (!dosen) return null;

    return {
      id: dosen.id,
      nama: dosen.nama,
      email: dosen.email,
      nidn: dosen.nidn,
      created_at: dosen.created_at,
      updated_at: dosen.updated_at,
      roles: dosen.dosenRole.map((dr) => dr.role) as DosenRole[],
    };
  }

  // read users id
  static async findDosenManyById(ids: number[]): Promise<ResponseDosenType[]> {
    const dosens = await prisma.dosen.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        dosenRole: {
          select: {
            role: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    return dosens.map((dosen) => ({
      id: dosen.id,
      nama: dosen.nama,
      email: dosen.email,
      nidn: dosen.nidn,
      roles: dosen.dosenRole.map((item) => item.role) as DosenRole[],
      created_at: dosen.created_at,
      updated_at: dosen.updated_at,
    }));
  }

  // //   // read all user
  static async findAll(
    query: PaginationType & {
      role?: DosenRole;
    },
  ): Promise<ResponseDosenWithMetaType | null> {
    // call db
    const { limit = 8, page = 1, search, role, sort } = query;

    // get current page
    const currentPage = page < 1 ? 1 : page;

    // clean search
    const cleanSearch = search ? search.trim() : undefined;

    // conditional
    const conditional: Prisma.DosenWhereInput = {
      ...(cleanSearch && {
        OR: [
          { nama: { contains: cleanSearch } },
          { email: { contains: cleanSearch } },
          { nidn: { contains: cleanSearch } },
        ],
      }),
      ...(role && { dosenRole: { some: { role } } }),
    };

    // get count data
    const totalData = await prisma.dosen.count({ where: conditional });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // get data
    const result = await prisma.dosen.findMany({
      where: conditional,
      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        dosenRole: {
          select: {
            role: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        created_at: sort ? (sort as SortOrder) : "desc",
      },
    });

    return {
      data: result.map((user) =>
        toDosenResponse({
          id: user.id,
          nama: user.nama,
          email: user.email,
          nidn: user.nidn,
          created_at: user.created_at,
          updated_at: user.updated_at,
          roles: user.dosenRole.map((role) => role.role) as DosenRole[],
        }),
      ),
      meta: {
        totalData,
        currentPage,
        totalPage,
        limit,
      },
    };
  }

  // find all role tim akreditasi for choose
  static async findAllRoleTimAkreditasiForChoose(data: {
    search?: string;
    page?: number;
  }): Promise<ResponseDosenChooseWithMetaType | null> {
    // get data
    const { page, search } = data;

    // get current page
    const currentPage = page ? page : 1;

    const conditional: Prisma.DosenRoleWhereInput = {
      AND: [
        {
          role: {
            in: [DosenRole.tim_akreditasi],
          },
        },
        ...(search
          ? [
              {
                dosen: {
                  OR: [
                    {
                      nama: {
                        contains: search,
                      },
                    },
                    {
                      email: {
                        contains: search,
                      },
                    },
                    {
                      nidn: {
                        contains: search,
                      },
                    },
                  ],
                },
              },
            ]
          : []),
      ],
    };

    // call db
    const result = await prisma.dosenRole.findMany({
      where: conditional,
      select: {
        dosen: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      skip: (currentPage - 1) * 8,
      take: 8,
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      meta: {
        totalData: result.length,
        currentPage,
        totalPage: Math.ceil(result.length / 8),
        limit: 8,
      },
      data: result.map((item) => item.dosen),
    };
  }

  // //   // update by id
  static async update(
    id: number,
    req: Omit<UpdateDosenType, "confirmPassword">,
  ): Promise<ResponseDosenType | null> {
    const { roles, ...data } = req;
    const result = await prisma.$transaction(async (tx) => {
      await tx.dosen.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });

      // roles hanya di-update jika dikirim dari request
      if (roles !== undefined) {
        await tx.dosenRole.deleteMany({
          where: {
            dosen_id: id,
          },
        });

        if (roles.length > 0) {
          await tx.dosenRole.createMany({
            data: roles.map((role) => ({
              dosen_id: id,
              role,
            })),
            skipDuplicates: true,
          });
        }
      }

      return tx.dosen.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          nama: true,
          nidn: true,
          email: true,
          created_at: true,
          updated_at: true,
          dosenRole: {
            select: {
              role: true,
            },
          },
        },
      });
    });

    if (!result) return null;

    const { dosenRole, ...dataDosen } = result;

    return toDosenResponse({
      ...dataDosen,
      roles: dosenRole.map((dr) => dr.role) as DosenRole[],
    });
  }

  // delete by id
  static async delete(id: number): Promise<boolean> {
    // call db
    const result = await prisma.dosen.delete({
      where: {
        id,
      },
    });

    // check
    if (!result) return false;

    return true;
  }

  //   // find count role
  static async findCountRole(role: DosenRole): Promise<number> {
    return await prisma.dosenRole.count({
      where: {
        role: role,
      },
    });
  }
}
