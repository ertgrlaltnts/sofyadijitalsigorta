import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({ collection: 'admins', timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export type AdminDocument = HydratedDocument<Admin>;
export const AdminSchema = SchemaFactory.createForClass(Admin);
