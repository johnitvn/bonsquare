import { isFunction } from '@nestjs/common/utils/shared.utils';
import { Observable, isObservable } from 'rxjs';

/**
 * Try to run job and get error and result
 * @param job
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function runJob(job: Function | Promise<unknown> | Observable<unknown>) {
  let result, error;
  try {
    if (isFunction(job)) {
      result = job();
    } else if (isObservable(job)) {
      result = await job.toPromise();
    } else {
      result = await job;
    }
  } catch (err) {
    error = err;
  }
  return { error, result };
}
