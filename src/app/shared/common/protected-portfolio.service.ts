import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProtectedPortfolioLink {
  label: string;
  url: string;
}

export interface ProtectedPortfolioProjectPayload {
  title?: string;
  summary?: string;
  details?: string[];
  links?: ProtectedPortfolioLink[];
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

  unlock(password: string): Observable<ProtectedPortfolioResponse> {
    return this.http.post<ProtectedPortfolioResponse>(this.apiUrl, {
      password,
    });
  }
}
