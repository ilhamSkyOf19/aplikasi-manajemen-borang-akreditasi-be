import { Request } from "express";
import { DosenRole } from "../utils/contstanst";

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
    role: DosenRole;
  };
  periode?: {
    id: number;
  };
}
