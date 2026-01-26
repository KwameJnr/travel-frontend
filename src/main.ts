import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ConfigService } from './app/config.service';
import { APP_INITIALIZER, importProvidersFrom, mergeApplicationConfig } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

const runtimeConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
  ],
};

const mergedConfig = mergeApplicationConfig(appConfig, runtimeConfig);

bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error('Bootstrap error:', err));