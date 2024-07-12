import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'https://michael-buschmann.dev/sendMail.php';

  /**
   * Constructs a new instance of the EmailService.
   * @param http - The HttpClient instance to use for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Sends an email using the provided form data.
   *
   * @param formData - The form data to be sent in the email.
   * @returns An Observable that emits the response from the email server.
   */
  sendEmail(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
