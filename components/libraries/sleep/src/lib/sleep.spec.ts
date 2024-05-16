import { sleep } from './sleep';

describe('sleep', () => {
  test('it should resolve after specified time', async () => {
    const startTime = Date.now();
    const delay = 1000; // Delay for 1 second

    await sleep(delay);

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    // We allow a small margin of difference (e.g., 30ms) to account for the accuracy of the sleep function
    expect(elapsedTime).toBeGreaterThanOrEqual(delay - 30);
    expect(elapsedTime).toBeLessThanOrEqual(delay + 30);
  });
});
