import {
  Component,
  HostListener,
  Input,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowOffsetService } from '../common/shadow-offset.service';

@Component({
  selector: 'app-index-arrow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index-arrow.component.html',
  styleUrls: ['./index-arrow.component.scss'],
})
export class IndexArrowComponent {
  @Input() alignment: 'left' | 'right' = 'left';
  @Input() sectionId: string = this.generateUniqueId();
  @Input() maxOffset: number = 4;

  /**
   * Represents the current state of the animation for the index arrow component.
   * The animation state can be one of the following:
   * - 'idle': The arrow is in its initial state, not animating.
   * - 'animatingForward': The arrow is animating in the forward direction.
   * - 'expanded': The arrow is in its expanded state after the forward animation.
   * - 'animatingBackward': The arrow is animating in the backward direction.
   */
  private animationState:
    | 'idle'
    | 'animatingForward'
    | 'expanded'
    | 'animatingBackward' = 'idle';

  /**
   * Constructs an instance of the `IndexArrowComponent`.
   *
   * @param elementRef - A reference to the DOM element of the component.
   * @param renderer - A service for rendering DOM elements.
   * @param shadowOffsetService - A service for managing the shadow offset of the component.
   */
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private shadowOffsetService: ShadowOffsetService
  ) {}

  @HostListener('window:mousemove', ['$event'])

  /**
   * Updates the shadow effect of the index arrow component based on the mouse event.
   *
   * This method is called when the window's `mousemove` event is triggered. It calculates the shadow offset based on the bounding rectangle of the component and the maximum offset value, and then updates the `dx` and `dy` attributes of the `feDropShadow` element in the SVG to apply the calculated shadow offset.
   *
   * @param event - The `MouseEvent` object containing the mouse movement information.
   */
  onMouseMove(event: MouseEvent): void {
    this.updateShadow(event);
  }

  /**
   * Triggers the animation of the index arrow component based on the provided direction.
   *
   * - If the direction is 'forward' and the animation state is not 'idle', the function returns without triggering any animation.
   * - If the direction is 'backward' and the animation state is not 'expanded', the function returns without triggering any animation.
   * - If the direction is 'forward', the function triggers the forward animation by finding the corresponding SVGAnimateElement and calling its `beginElement()` method. The animation state is then set to 'animatingForward'.
   * - If the direction is 'backward', the function triggers the backward animation by finding the corresponding SVGAnimateElement and calling its `beginElement()` method. The animation state is then set to 'animatingBackward'.
   * - After the animation is triggered, the function sets a timeout to update the animation state to 'expanded' or 'idle' after 500 milliseconds.
   *
   * @param direction - The direction of the animation, either 'forward' or 'backward'.
   */
  triggerAnimation(direction: 'forward' | 'backward'): void {
    if (direction === 'forward' && this.animationState !== 'idle') return;
    if (direction === 'backward' && this.animationState !== 'expanded') return;

    const animationId =
      direction === 'forward' ? this.sectionId : `${this.sectionId}return`;
    const animElement = document.getElementById(
      animationId
    ) as SVGAnimateElement | null;

    if (animElement) {
      animElement.beginElement();
      this.animationState =
        direction === 'forward' ? 'animatingForward' : 'animatingBackward';

      setTimeout(() => {
        this.animationState = direction === 'forward' ? 'expanded' : 'idle';
      }, 500);
    }
  }

  /**
   * Generates a unique identifier string for a section.
   *
   * The identifier is generated using a random number and a substring of its base 36 representation.
   *
   * @returns A unique identifier string in the format `section_<random_string>`.
   */
  private generateUniqueId(): string {
    return `section_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Updates the shadow effect of the index arrow component based on the mouse event.
   *
   * This function calculates the shadow offset based on the bounding rectangle of the component and the maximum offset value.
   * It then updates the `dx` and `dy` attributes of the `feDropShadow` element in the SVG to apply the calculated shadow offset.
   *
   * @param event - The mouse event that triggered the shadow update.
   */
  private updateShadow(event: MouseEvent): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const { x, y } = this.shadowOffsetService.calculateShadowOffset(
      rect,
      this.maxOffset
    );

    const feDropShadow =
      this.elementRef.nativeElement.querySelector('feDropShadow');
    if (feDropShadow) {
      this.renderer.setAttribute(feDropShadow, 'dx', `${x}`);
      this.renderer.setAttribute(feDropShadow, 'dy', `${y}`);
    }
  }
}
