import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfig } from '../models/RuntimeConfig';

@Injectable({
  providedIn: 'root'
})
export class ApiClient {
  private apiRootUrl: string;

  constructor(private client: HttpClient, private runtimeConfig: RuntimeConfig) {
    this.apiRootUrl = this.runtimeConfig.API_SERVER;
  }

  post<T>(path: string, body: any | null): Observable<T> {
    return this.client.post<T>(this.apiRootUrl + path, body);
  }
}
