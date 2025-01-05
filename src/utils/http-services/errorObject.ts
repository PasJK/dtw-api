import { ServiceStatusInterface } from "./interfaces/serviceStatus.interface";

export class ErrorObject<T> extends Error {
    serviceStatus: ServiceStatusInterface<T>;

    constructor(serviceStatus: ServiceStatusInterface<T>) {
        super();
        this.serviceStatus = serviceStatus;
    }
}
