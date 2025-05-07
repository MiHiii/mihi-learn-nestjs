import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorator/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from '../users/users.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLogin(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req: { user: User }) {
    return req.user;
  }
}
