import { UserRole } from "../utils/contstanst";

export interface IUser {
  id: number;
  nama: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// create user model
export interface CreateUserType extends Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "role"
> {}

// login type
export interface LoginUserType extends Pick<IUser, "password"> {
  identifier: string;
}

// payload
export interface PayloadUserType extends Omit<
  IUser,
  "password" | "createdAt" | "updatedAt"
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
