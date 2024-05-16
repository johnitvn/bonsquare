import { of, throwError } from 'rxjs';
import { runJob } from './runner';

describe('runJob', () => {
  it('should run a function and return its result', async () => {
    const job = () => 'test result';
    const { error, result } = await runJob(job);
    expect(error).toBeUndefined();
    expect(result).toBe('test result');
  });

  it('should handle error thrown by a function', async () => {
    const job = () => {
      throw new Error('test error');
    };
    const { error, result } = await runJob(job);
    expect(result).toBeUndefined();
    expect(error).toEqual(new Error('test error'));
  });

  it('should run a promise and return its resolved value', async () => {
    const job = Promise.resolve('test result');
    const { error, result } = await runJob(job);
    expect(error).toBeUndefined();
    expect(result).toBe('test result');
  });

  it('should handle a rejected promise', async () => {
    const job = Promise.reject(new Error('test error'));
    const { error, result } = await runJob(job);
    expect(result).toBeUndefined();
    expect(error).toEqual(new Error('test error'));
  });

  it('should run an observable and return its emitted value', async () => {
    const job = of('test result');
    const { error, result } = await runJob(job);
    expect(error).toBeUndefined();
    expect(result).toBe('test result');
  });

  it('should handle an observable that emits an error', async () => {
    const job = throwError(() => new Error('test error'));
    const { error, result } = await runJob(job);
    expect(result).toBeUndefined();
    expect(error).toEqual(new Error('test error'));
  });
});
