import { DosenRole, MetaType } from "../utils/contstanst";

export interface IDosen {
  id: number;
  nama: string;
  email: string;
  nidn: string;
  password: string;
  roles: DosenRole[];
  created_at: Date;
  updated_at: Date;
}

// create user model
export interface CreateDosenType extends Omit<
  IDosen,
  "id" | "created_at" | "updated_at" | "roles"
> {
  confirmPassword: string;
  roles: DosenRole[];
}

// update user model
export interface UpdateDosenType extends Partial<
  Omit<CreateDosenType, "confirmPassword">
> {}

// login type
export interface LoginDosenType extends Pick<IDosen, "password"> {
  identifier: string;
}

export interface UpdatePasswordType {
  newPassword: string;
  confirmNewPassword: string;
  oldPassword: string;
}

export interface UpdateSelfDataType {
  nama?: string;
  email?: string;
  nidn?: string;
}
// payload
export interface PayloadDosenType extends Omit<
  IDosen,
  "password" | "created_at" | "updated_at" | "roles"
> {
  role: DosenRole;
}

export interface PayloadDosenForAuthMeType extends Omit<
  IDosen,
  "password" | "created_at" | "updated_at" | "roles"
> {
  role: DosenRole;
  haveRoles: DosenRole[];
}

// response user model
export interface ResponseDosenType extends Omit<IDosen, "password"> {}

// toresponse user model
export const toDosenResponse = (
  dosen: Omit<IDosen, "password">,
): ResponseDosenType => {
  const { ...dosenResponse } = dosen;
  return dosenResponse;
};

// response with meta
export interface ResponseDosenWithMetaType {
  data: ResponseDosenType[];
  meta: MetaType;
}

// to response
export const toResponseDosenWithMeta = (
  dosen: ResponseDosenWithMetaType,
): ResponseDosenWithMetaType => dosen;

// response choose
export interface ResponseDosenChooseWithMetaType {
  data: Pick<IDosen, "id" | "nama">[];
  meta: MetaType;
}

// reset password
export interface ResetPasswordType {
  password: string;
  confirmPassword: string;
}
