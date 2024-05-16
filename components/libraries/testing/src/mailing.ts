import { awaitTimeout } from '@bonsquare/await-timeout';
import { sleep } from '@bonsquare/sleep';
import axios from 'axios';

// Define the Email type, representing email response from MailDev
export type Email = {
  id: string;
  headers: { [key: string]: string };
  subject: string;
  html?: string;
  text?: string;
  date?: string;
  time?: string;
  source?: string;
  size?: string;
  read: boolean;
};

// Define the MailDevOptions type, representing optional configuration for MailDev
export type MailDevOptions = {
  url?: string;
};

/**
 * Function to fetch emails from MailDev based on query parameters
 * @param params
 * @param options
 * @returns
 */
export async function getEmails(params: string, options?: MailDevOptions) {
  const baseUrl = options?.url ?? 'http://localhost:1080';
  const axiosInstance = axios.create();
  const url = `${baseUrl}/email${params ? `?${params}` : ''}`;
  const response = await axiosInstance.get(url);
  return response.data;
}

/**
 * Function to wait for emails to arrive at a specified address
 * @param address
 * @param options
 * @returns
 */
export async function waitEmails(
  address: string,
  options?: MailDevOptions & {
    timeout?: number;
    inverval?: number;
  }
): Promise<Array<Email>> {
  return awaitTimeout<Array<Email>>(
    // eslint-disable-next-line no-async-promise-executor
    new Promise<Array<Email>>(async (resolve, reject) => {
      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          // create new instance for ensure no base url overwrite
          const emails = await getEmails(`headers.to=${address}`, options);
          if (emails.length > 0) {
            resolve(emails);
            break;
          }
          await sleep(options?.inverval ?? 200);
        }
      } catch (err) {
        reject(err);
      }
    }),
    { timeout: options?.timeout, message: 'Not found email after timeout' }
  );
}

/**
 * Function to wait for a single email to arrive at a specified address
 * @param address
 * @param options
 * @returns
 */
export async function waitEmail(
  address: string,
  options?: MailDevOptions & {
    timeout?: number;
    inverval?: number;
  }
): Promise<Email> {
  const emails = await waitEmails(address, options);
  return emails[0];
}
