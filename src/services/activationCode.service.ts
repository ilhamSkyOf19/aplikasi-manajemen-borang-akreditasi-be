import { gte } from "zod";
import prisma from "../libs/prisma";
import {
  ResponseActivationType,
  toResponseActivationType,
} from "../models/activationCode.model";
import { DosenRole } from "../utils/contstanst";

export class ActivationCodeService {
  // create code
  static async create(params: {
    code: number;
    dosen_id: number;
  }): Promise<ResponseActivationType | null> {
    const { code, dosen_id } = params;

    const AddFiveMinutes = new Date(Date.now() + 5 * 60 * 1000);

    //  upsert
    const result = await prisma.activationCode.upsert({
      where: {
        dosen_id,
      },
      create: {
        code: code.toString(),
        dosen_id,
        expired_at: AddFiveMinutes,
      },
      update: {
        code: code.toString(),
        expired_at: AddFiveMinutes,
      },
      select: {
        id: true,
        expired_at: true,
        dosen: {
          select: {
            id: true,
            nama: true,
            email: true,
            nidn: true,
          },
        },
      },
    });

    // check result
    if (!result) return null;

    return toResponseActivationType({
      expire_at: result.expired_at,
      id: result.id,
      dosen: result.dosen,
    });
  }

  //   check expired code
  static async checkExpired(params: { dosen_id: number }): Promise<boolean> {
    const { dosen_id } = params;

    // call db
    const result = await prisma.activationCode.findFirst({
      where: {
        dosen_id,
        expired_at: {
          gte: new Date(),
        },
      },
    });

    // check result
    if (!result) return false;

    return true;
  }

  //   resend
  static async resend(params: {
    dosen_id: number;
    code: number;
  }): Promise<ResponseActivationType | null> {
    const { dosen_id, code } = params;

    // add 5 minutes
    const AddFiveMinutes = new Date(Date.now() + 5 * 60 * 1000);

    const result = await prisma.activationCode.update({
      where: {
        dosen_id,
      },
      data: {
        code: code.toString(),
        expired_at: AddFiveMinutes,
      },
      select: {
        id: true,
        expired_at: true,
        dosen: {
          select: {
            id: true,
            nama: true,
            email: true,
            nidn: true,
          },
        },
      },
    });

    // check result
    if (!result) return null;

    return toResponseActivationType({
      expire_at: result.expired_at,
      id: result.id,
      dosen: result.dosen,
    });
  }

  //   find activation code  by email , activation code, and expired
  static async findActivationCode(params: {
    code: number;
    dosen_id: number;
  }): Promise<ResponseActivationType | null> {
    const { code, dosen_id } = params;

    // call db
    const result = await prisma.activationCode.findFirst({
      where: {
        code: code.toString(),
        dosen_id,
        expired_at: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        expired_at: true,
        dosen: {
          select: {
            id: true,
            nama: true,
            email: true,
            nidn: true,
          },
        },
      },
    });

    // check result
    if (!result) return null;

    return toResponseActivationType({
      expire_at: result.expired_at,
      id: result.id,
      dosen: result.dosen,
    });
  }

  // find by reset token
  static async findByResetToken(params: {
    reset_token: string;
  }): Promise<ResponseActivationType | null> {
    const { reset_token } = params;
    const result = await prisma.activationCode.findFirst({
      where: {
        reset_token,
      },
      select: {
        id: true,
        expired_at: true,
        dosen: {
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
          },
        },
      },
    });

    // check result
    if (!result) return null;

    // return
    return toResponseActivationType({
      expire_at: result.expired_at,
      id: result.id,
      dosen: {
        ...result.dosen,
        roles: result.dosen.dosenRole.map((role) => role.role) as DosenRole[],
      },
    });
  }

  // update reset token
  static async updateResetToken(params: {
    id: number;
    reset_token: string;
  }): Promise<ResponseActivationType | null> {
    const { id, reset_token } = params;
    const result = await prisma.activationCode.update({
      where: {
        id,
      },
      data: {
        code: "",
        reset_token,
      },
      select: {
        id: true,
        expired_at: true,
        dosen: {
          select: {
            id: true,
            nama: true,
            email: true,
            nidn: true,
          },
        },
      },
    });

    // check result
    if (!result) return null;
    return toResponseActivationType({
      expire_at: result.expired_at,
      id: result.id,
      dosen: result.dosen,
    });
  }

  // delete by dosen id
  static async delete(params: { dosen_id: number }): Promise<boolean> {
    const { dosen_id } = params;
    const result = await prisma.activationCode.delete({
      where: {
        dosen_id,
      },
    });
    if (!result) return false;
    return true;
  }
}
