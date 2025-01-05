export interface Pagination {
    page: number;
    perPage: number;
    total: number;
    totalRecord: number;
    totalPage: number;
}

export interface ResultWithPagination<T> {
    data: T[];
    meta: Pagination;
}
