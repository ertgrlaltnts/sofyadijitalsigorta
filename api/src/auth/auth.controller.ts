import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService, type LoginResult } from './auth.service.js';
import type { AuthUser } from './auth.types.js';
import { CurrentUser } from './current-user.decorator.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

class LoginDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta girin.' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Şifre gerekli.' })
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.auth.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser): AuthUser {
    return user;
  }
}
