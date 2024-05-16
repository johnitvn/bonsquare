import axios from 'axios';
import { Email, getEmails, waitEmail, waitEmails } from './mailing';

jest.mock('axios');

describe('mailling', () => {
  describe('getEmails function', () => {
    it('fetches emails successfully', async () => {
      const mockedEmails = [
        { id: 1, subject: 'Test Email 1', body: 'This is a test email 1' },
        { id: 2, subject: 'Test Email 2', body: 'This is a test email 2' }
      ];

      (axios.create as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockResolvedValueOnce({ data: mockedEmails })
      });

      const emails = await getEmails('');
      expect(emails).toEqual(mockedEmails);
    });

    it('fetches emails with params successfully', async () => {
      const mockedEmails = [{ id: 1, subject: 'Test Email 1', body: 'This is a test email 1' }];

      const params = 'unread=true';

      (axios.create as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockResolvedValueOnce({ data: mockedEmails })
      });

      const emails = await getEmails(params);
      expect(emails).toEqual(mockedEmails);
    });

    it('handles errors during fetching emails', async () => {
      const errorMessage = 'Network Error';

      (axios.create as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockRejectedValueOnce(new Error(errorMessage))
      });

      await expect(getEmails('')).rejects.toThrow(errorMessage);
    });
  });

  describe('waitEmails function', () => {
    it('waits for emails successfully', async () => {
      const mockedEmails: Email[] = [
        {
          id: '2JGgiG43',
          subject: 'Test email',
          html: 'This is a test email 1',
          headers: {},
          read: false
        }
      ];

      (axios.create as jest.Mock).mockReturnValue({
        get: jest.fn().mockImplementation((url: string) => {
          if (url.includes('headers.to=test@example.com')) {
            return Promise.resolve({ data: mockedEmails });
          }
          return Promise.resolve({ data: [] });
        })
      });

      const email = await waitEmails('test@example.com', { timeout: 1000 });
      expect(email).toEqual(mockedEmails);
    });

    it('throws error when timeout', async () => {
      const mockedEmails: Email[] = [];

      (axios.create as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValueOnce({ data: mockedEmails })
      });

      await expect(waitEmails('test@example.com', { timeout: 100 })).rejects.toThrowError(
        'Not found email after timeout. Duration: 100ms'
      );
    });
  });

  describe('waitEmail function', () => {
    it('waits for single email successfully', async () => {
      const mockedEmails: Email[] = [
        {
          id: '2JGgiG43',
          subject: 'Test email',
          html: 'This is a test email 1',
          headers: {},
          read: false
        }
      ];

      (axios.create as jest.Mock).mockReturnValue({
        get: jest.fn().mockImplementation((url: string) => {
          if (url.includes('headers.to=test@example.com')) {
            return Promise.resolve({ data: mockedEmails });
          }
          return Promise.resolve({ data: [] });
        })
      });

      const email = await waitEmail('test@example.com', { timeout: 1000 });
      expect(email).toEqual(mockedEmails[0]);
    });

    it('throws error when timeout waiting for single email', async () => {
      const mockedEmails: Email[] = [];

      (axios.create as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValueOnce({ data: mockedEmails })
      });

      await expect(waitEmail('test@example.com', { timeout: 100 })).rejects.toThrowError(
        'Not found email after timeout'
      );
    });
  });
});
