import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'https://michael-buschmann.dev/sendMail.php';

  constructor(private http: HttpClient) {}

  sendEmail(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
