import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ConfigService } from './app/config.service';
import { APP_INITIALIZER, importProvidersFrom, mergeApplicationConfig } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// ✅ 1. APP_INITIALIZER factory — ensures config is loaded *before* app starts
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

// ✅ 2. Define runtime config (merged into main app config)
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

// ✅ 3. Merge your default and runtime configs
const mergedConfig = mergeApplicationConfig(appConfig, runtimeConfig);

// ✅ 4. Bootstrap
bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error('Bootstrap error:', err));