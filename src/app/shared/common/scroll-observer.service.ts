import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollObserverService {
  /**
   * Creates an Observable that emits an array of `IntersectionObserverEntry` objects
   * whenever the observed element intersects with the root element or viewport.
   *
   * @param options - Optional configuration options for the `IntersectionObserver`.
   * @returns An Observable that emits an array of `IntersectionObserverEntry` objects.
   */
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

  /**
   * Creates an Observable that emits the first `IntersectionObserverEntry` whenever the observed element intersects with the root element or viewport.
   *
   * @param element - The element to observe for intersection.
   * @param options - Optional configuration options for the `IntersectionObserver`.
   * @returns An Observable that emits the first `IntersectionObserverEntry` when the observed element intersects.
   */
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
