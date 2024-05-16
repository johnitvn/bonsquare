import { NestLogger } from '@bonsquare/nest-logger';
import {
  HttpExceptionOptions,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe
} from '@nestjs/common';

function generateErrors(errors: ValidationError[]): HttpExceptionOptions {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', ')
    }),
    {}
  );
}

export class ClassValidationPipe extends ValidationPipe {
  private readonly logger = new NestLogger(ClassValidationPipe.name);

  constructor() {
    super({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        const response = {
          description: generateErrors(errors)
        };
        return new UnprocessableEntityException(response);
      }
    });
    this.logger.debug('Instance initialized ');
  }
}
