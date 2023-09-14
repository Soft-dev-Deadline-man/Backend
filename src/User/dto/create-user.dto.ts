import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  readonly password: string;
  readonly email: string;
  readonly profile: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly role: UserRole;
}
