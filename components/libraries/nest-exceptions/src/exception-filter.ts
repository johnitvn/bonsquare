import { NestLogger } from '@bonsquare/nest-logger';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private logger = new NestLogger(ExceptionsFilter.name);

  constructor(private translater: I18nService) {
    this.logger.debug('Instance initialized', ExceptionsFilter.name);
  }

  catch(exception: any, host: ArgumentsHost): void {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      // const request = ctx.getRequest<Request>();
      let status: number, description: any;

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        description = this.getHttpExceptionDescription(exception);
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      const message = this.translater.translate(`http.${status}`);

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.fatal(exception);
      } else if (status > 500) {
        this.logger.error(exception);
      } else {
        this.logger.warn(exception);
      }

      response
        .status(status) //
        .send({
          message,
          description
        });
    } else {
      // TODO make logger for RPC context
      this.logger.error(exception);
    }
  }

  private getHttpExceptionDescription(exception: HttpException) {
    if (typeof exception.getResponse() === 'object' && Object.keys(exception.getResponse()).includes('description')) {
      return (exception.getResponse() as Record<string, any>)['description'];
    } else {
      return undefined;
    }
  }
}
