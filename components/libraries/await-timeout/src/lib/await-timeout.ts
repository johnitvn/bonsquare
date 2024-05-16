export const awaitTimeout = async <T>(
  promise: Promise<T>,
  options: { timeout?: number; message?: string }
): Promise<T> => {
  let timeoutId: undefined | NodeJS.Timeout;
  try {
    const timeoutPromise = new Promise<T>((_resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${options.message ?? 'Timeout!'}. Duration: ${options.timeout ?? 5000}ms`));
      }, options.timeout ?? 5000);
    });
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    timeoutId && clearTimeout(timeoutId);
  }
};
