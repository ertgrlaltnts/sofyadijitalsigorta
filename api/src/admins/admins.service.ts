import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import type { Model } from 'mongoose';
import { definedOnly } from '../common/defined-only.js';
import { Admin, type AdminDocument } from './admin.schema.js';
import type { CreateAdminDto, UpdateAdminDto } from './admins.dto.js';

export interface AdminView {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export function toAdminView(admin: AdminDocument): AdminView {
  return {
    id: admin.id as string,
    email: admin.email,
    name: admin.name,
    isActive: admin.isActive,
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt,
  };
}

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private readonly model: Model<Admin>) {}

  async list(): Promise<AdminView[]> {
    const admins = await this.model.find().sort({ createdAt: 1 });
    return admins.map(toAdminView);
  }

  findByEmail(email: string): Promise<AdminDocument | null> {
    return this.model.findOne({ email: email.toLowerCase() });
  }

  findById(id: string): Promise<AdminDocument | null> {
    return this.model.findById(id);
  }

  async create(dto: CreateAdminDto): Promise<AdminView> {
    const email = dto.email.toLowerCase();
    if (await this.model.exists({ email })) {
      throw new ConflictException('Bu e-posta ile kayıtlı bir yönetici zaten var.');
    }
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const admin = await this.model.create({ email, name: dto.name, passwordHash });
    return toAdminView(admin);
  }

  async update(id: string, dto: UpdateAdminDto): Promise<AdminView> {
    const admin = await this.model.findByIdAndUpdate(id, definedOnly(dto), { returnDocument: 'after' });
    if (!admin) throw new NotFoundException('Yönetici bulunamadı.');
    return toAdminView(admin);
  }

  async changePassword(id: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const admin = await this.model.findByIdAndUpdate(id, { passwordHash });
    if (!admin) throw new NotFoundException('Yönetici bulunamadı.');
  }

  async touchLogin(id: string): Promise<void> {
    await this.model.updateOne({ _id: id }, { lastLoginAt: new Date() });
  }

  async ensureSeedAdmin(email: string, password: string): Promise<boolean> {
    if (await this.model.exists({ email })) return false;
    await this.create({ email, name: 'Sofya Yönetici', password });
    return true;
  }
}
