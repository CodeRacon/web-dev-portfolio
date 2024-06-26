import { Injectable } from '@angular/core';
import { watchViewport, TornisUpdateValues } from 'tornis';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShadowOffsetService {
  private mousePosition$ = new BehaviorSubject<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  constructor() {
    watchViewport(({ mouse }: TornisUpdateValues) => {
      if (mouse.changed) {
        this.mousePosition$.next({ x: mouse.x, y: mouse.y });
      }
    });
  }

  getMousePosition$() {
    return this.mousePosition$.asObservable();
  }

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
