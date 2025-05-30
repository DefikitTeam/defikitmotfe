import { ErrorResponse, Pagination } from './api/api';

declare global {
  type AppErrorResponse = ErrorResponse;
  type MdsPagination<T> = Pagination<T>;
  type Option<T> = {
    label: string;
    value: T;
  };
}
