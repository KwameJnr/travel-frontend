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

// export const baseUrl = "https://fib-w4ghnlb-pr-shr01.firstnationalbank.com.gh/camp/travelre"
// export const baseUrlCamp = "https://fib-w4ghnlb-pr-shr01.firstnationalbank.com.gh/camp"
// export const baseUrl = "http://internal-fib-w4ghalb-camp-int01-618444259.eu-west-1.elb.amazonaws.com/camp/travelre"
// export const baseUrlCamp = "http://internal-fib-w4ghalb-camp-int01-618444259.eu-west-1.elb.amazonaws.com/camp"
// export const baseUrlLocal = "http://localhost:9090/camp/travelre"
// export const baseUrlLocalCamp = "http://localhost:9090/camp"

// export function generateUUID(): string {
//     return crypto.randomUUID();
//   }
export function generateUUID(): string {
    // Fallback UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }