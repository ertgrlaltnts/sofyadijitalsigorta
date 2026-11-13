import { BadRequestException } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

export interface ExtractedDocument {
  title: string;
  content: string;
}

export interface UploadedDocument {
  originalname: string;
  buffer: Buffer;
}

export async function extractDocument(file: UploadedDocument): Promise<ExtractedDocument> {
  const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
  const extension = fileName.split('.').pop()?.toLowerCase();
  const title = fileName.replace(/\.[^.]+$/, '');

  let content: string;
  if (extension === 'txt' || extension === 'md') {
    content = file.buffer.toString('utf8');
  } else if (extension === 'pdf') {
    const parser = new PDFParse({ data: new Uint8Array(file.buffer) });
    try {
      content = (await parser.getText()).text;
    } catch {
      throw new BadRequestException('PDF dosyası okunamadı.');
    } finally {
      await parser.destroy();
    }
  } else {
    throw new BadRequestException('Sadece .txt, .md ve .pdf dosyaları desteklenir.');
  }

  content = content.replace(/\r\n/g, '\n').trim();
  if (!content) throw new BadRequestException('Dosyadan metin çıkarılamadı.');
  return { title, content };
}
