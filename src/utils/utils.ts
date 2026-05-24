import { Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { SortOrder } from "../../generated/prisma/internal/prismaNamespace";
import { DosenRole, Status } from "./contstanst";

// check exist same data
const isFilled = (value: unknown): boolean => {
  return value !== undefined && value !== null && value !== "";
};

export const checkBothFilled = (
  firstData: unknown,
  secondData: unknown,
  res: Response<ResponseStructure<null>>,
) => {
  if (isFilled(firstData) && isFilled(secondData)) {
    return ResponseResult.error(
      res,
      400,
      "Data lama dan data baru tidak boleh diisi bersamaan",
    );
  }

  if (!isFilled(firstData) && !isFilled(secondData)) {
    return ResponseResult.error(
      res,
      400,
      "Data lama dan data baru harus diisi salah satu",
    );
  }

  return null;
};

export const getPriorityStatusKaprodi = (
  oldStatus: Status | null,
  newStatus: Status | null,
): Status | null => {
  if (!oldStatus && !newStatus) return null;
  if (oldStatus && !newStatus) return oldStatus;
  if (!oldStatus && newStatus) return newStatus;

  if (oldStatus === Status.REVISION || newStatus === Status.REVISION) {
    return Status.REVISION;
  }

  if (oldStatus === Status.PENDING || newStatus === Status.PENDING) {
    return Status.PENDING;
  }

  return Status.APPROVED;
};

export const getPriorityStatusKaprodiForDokumentasiBorang = (
  oldStatus: Status | null,
  newStatus: Status | null,
): Status | null => {
  if (!oldStatus && !newStatus) return null;
  if (oldStatus && !newStatus) return oldStatus;
  if (!oldStatus && newStatus) return newStatus;

  if (oldStatus === Status.PENDING || newStatus === Status.PENDING) {
    return Status.PENDING;
  }

  if (oldStatus === Status.REVISION || newStatus === Status.REVISION) {
    return Status.REVISION;
  }

  return Status.APPROVED;
};

export const getPriorityStatusWakilDekan = (
  oldStatus: Status | null,
  newStatus: Status | null,
): Status | null => {
  if (!oldStatus && !newStatus) return null;
  if (oldStatus && !newStatus) return oldStatus;
  if (!oldStatus && newStatus) return newStatus;

  if (oldStatus === Status.PENDING || newStatus === Status.PENDING) {
    return Status.PENDING;
  }

  if (oldStatus === Status.REVISION || newStatus === Status.REVISION) {
    return Status.REVISION;
  }

  return Status.APPROVED;
};

// tim akreditasi
export const getPriorityStatusTimAkreditasi = (
  oldStatus: Status | null | undefined,
  newStatus: Status | null | undefined,
): Status | null => {
  // 1. Prioritas pertama: revisi
  if (oldStatus === Status.REVISION || newStatus === Status.REVISION) {
    return Status.REVISION;
  }

  // 2. Prioritas kedua: null atau undefined
  if (oldStatus == null || newStatus == null) {
    return null;
  }

  // 3. Prioritas ketiga: pending
  if (oldStatus === Status.PENDING || newStatus === Status.PENDING) {
    return Status.PENDING;
  }

  // 4. Terakhir: approved
  return Status.APPROVED;
};

// expired date
export const ExpiredMinutesAgo = new Date(Date.now() + 5 * 60 * 1000);

// generate code
export const generateCode = (): number => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code;
};
