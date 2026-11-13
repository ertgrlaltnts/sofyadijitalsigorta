import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminsService } from '../admins/admins.service.js';
import type { Env } from '../config/env.js';
import type { AuthUser, JwtPayload } from './auth.types.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService<Env, true>,
    private readonly admins: AdminsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET', { infer: true }),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const admin = await this.admins.findById(payload.sub);
    if (!admin?.isActive) throw new UnauthorizedException('Oturum geçersiz.');
    return { id: admin.id as string, email: admin.email, name: admin.name };
  }
}
