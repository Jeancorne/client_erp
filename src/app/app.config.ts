import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import es from '@angular/common/locales/es';

import { routes } from './app.routes';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzI18n(es_ES),
  ],
};
