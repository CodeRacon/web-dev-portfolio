import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  /**
   * Configures the providers for the Angular application.
   *
   * The `providers` array sets up the following:
   * - Configures the router with the defined routes
   * - Enables animations for the application
   * - Provides the HTTP client for making HTTP requests
   * - Imports the HttpClientModule for HTTP functionality
   * - Configures the TranslateModule for internationalization
   *   - Specifies the TranslateHttpLoader as the loader for translation files
   *   - Sets the default language to 'en'
   */
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }).providers!,
  ],
};
