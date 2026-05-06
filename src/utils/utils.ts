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
