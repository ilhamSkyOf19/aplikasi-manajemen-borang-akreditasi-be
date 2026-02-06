import { Request } from "express";

export interface AuthRequest<
  params = {},
  _ = {},
  body = {},
  query = {},
> extends Request<params, _, body, query> {
  data?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
