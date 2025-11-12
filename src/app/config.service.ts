import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/tent/assets/config.json'))
      .then(config => {
        this.config = config;
      })
      .catch(error => {
        console.error('Failed to load configuration', error);
        // Resolve even on failure so the app can continue bootstrapping
        return Promise.resolve();
      });
  }

  get(key: string) {
    return this.config ? this.config[key] : null;
  }
}