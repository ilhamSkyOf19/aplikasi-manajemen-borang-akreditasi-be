import { SortOrder } from "../utils/contstanst";

export interface PaginationType {
  page?: number;
  limit?: number;
  search?: string;
  sort?: SortOrder;
}
