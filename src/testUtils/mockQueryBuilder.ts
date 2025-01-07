import { Repository, SelectQueryBuilder } from "typeorm";

const mockQueryBuilder: Partial<SelectQueryBuilder<unknown>> = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue(undefined),
    getRawMany: jest.fn().mockResolvedValue(undefined),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
};

export const createMockRepository = <T>(): Partial<Repository<T>> => {
    return {
        createQueryBuilder: jest.fn(() => mockQueryBuilder as SelectQueryBuilder<T>),
        create: jest.fn(),
        query: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        preload: jest.fn(),
    };
};
