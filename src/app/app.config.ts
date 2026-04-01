import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { filtersReducer } from './store/filters.reducer';

// TODO [CONCEPT: App Config & Providers]
// In standalone Angular (no NgModules), we configure the app here.
// provideRouter() -> sets up routing
// provideHttpClient() -> enables HttpClient for API calls (Dependency Injection)
// provideStore() -> registers NgRx store globally
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ filters: filtersReducer })
  ]
};
