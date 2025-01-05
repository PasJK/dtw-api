import { Pagination } from "./interface/response.interface";

export const getPaginationOffset = async (page: number, perPage: number) => {
    const offset = perPage * (page - 1);
    return Math.max(offset, 0);
};

export const getPagination = async (
    page: number,
    perPage: number,
    total: number,
    totalRecord: number,
): Promise<Pagination> => {
    const totalPage = Math.ceil(totalRecord / perPage);

    return {
        page,
        perPage,
        total,
        totalRecord,
        totalPage,
    };
};
