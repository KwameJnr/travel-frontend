import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/assets/config.json'))
      .then(config => {
        this.config = config;
      })
      .catch(err => {
        console.error('Failed to load config', err);
        return Promise.resolve(); // ensure app still boots
      });
  }

  get(key: string): any {
    return this.config ? this.config[key] : null;
  }
}