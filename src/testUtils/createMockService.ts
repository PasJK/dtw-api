import { jest } from "@jest/globals";

export function createMockService<T extends object>(service: new (...args: unknown[]) => T): jest.Mocked<T> {
    const mock: unknown = {};

    Object.getOwnPropertyNames(service.prototype).forEach(prop => {
        if (typeof service.prototype[prop] === "function") {
            mock[prop] = jest.fn();
        }
    });

    return mock as jest.Mocked<T>;
}
