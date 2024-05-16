import { awaitTimeout } from './await-timeout';

describe('awaitTimeout', () => {
  test('it should resolve with the value from the promise if it resolves before timeout', async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Resolved');
      }, 500);
    });
    const result = await awaitTimeout(promise, { timeout: 1000 });
    expect(result).toEqual('Resolved');
  });

  test('it should reject with a timeout error if the promise does not resolve before timeout', async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Resolved');
      }, 1500);
    });

    await expect(awaitTimeout(promise, { timeout: 1000 })).rejects.toThrow('Timeout');
  });

  test('it should reject with the error from the promise if it rejects before timeout', async () => {
    const promise = new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Promise rejected'));
      }, 500);
    });
    await expect(awaitTimeout(promise, { timeout: 1000 })).rejects.toThrow('Promise rejected');
  });
});
