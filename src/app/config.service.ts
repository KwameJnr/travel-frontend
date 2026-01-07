import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    const configUrl = this.resolveConfigUrl();

    return firstValueFrom(this.http.get(configUrl))
      .then(config => {
        this.config = config;
      })
      .catch(error => {
        console.error('Failed to load configuration', error);
        // Resolve even on failure so the app can continue bootstrapping
        return Promise.resolve();
      });
  }

  private resolveConfigUrl(): string {
    // DEV (ng serve, localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '/assets/config.json';
    }

    // PROD (Spring Boot sub-path) — UNCHANGED
    return '/tent/assets/config.json';
  }

  get(key: string) {
    return this.config ? this.config[key] : null;
  }
}



