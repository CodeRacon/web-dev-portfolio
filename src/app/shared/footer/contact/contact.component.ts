import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  nameValidator,
  emailValidator,
  messageValidator,
} from './custom-validators';
import { RouterModule } from '@angular/router';
import { EmailService } from '../../../shared/common/email.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
})
export class ContactComponent {
  contactForm: FormGroup;
  @ViewChild('message') messageTextarea!: ElementRef;
  feedbackMessage: string = '';

  /**
   * Initializes the contact form with the required form fields and validators.
   *
   * The contact form includes the following fields:
   * - `name`: Required field with a custom name validator.
   * - `email`: Required field with a custom email validator.
   * - `message`: Required field with a custom message validator.
   * - `policy`: Required boolean field indicating the user has accepted the policy.
   *
   * The form is created using the `FormBuilder` service and the `ReactiveFormsModule`.
   *
   * @param fb - The `FormBuilder` service used to create the form group.
   * @param emailService - The `EmailService` used to send the contact form data.
   * @param translateService - The `TranslateService` used to handle internationalization.
   */
  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private translateService: TranslateService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, nameValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      message: ['', [Validators.required, messageValidator()]],
      policy: [false, Validators.requiredTrue],
    });
  }

  /**
   * Checks if the current language is German.
   *
   * @returns `true` if the current language is German, `false` otherwise.
   */
  get isGerman(): boolean {
    return this.translateService.currentLang === 'de';
  }

  /**
   * Checks if the contact form is valid.
   *
   * @returns `true` if the contact form is valid, `false` otherwise.
   */
  get isFormValid(): boolean {
    return this.contactForm.valid;
  }

  /**
   * This method is called after the view has been initialized and whenever the message value changes.
   */
  ngAfterViewInit() {
    this.checkOverflow();
    this.contactForm.get('message')?.valueChanges.subscribe(() => {
      this.checkOverflow();
    });
  }

  /**
   * Checks for overflow in the message textarea and updates the legend's CSS class accordingly.
   */
  checkOverflow() {
    const textarea = this.messageTextarea.nativeElement;
    const legend = textarea.closest('fieldset').querySelector('legend');

    if (textarea.scrollHeight > textarea.clientHeight) {
      legend.classList.add('has-overflow');
    } else {
      legend.classList.remove('has-overflow');
    }
  }

  /**
   * Handles the submission of the contact form.
   * If the form is valid, it sends the email using the `emailService` and displays a feedback message based on the response.
   * If the form is invalid, it does not send the email and displays an error message.
   */
  onSubmit() {
    if (this.contactForm.valid) {
      this.emailService.sendEmail(this.contactForm.value).subscribe(
        (response) => {
          if (response.success) {
            this.feedbackMessage =
              'Danke für Deine Nachricht!\n\nIch melde mich in Kürze bei Dir.';
            this.contactForm.reset();
          } else {
            this.feedbackMessage =
              'Uups, das hat nicht geklappt.\n\nBitte versuche es später nochmal.';
          }
          this.showFeedbackPopover();
        },
        (error) => {
          this.feedbackMessage =
            'Ein Fehler ist aufgetreten.\n\nBitte versuche es später nochmal.';
          this.showFeedbackPopover();
        }
      );
    }
  }

  /**
   * Shows a feedback popover for a short duration after the contact form is submitted.
   * The popover is displayed for 4 seconds and then automatically hidden.
   */
  showFeedbackPopover() {
    const popover = document.getElementById('feedback') as any;
    if (popover && popover.showPopover) {
      popover.showPopover();
      setTimeout(() => {
        if (popover.hidePopover) {
          popover.hidePopover();
        }
      }, 4000);
    }
  }

  /**
   * Scrolls the page to the specified section with an optional offset.
   *
   * @param sectionId - The ID of the section to scroll to.
   * @param offset - The optional offset to apply to the scroll position, in pixels.
   */
  scrollToSection(sectionId: string, offset = 0): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
