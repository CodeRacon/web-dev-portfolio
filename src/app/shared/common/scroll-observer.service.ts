import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollObserverService {
  createObserver(
    options?: IntersectionObserverInit
  ): Observable<IntersectionObserverEntry[]> {
    return new Observable((subscriber) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        subscriber.next(entries);
      }, options);

      return {
        unsubscribe() {
          intersectionObserver.disconnect();
        },
      };
    });
  }

  observe(
    element: Element,
    options?: IntersectionObserverInit
  ): Observable<IntersectionObserverEntry> {
    return new Observable((subscriber) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        subscriber.next(entries[0]);
      }, options);

      intersectionObserver.observe(element);

      return {
        unsubscribe() {
          intersectionObserver.disconnect();
        },
      };
    });
  }
}
