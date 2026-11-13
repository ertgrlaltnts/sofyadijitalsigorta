import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AdminsService } from '../admins/admins.service.js';
import type { AuthUser, JwtPayload } from './auth.types.js';

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly admins: AdminsService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const admin = await this.admins.findByEmail(email);
    const valid = admin?.isActive && (await bcrypt.compare(password, admin.passwordHash));
    if (!admin || !valid) throw new UnauthorizedException('E-posta veya şifre hatalı.');

    await this.admins.touchLogin(admin.id as string);
    const payload: JwtPayload = { sub: admin.id as string, email: admin.email };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: { id: admin.id as string, email: admin.email, name: admin.name },
    };
  }
}
