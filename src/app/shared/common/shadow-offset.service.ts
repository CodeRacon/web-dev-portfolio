import { Injectable } from '@angular/core';
import { watchViewport, TornisUpdateValues } from 'tornis';
import { BehaviorSubject, Observable } from 'rxjs';

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
   * A BehaviorSubject that holds a boolean indicating whether the current device is a desktop device.
   * This is determined by checking if the window width is at least 768 pixels and if the device supports hover interactions.
   */
  private isDesktopDevice$ = new BehaviorSubject<boolean>(false);

  /**
   * Initializes the ShadowOffsetService by checking the device type and setting up event listeners to track the mouse position.
   *
   * The `checkDeviceType()` method is called to determine if the current device is a desktop device based on the window width and hover support.
   *
   * The `watchViewport()` function from the `tornis` library is used to subscribe to changes in the mouse position. When the mouse position changes, the `mousePosition$` BehaviorSubject is updated with the new coordinates.
   */
  constructor() {
    this.checkDeviceType();
    window.addEventListener('resize', () => this.checkDeviceType());

    watchViewport(({ mouse }: TornisUpdateValues) => {
      if (mouse.changed) {
        this.mousePosition$.next({ x: mouse.x, y: mouse.y });
      }
    });
  }

  /**
   * Checks the device type based on the window width and hover support.
   * Updates the `isDesktopDevice$` BehaviorSubject with the determined device type.
   * If the window width is at least 768 pixels and the device supports hover interactions, the device is considered a desktop device.
   */
  private checkDeviceType() {
    const isWideScreen = window.innerWidth >= 769;
    const canHover = window.matchMedia('(hover: hover)').matches;
    this.isDesktopDevice$.next(isWideScreen && canHover);
  }

  /**
   * Returns an Observable that emits the current mouse position with `x` and `y` coordinates.
   * This Observable can be subscribed to in order to track changes in the mouse position.
   *
   * @returns An Observable of the current mouse position.
   */
  getMousePosition$(): Observable<{ x: number; y: number }> {
    return this.mousePosition$.asObservable();
  }

  /**
   * Returns an Observable that emits a boolean indicating whether the current device is a desktop device.
   * This is determined by checking if the window width is at least 768 pixels and if the device supports hover interactions.
   *
   * @returns An Observable of a boolean indicating the device type.
   */
  getIsDesktopDevice$(): Observable<boolean> {
    return this.isDesktopDevice$.asObservable();
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
