export interface ICheckRepository {

    checkIn(): Promise<string>;

    checkOut(): Promise<string>;

    getConcurrency(): Promise<number>;

    isUserInside(): Promise<boolean>;
}