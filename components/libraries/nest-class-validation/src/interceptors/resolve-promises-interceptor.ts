import { NestLogger } from '@bonsquare/nest-logger';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

async function deepResolvePromises(input: unknown): Promise<unknown> {
  if (input instanceof Promise) {
    return await input;
  }

  if (Array.isArray(input)) {
    const resolvedArray = await Promise.all(input.map(deepResolvePromises));
    return resolvedArray;
  }

  if (input instanceof Date) {
    return input;
  }

  if (typeof input === 'object' && input !== null) {
    const keys = Object.keys(input);
    const resolvedObject: { [key: string]: unknown } = {};

    for (const key of keys) {
      const resolvedValue = await deepResolvePromises((input as { [key: string]: unknown })[key]);
      resolvedObject[key] = resolvedValue;
    }

    return resolvedObject;
  }

  return input;
}

@Injectable()
export class ResolvePromisesInterceptor implements NestInterceptor {
  private logger = new NestLogger(ResolvePromisesInterceptor.name);

  constructor() {
    this.logger.debug?.('Instance initialized');
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => deepResolvePromises(data)));
  }
}
