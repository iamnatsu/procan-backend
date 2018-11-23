export class Audit {
    create: Operation;
    modify: Operation;
}

export class Operation {
    operator: Opeartor;
    at: Date;
}

export class Opeartor {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export enum CRUD {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}