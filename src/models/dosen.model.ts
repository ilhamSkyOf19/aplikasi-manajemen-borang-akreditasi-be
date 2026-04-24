import { DosenRole, MetaType } from "../utils/contstanst";

export interface IDosen {
  id: number;
  nama: string;
  email: string;
  nidn: string;
  password: string;
  role: DosenRole;
  created_at: Date;
  updated_at: Date;
}

// create user model
export interface CreateDosenType extends Omit<
  IDosen,
  "id" | "created_at" | "updated_at"
> {
  confirmPassword: string;
}

// update user model
export interface UpdateDosenType extends Partial<
  Omit<CreateDosenType, "role" | "confirmPassword">
> {
  role?: Exclude<DosenRole, DosenRole.wakil_dekan_1>;
}

// login type
export interface LoginDosenType extends Pick<IDosen, "password"> {
  identifier: string;
}

// payload
export interface PayloadDosenType extends Omit<
  IDosen,
  "password" | "created_at" | "updated_at"
> {}

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
