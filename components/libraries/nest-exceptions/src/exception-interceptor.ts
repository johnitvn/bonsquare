import { NestLogger } from '@bonsquare/nest-logger';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private logger = new NestLogger(ExceptionInterceptor.name);

  constructor(private readonly i18n: I18nService) {
    this.logger.debug('Instance initialized');
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const handler = next.handle();
    if (context.getType() == 'rpc') {
      // in rpc context (microservice) we will try to convert http exception to rpc exception
      return this.handleRpcContext(handler);
    } else if (context.getType() == 'http') {
      // in http context (api gateway) we will convert rpc exception to http exception
      return this.handleHttpContext(handler);
    }
    return handler;
  }

  /**
   *
   * On Rpc Context (this is grpc microservice). We will use HttpExceptions and these HttpExceptions will be
   * converted to RPCExceptions so that Api Gateway, when receiving these errors, can convert them again into
   * HTTP Exceptions and return them to the client.
   *
   * @param handler
   * @returns
   */
  handleRpcContext(handler: Observable<any>): Observable<any> | Promise<Observable<any>> {
    return handler.pipe(
      catchError((err) => {
        if (!(err instanceof HttpException)) return throwError(() => err);
        this.logger.debug?.('Convert HTTP Exception to GPRC Exception', ExceptionInterceptor.name);
        const message = {
          status: err.getStatus(),
          description:
            typeof err.getResponse() == 'object' && Object.keys(err.getResponse()).includes('description')
              ? (err.getResponse() as Record<string, any>)['description']
              : undefined
        };
        this.logger.verbose({ message: `Gprc exception details`, details: message });
        return throwError(() => new RpcException({ message: JSON.stringify(message), code: Status.UNKNOWN }));
      })
    );
  }

  handleHttpContext(handler: Observable<any>): Observable<any> | Promise<Observable<any>> {
    return handler.pipe(
      catchError((err) => {
        if (!this.isGprcError(err)) return throwError(() => err);
        const details = this.tryParseDetail(err.details);
        if (!details) return throwError(() => err);

        this.logger.debug?.('Convert GPRC Exception to HTTP Exception', ExceptionInterceptor.name);

        const status = details['status'] ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const description = details['description'];

        this.logger.verbose({ message: 'HttpException result', exception: { status, description } });

        return throwError(() => new HttpException({ description }, status));
      })
    );
  }

  private isGprcError(err: any): boolean {
    return typeof err == 'object' && err.code && err.metadata && err.details;
  }

  private tryParseDetail(str: string): { [key: string]: any } | undefined {
    try {
      return JSON.parse(str);
    } catch (e) {
      return undefined;
    }
  }
}
