import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  message: string;
  errors?: string[];
  fieldErrors?: Record<string, string>;
  path: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body: ErrorBody = {
      statusCode: status,
      message: 'Beklenmeyen bir hata oluştu.',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === 'string') {
        body.message = payload;
      } else {
        const { message, fieldErrors } = payload as { message?: string | string[]; fieldErrors?: Record<string, string> };
        if (fieldErrors) body.fieldErrors = fieldErrors;
        if (Array.isArray(message)) {
          body.message = 'Gönderilen veriler geçersiz.';
          body.errors = message;
        } else if (message) {
          body.message = message;
        }
      }
    }

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : String(exception));
    }

    if (response.headersSent) {
      response.end();
      return;
    }
    response.status(status).json(body);
  }
}
