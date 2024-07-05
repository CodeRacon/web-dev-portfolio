import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      policy: [false, Validators.requiredTrue],
    });
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
}
