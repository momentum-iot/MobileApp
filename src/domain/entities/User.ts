export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum Membership {
    BASICO = "BASICO",
    PREMIUM = "PREMIUM"
}

export enum Status {
    ACTIVO = "ACTIVO",
    RETIRADO = "RETIRADO",
    SIN_PAGAR = "SIN_PAGAR"
}

export interface User {
    id: number;
    name: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    age?: number;
    email:string;
    role: Role;
    membership?: Membership;
    status: Status;
    joinDate: string;
    joinHour: String;
    birthday?: String;
    emergencyContact?: String;
    height: number;
    weight: number;
    avatar?: string;
}