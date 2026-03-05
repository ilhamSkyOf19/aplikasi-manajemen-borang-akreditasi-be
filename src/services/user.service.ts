import { startsWith } from "zod";
import prisma from "../libs/prisma";
import {
  CreateUserType,
  LoginUserType,
  PayloadUserType,
  ResponseUserType,
  ResponseUserWithMetaType,
  toUserResponse,
  UpdateUserType,
} from "../models/user.model";
import { PaginationType } from "../types/pagination";
import { UserRole } from "../utils/contstanst";

export class UserService {
  // create
  static async create(
    req: Omit<CreateUserType, "confirmPassword">,
  ): Promise<ResponseUserType | null> {
    const result = await prisma.user.create({
      data: {
        ...req,
        role: req.role,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userTimAkreditasi: {
          select: {
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return toUserResponse({
      ...result,
      tims: result.userTimAkreditasi.map((tim) => tim.timAkreditasi),
      role: result.role as UserRole,
    });
  }

  // find user by email or name & password
  static async findUser({
    identifier,
  }: Omit<LoginUserType, "password">): Promise<
    (PayloadUserType & { password: string }) | null
  > {
    // find user by email or name
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            nama: identifier,
          },
        ],
      },

      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // check
    if (!user) return null;

    return {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role as UserRole,
      password: user.password,
    };
  }

  // find user by id
  static async findUserById(id: number): Promise<PayloadUserType | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
      },
    });

    // check
    if (!user) return null;

    return {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role as UserRole,
    };
  }

  // read users id
  static async findUserManyById(ids: number[]): Promise<PayloadUserType[]> {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role as UserRole,
    }));
  }

  // read all user
  static async readAll(
    query: PaginationType & {
      role?: UserRole;
    },
  ): Promise<ResponseUserWithMetaType | null> {
    // call db
    const { limit = 8, page = 1, search, role } = query;

    // get current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional = {
      where: {
        AND: [
          search
            ? {
                OR: [
                  { nama: { contains: search } },
                  { email: { contains: search } },
                ],
              }
            : {},
          role ? { role } : {},
        ],
      },
    };

    // get count data
    const totalData = await prisma.user.count(conditional);

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // get data
    const result = await prisma.user.findMany({
      ...conditional,
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userTimAkreditasi: {
          select: {
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: result.map((user) =>
        toUserResponse({
          ...user,
          tims: user.userTimAkreditasi.map((tim) => tim.timAkreditasi),
          role: user.role as UserRole,
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

  // update by id
  static async update(
    id: number,
    req: UpdateUserType,
  ): Promise<PayloadUserType | null> {
    // call db
    const result = await prisma.user.update({
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
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: result.id,
      nama: result.nama,
      email: result.email,
      role: result.role as UserRole,
    };
  }

  // find all user for get ids
  static async findAllUserIds(): Promise<number[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
      },
    });
    return users.map((user) => user.id);
  }

  // get wd1 id
  static async getWD1Id(): Promise<number> {
    const wd1 = await prisma.user.findFirstOrThrow({
      where: { role: "wakil_dekan_1" },
      select: { id: true },
    });
    return wd1.id;
  }

  static async getKaprodiId(): Promise<number> {
    const kaprodi = await prisma.user.findFirstOrThrow({
      where: { role: "kaprodi" },
      select: { id: true },
    });
    return kaprodi.id;
  }

  // delete by id
  static async delete(id: number): Promise<boolean> {
    // call db
    const result = await prisma.user.delete({
      where: {
        id,
      },
    });

    // check
    if (!result) return false;

    return true;
  }

  // find count role
  static async findCountRole(role: UserRole): Promise<number> {
    return await prisma.user.count({
      where: {
        role: role,
      },
    });
  }
}
