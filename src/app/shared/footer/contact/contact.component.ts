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

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ContactComponent {
  contactForm: FormGroup;
  @ViewChild('message') messageTextarea!: ElementRef;
  feedbackMessage: string = '';

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, nameValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      message: ['', [Validators.required, messageValidator()]],
      policy: [false, Validators.requiredTrue],
    });
  }

  get isFormValid(): boolean {
    return this.contactForm.valid;
  }

  ngAfterViewInit() {
    this.checkOverflow();
    this.contactForm.get('message')?.valueChanges.subscribe(() => {
      this.checkOverflow();
    });
  }

  checkOverflow() {
    const textarea = this.messageTextarea.nativeElement;
    const legend = textarea.closest('fieldset').querySelector('legend');

    if (textarea.scrollHeight > textarea.clientHeight) {
      legend.classList.add('has-overflow');
    } else {
      legend.classList.remove('has-overflow');
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.emailService.sendEmail(this.contactForm.value).subscribe(
        (response) => {
          if (response.success) {
            this.feedbackMessage =
              'Vielen Dank für Deine Nachricht!\n\nIch melde mich in Kürze.';
            this.contactForm.reset();
          } else {
            this.feedbackMessage =
              'Uups, das hat nicht geklappt.\n\nBitte versuche es später erneut.';
          }
          this.showFeedbackPopover();
        },
        (error) => {
          this.feedbackMessage =
            'Ein Fehler ist aufgetreten.\n\nBitte versuche es später erneut.';
          this.showFeedbackPopover();
        }
      );
    }
  }

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

  scrollToSection(sectionId: string, offset = 0): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
