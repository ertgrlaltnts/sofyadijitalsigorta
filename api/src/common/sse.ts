import { Logger } from '@nestjs/common';
import type { Response } from 'express';

const logger = new Logger('SSE');

export interface SseEvent {
  type: string;
}

export async function pipeSse<T extends SseEvent>(res: Response, events: AsyncGenerator<T>): Promise<void> {
  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const write = (event: SseEvent): void => {
    res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
  };

  try {
    for await (const event of events) {
      if (res.destroyed) break;
      write(event);
    }
  } catch (error) {
    logger.error('Stream beklenmedik şekilde sonlandı', error instanceof Error ? error.stack : String(error));
    if (!res.destroyed) write({ type: 'error', message: 'Bir sorun oluştu. Lütfen tekrar deneyin.' } as SseEvent & { message: string });
  } finally {
    await events.return(undefined as never);
    res.end();
  }
}
