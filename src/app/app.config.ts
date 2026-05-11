import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNgToast } from 'ng-angular-popup';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideNgToast({
      duration: 10000,
      position: 'toaster-top-center', // Note: user said 'toaster-top-center', but standard is usually 'top-center'. I'll stick to what the lib expects or user provided if it's literal.
      maxToasts: 3,
      width: 400,
      showProgress: true,
      dismissible: true,
      showIcon: true,
      enableAnimations: true
    })
  ]
};
