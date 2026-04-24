import { startsWith } from "zod";
import prisma from "../libs/prisma";
import {
  CreateDosenType,
  LoginDosenType,
  PayloadDosenType,
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
    const result = await prisma.dosen.create({
      data: {
        ...req,
        role: req.role,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toDosenResponse({
      ...result,
      role: result.role as DosenRole,
    });
  }

  //   // find user by email or name & password
  static async findDosenByIdentifier({
    identifier,
  }: Omit<LoginDosenType, "password">): Promise<
    (PayloadDosenType & { password: string }) | null
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
        role: true,
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
      role: dosen.role as DosenRole,
      password: dosen.password,
    };
  }

  //   // find user by id
  static async findById(id: number): Promise<PayloadDosenType | null> {
    const dosen = await prisma.dosen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        role: true,
      },
    });

    // check
    if (!dosen) return null;

    return {
      id: dosen.id,
      nama: dosen.nama,
      email: dosen.email,
      nidn: dosen.nidn,
      role: dosen.role as DosenRole,
    };
  }

  //   // read users id
  //   static async findUserManyById(ids: number[]): Promise<PayloadUserType[]> {
  //     const users = await prisma.user.findMany({
  //       where: {
  //         id: {
  //           in: ids,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         nama: true,
  //         email: true,
  //         role: true,
  //       },
  //     });

  //     return users.map((user) => ({
  //       id: user.id,
  //       nama: user.nama,
  //       email: user.email,
  //       role: user.role as UserRole,
  //     }));
  //   }

  //   // read all user
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
      ...(role && { role }),
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
        role: true,
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
          ...user,
          role: user.role as DosenRole,
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

  //   // update by id
  static async update(
    id: number,
    req: UpdateDosenType,
  ): Promise<PayloadDosenType | null> {
    // call db
    const result = await prisma.dosen.update({
      where: {
        id,
      },
      data: {
        ...req,
        role: req.role,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        nidn: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      id: result.id,
      nama: result.nama,
      email: result.email,
      nidn: result.nidn,
      role: result.role as DosenRole,
    };
  }

  //   // find all user for get ids
  //   static async findAllUserIds(filter?: UserRole[]): Promise<number[]> {
  //     const users = await prisma.user.findMany({
  //       where: {
  //         role: {
  //           notIn: filter,
  //         },
  //       },
  //       select: {
  //         id: true,
  //       },
  //     });

  //     return users.map((user) => user.id);
  //   }

  //   // get wd1 id
  //   static async getWD1Id(): Promise<number> {
  //     const wd1 = await prisma.user.findFirstOrThrow({
  //       where: { role: "wakil_dekan_1" },
  //       select: { id: true },
  //     });
  //     return wd1.id;
  //   }

  //   static async getKaprodiId(): Promise<number> {
  //     const kaprodi = await prisma.user.findFirstOrThrow({
  //       where: { role: "kaprodi" },
  //       select: { id: true },
  //     });
  //     return kaprodi.id;
  //   }

  //   // delete by id
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
  //   static async findCountRole(role: UserRole): Promise<number> {
  //     return await prisma.user.count({
  //       where: {
  //         role: role,
  //       },
  //     });
  //   }
}
