import { BadRequestException, Logger, ValidationPipe, type ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import type { Env } from './config/env.js';

function collectFieldErrors(errors: ValidationError[], prefix: string, into: Record<string, string>): void {
  for (const error of errors) {
    const path = prefix ? `${prefix}.${error.property}` : error.property;
    const [first] = Object.values(error.constraints ?? {});
    if (first) into[path] = error.value === undefined || error.value === null ? 'Bu alan zorunludur.' : first;
    if (error.children?.length) collectFieldErrors(error.children, path, into);
  }
}

function toBadRequest(errors: ValidationError[]): BadRequestException {
  const fieldErrors: Record<string, string> = {};
  collectFieldErrors(errors, '', fieldErrors);
  return new BadRequestException({ message: 'Gönderilen veriler geçersiz.', fieldErrors });
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  // Behind nginx the client address comes from X-Forwarded-For; without this every visitor shares the proxy's address
  // (one rate-limit bucket, one IP hash).
  const proxies = config.get('TRUST_PROXY', { infer: true });
  if (proxies > 0) app.getHttpAdapter().getInstance().set('trust proxy', proxies);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors({ origin: config.get('CORS_ORIGINS', { infer: true }) });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: toBadRequest }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = config.get('PORT', { infer: true });
  await app.listen(port);
  new Logger('Bootstrap').log(`API hazır: http://localhost:${port}/api`);
}

await bootstrap();
