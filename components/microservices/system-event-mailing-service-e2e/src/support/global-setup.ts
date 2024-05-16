/* eslint-disable */
import { exec } from '@actions/exec';
import dotenv from 'dotenv';
import { join } from 'path';
import tcpPortUsed from 'tcp-port-used';

dotenv.config({ path: join(__dirname, '../../../system-event-mailing-service/.env') });

export const DEFAULT_SERVER_PORT = parseInt(process.env.PORT);
export const DEFAULT_SERVER_HOST = 'localhost';

module.exports = async function () {
  console.log('\nSetting up...\n');

  if (process.env.BASE_URL) {
    // for run e2e for staging server you can override with enviroment BASE_URL
    console.log(`Test will run on base url: ${process.env.BASE_URL}`);
    globalThis.__BASE_URL__ = process.env.BASE_URL;
  } else if (!(await tcpPortUsed.check(DEFAULT_SERVER_PORT, DEFAULT_SERVER_HOST))) {
    console.log('Starting dev server');
    // if server default port is not listener will start it and wait server listener
    await exec('npx', ['nx', 'start', 'system-event-mailing-service']);
    console.log('Dev server started');

    console.log(`Test will run on base url: ${DEFAULT_SERVER_HOST}:${DEFAULT_SERVER_PORT}`);
    globalThis.__BASE_URL__ = `${DEFAULT_SERVER_HOST}:${DEFAULT_SERVER_PORT}`;
  } else {
    console.log(`${DEFAULT_SERVER_HOST}:${DEFAULT_SERVER_PORT} is listenning. We will reused dev server`);
    console.log(`Test will run on base url: ${DEFAULT_SERVER_HOST}:${DEFAULT_SERVER_PORT}`);
    globalThis.__BASE_URL__ = `${DEFAULT_SERVER_HOST}:${DEFAULT_SERVER_PORT}`;
  }
  console.log('\n');
};
