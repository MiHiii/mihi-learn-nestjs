import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
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
  login(user: any) {
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
}
