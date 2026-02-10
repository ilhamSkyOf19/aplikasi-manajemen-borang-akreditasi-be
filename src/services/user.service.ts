import prisma from "../libs/prisma";
import {
  CreateUserType,
  LoginUserType,
  PayloadUserType,
  ResponseUserType,
  toUserResponse,
} from "../models/user.model";
import { UserRole } from "../utils/contstanst";

export class UserService {
  // create
  static async create(req: CreateUserType): Promise<ResponseUserType | null> {
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
      },
    });

    return toUserResponse({
      ...result,
      role: result.role as UserRole,
    });
  }

  // find user by email or name & password
  static async findUser({
    identifier,
  }: Omit<LoginUserType, "password">): Promise<
    (ResponseUserType & { password: string }) | null
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
      ...toUserResponse({
        ...user,
        role: user.role as UserRole,
      }),
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
}
