import { MetaType, UserRole } from "../utils/contstanst";
import { ITimAkreditasi } from "./timAkreditasi.model";

export interface IUser {
  id: number;
  nama: string;
  email: string;
  password: string;
  tims: Omit<ITimAkreditasi, "user">[];
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// create user model
export interface CreateUserType extends Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "tims"
> {
  confirmPassword: string;
}

// update user model
export interface UpdateUserType extends Partial<
  Omit<CreateUserType, "role" | "confirmPassword">
> {
  role?: Exclude<UserRole, UserRole.wakil_dekan_1>;
}

// login type
export interface LoginUserType extends Pick<IUser, "password"> {
  identifier: string;
}

// payload
export interface PayloadUserType extends Omit<
  IUser,
  "password" | "createdAt" | "updatedAt" | "tims"
> {}

// response user model
export interface ResponseUserType extends Omit<IUser, "password"> {}

// toresponse user model
export const toUserResponse = (
  user: Omit<IUser, "password">,
): ResponseUserType => {
  const { ...userResponse } = user;
  return userResponse;
};

// response with meta
export interface ResponseUserWithMetaType {
  data: ResponseUserType[];
  meta: MetaType;
}

// to response
export const toResponseUserWithMetaType = (
  user: ResponseUserWithMetaType,
): ResponseUserWithMetaType => user;
