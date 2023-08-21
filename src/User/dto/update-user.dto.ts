import { UserRole } from "../schemas/user.schema";


export class UpdateUserDto {
    readonly username: string;
    readonly password: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly role: UserRole;
}