import { Injectable } from '@angular/core';
import { watchViewport, TornisUpdateValues } from 'tornis';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShadowOffsetService {
  /**
   * A BehaviorSubject that holds the current mouse position, with x and y coordinates.
   * This is used to calculate the shadow offset for elements based on the mouse position.
   */
  private mousePosition$ = new BehaviorSubject<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  /**
   * Subscribes to the `watchViewport` function from the `tornis` library to track changes in the mouse position.
   * Whenever the mouse position changes, it updates the `mousePosition$` BehaviorSubject with the new coordinates.
   */
  constructor() {
    watchViewport(({ mouse }: TornisUpdateValues) => {
      if (mouse.changed) {
        this.mousePosition$.next({ x: mouse.x, y: mouse.y });
      }
    });
  }

  /**
   * Returns an observable that emits the current mouse position.
   * The observable emits an object with `x` and `y` properties representing the mouse coordinates.
   */
  getMousePosition$() {
    return this.mousePosition$.asObservable();
  }

  /**
   * Calculates the shadow offset for an element based on the current mouse position.
   *
   * @param elementRect - The bounding rectangle of the element.
   * @param maxOffset - The maximum allowed offset for the shadow.
   * @returns An object with `x` and `y` properties representing the calculated shadow offset.
   */
  calculateShadowOffset(
    elementRect: DOMRect,
    maxOffset: number
  ): { x: number; y: number } {
    const { x: mouseX, y: mouseY } = this.mousePosition$.getValue();
    const centerX = elementRect.left + elementRect.width / 2;
    const centerY = elementRect.top + elementRect.height / 2;

    let offsetX = ((mouseX - centerX) / (window.innerWidth / 2)) * maxOffset;
    let offsetY = ((mouseY - centerY) / (window.innerHeight / 2)) * maxOffset;

    offsetX = Math.max(-maxOffset, Math.min(maxOffset, offsetX));
    offsetY = Math.max(-maxOffset, Math.min(maxOffset, offsetY));

    return { x: offsetX, y: offsetY };
  }
}
