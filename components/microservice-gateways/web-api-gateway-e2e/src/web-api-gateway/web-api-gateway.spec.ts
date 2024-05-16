/* eslint-disable no-console */
import { runJob } from '@bonsquare/testing';
import { HttpStatus } from '@nestjs/common';
import axios from 'axios';

describe('POST /auth', () => {
  it('should signIn success', async () => {
    // fixtures
    const credentials = { email: 'admin@email.com', password: 'P@ssw0rd' };

    // do request
    const { error, result } = await runJob(axios.post(`auth`, credentials));

    // assets
    expect(error).toBeUndefined();
    expect(result).toHaveProperty('status', HttpStatus.ACCEPTED);
    expect(result).toHaveProperty('data.firstName');
    expect(result).toHaveProperty('data.lastName');
    expect(result).toHaveProperty('data.email', credentials.email);
    expect(result).toHaveProperty('data.id');
    expect(result).toHaveProperty('data.token');
  });

  it('should handle missing email', async () => {
    // fixtures
    const credentials = { password: 'password' };

    // do request
    const { error } = await runJob(axios.post(`auth`, credentials));

    // assets
    expect(error).toBeDefined();
    expect(error).toHaveProperty('response.status', HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error).toHaveProperty('response.data.description.email');
    expect(error).not.toHaveProperty('response.data.description.password');
  });

  it('should handle missing password', async () => {
    // fixtures
    const credentials = { email: 'email@domain.com' };

    // do request
    const { error } = await runJob(axios.post(`auth`, credentials));

    // assets
    expect(error).toBeDefined();
    expect(error).toHaveProperty('response.status', HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error).toHaveProperty('response.data.description.password');
    expect(error).not.toHaveProperty('response.data.description.email');
  });

  it('should handle invalid email', async () => {
    // fixtures
    const credentials = { email: 'invalid.com', password: 'P@ssw0rd' };

    // do request
    const { error } = await runJob(axios.post(`auth`, credentials));

    // assets
    expect(error).toBeDefined();
    expect(error).toHaveProperty('response.status', HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error).toHaveProperty('response.data.description.email');
    expect(error).not.toHaveProperty('response.data.description.password');
  });

  it('should handle not exists user with email', async () => {
    // fixtures
    const credentials = { email: 'notfound@domain.com', password: 'P@ssw0rd' };

    // do request
    const { error } = await runJob(axios.post(`auth`, credentials));

    // assets
    expect(error).toBeDefined();
    expect(error).toHaveProperty('response.status', HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error).toHaveProperty('response.data.description.email');
    expect(error).not.toHaveProperty('response.data.description.password');
  });

  it('should handle invalid password', async () => {
    // fixtures
    const credentials = { email: 'admin@email.com', password: 'InvalidP@ssw0rd' };

    // do request
    const { error } = await runJob(axios.post(`auth`, credentials));

    // assets
    expect(error).toBeDefined();
    expect(error).toHaveProperty('response.status', HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error).toHaveProperty('response.data.description.password');
    expect(error).not.toHaveProperty('response.data.description.email');
  });
});
