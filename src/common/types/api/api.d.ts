export interface ErrorResponse {
  title: string;
  status: number;
  statusText: string;
  detail: string;
  instance: string;
  errorCode: string;
  data: unknown;
}
interface Pagination<T> {
  page: number;
  totalPage: number;
  items: T[];
  totalItem: number;
}

export interface PaginationReq<T> {
  page?: number;
  size?: number;
  data: T;
}
