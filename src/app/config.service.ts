import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrlConfig } from 'src/assets/commons';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(){
    
    this.config = baseUrlConfig;
  }

  get(key: string) {
    return this.config ? this.config[key] : null;
  }
}



