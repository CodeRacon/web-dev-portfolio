import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { watchViewport, TornisUpdateValues } from 'tornis';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

/**
 * gets mouse-position-data to be used for the subtile mouse-over animation on the body elements background (dots).
 * This is achieved by updating CSS variables with the current mouse position and a radius.
 * This function is called by the `watchViewport` function from the `Tornis` library
 * whenever the mouse position changes.
 *
 * @param mouse - An object containing the current mouse position and whether it has changed.
 */
const applyMouseEffect = ({ mouse, position }: TornisUpdateValues) => {
  if (mouse.changed) {
    const mouseX = mouse.x;
    const mouseY = mouse.y;
    const radius = 8 * 16;

    const bodyElement = document.querySelector('body');
    if (bodyElement) {
      bodyElement.style.setProperty('--mouse-x', `${mouseX}px`);
      bodyElement.style.setProperty('--mouse-y', `${mouseY}px`);
      bodyElement.style.setProperty('--radius', `${radius}px`);
    }
  }
};

watchViewport(applyMouseEffect);
