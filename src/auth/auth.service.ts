import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const isValid = await this.userService.isValidPassword(
        pass,
        user.password,
      );
      if (isValid) {
        return user;
      }
    }

    return null;
  }
}
