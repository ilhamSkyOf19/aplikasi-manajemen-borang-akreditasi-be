import prisma from "../libs/prisma";
import {
  CreateUserType,
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
        role: "wakil_dekan_1",
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
}
