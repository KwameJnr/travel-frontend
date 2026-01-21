import { inject, Injectable } from '@angular/core';
import { ConfigService } from 'src/app/config.service';

@Injectable({ providedIn: 'root' })
export class BaseUrlService {
  constructor(private configService: ConfigService) {}

  getBaseUrlLocal(): string {
    return this.configService.get('baseUrl');
  }

  getBaseUrlLocalCamp(): string {
    return this.configService.get('baseUrlCamp');
  }
}

export function generateUUID(): string {
    // Fallback UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }