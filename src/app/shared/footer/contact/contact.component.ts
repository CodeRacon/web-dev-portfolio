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

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ContactComponent {
  contactForm: FormGroup;
  @ViewChild('message') messageTextarea!: ElementRef;

  constructor(private fb: FormBuilder) {
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
      console.log(this.contactForm.value);
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
