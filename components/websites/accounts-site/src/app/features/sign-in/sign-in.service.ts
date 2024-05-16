import { Injectable } from '@angular/core';
import { ApiClient } from '../../core/service/api-client';

@Injectable({
  providedIn: 'any'
})
export class SignInService {
  constructor(private client: ApiClient) {}

  signIn(credentials: { email: string; password: string }) {
    return this.client.post('/auth', credentials).pipe();
  }
}
