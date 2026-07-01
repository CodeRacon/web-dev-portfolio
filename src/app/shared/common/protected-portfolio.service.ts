import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProtectedPortfolioLink {
  label: string;
  url: string;
}

export interface ProtectedPortfolioScreenshotPayload {
  url?: string;
  alt?: string;
}

export interface ProtectedPortfolioSnippetPayload {
  language?: string;
  sourceLabel?: string;
  code?: string;
}

export interface ProtectedPortfolioShowcasePayload {
  id?: string;
  title?: string;
  caption?: string;
  screenshot?: ProtectedPortfolioScreenshotPayload | null;
  snippet?: ProtectedPortfolioSnippetPayload | null;
}

export interface ProtectedPortfolioProjectPayload {
  title?: string;
  summary?: string;
  details?: string[];
  note?: string;
  links?: ProtectedPortfolioLink[];
  showcases?: ProtectedPortfolioShowcasePayload[];
}

export interface ProtectedPortfolioResponse {
  success: boolean;
  projects?: Record<string, ProtectedPortfolioProjectPayload>;
}

@Injectable({
  providedIn: 'root',
})
export class ProtectedPortfolioService {
  private apiUrl = `${window.location.origin}/protectedPortfolio.php`;

  constructor(private http: HttpClient) {}

  unlock(
    password: string,
    language: string
  ): Observable<ProtectedPortfolioResponse> {
    return this.http.post<ProtectedPortfolioResponse>(this.apiUrl, {
      password,
      language,
    });
  }

  refresh(language: string): Observable<ProtectedPortfolioResponse> {
    return this.http.post<ProtectedPortfolioResponse>(this.apiUrl, {
      language,
    });
  }
}
