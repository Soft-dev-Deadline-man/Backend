import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  readonly password: string;
  readonly email: string;
  readonly profile: string;
  readonly name: string;
  readonly bio: string;
  readonly role: UserRole;
  readonly bookmark: string[];
  readonly postedBlogs: string[];
}
