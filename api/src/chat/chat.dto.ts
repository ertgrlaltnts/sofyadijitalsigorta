import { Transform } from 'class-transformer';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class ChatRequestDto {
  @Matches(/^[\w-]{8,64}$/, { message: 'Geçersiz oturum kimliği.' })
  sessionId: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Mesaj boş olamaz.' })
  @MaxLength(1000, { message: 'Mesaj en fazla 1000 karakter olabilir.' })
  message: string;
}

export class FeedbackDto {
  @IsMongoId({ message: 'Geçersiz mesaj kimliği.' })
  messageId: string;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsIn(['up', 'down'], { message: 'Geçersiz geri bildirim.' })
  feedback: 'up' | 'down' | null;
}
