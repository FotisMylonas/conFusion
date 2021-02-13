import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { visibility, flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;',
  },
  animations: [visibility(), flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackPosted: Feedback;
  contactType = ContactType;
  confirmationVisibility;
  feedbackformVisibility;
  hideSpinner: boolean;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: '',
  };

  validationMessages = {
    firstname: {
      required: 'First name is required.',
      minlength: 'First name must be at least  characters long.',
      maxlength: 'First name cannot be more than 25 characters.',
    },
    lastname: {
      required: 'Last name is required.',
      minlength: 'Last name must be at least  characters long.',
      maxlength: 'Last name cannot be more than 25 characters.',
    },
    telnum: {
      required: 'Tel. number is required.',
      pattern: 'Tel. number must contain only numbers',
    },
    email: {
      required: 'Tel. number is required.',
      email: 'not in valid format',
    },
  };
  errMess: string;
  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
    this.setFormState('FEEDBACK');
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: '',
    });
    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged(); //reset form validation
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {}

  setFormState(formState: string) {
    if (formState == 'FEEDBACK') {
      this.feedbackPosted = null;
      this.hideSpinner = true;
      this.feedbackformVisibility = 'shown';
      this.confirmationVisibility = 'hidden';
    } else if (formState == 'CONFIRMATION') {
      this.hideSpinner = true;
      this.feedbackformVisibility = 'hidden';
      this.confirmationVisibility = 'shown';
    } else if (formState == 'WAITING') {
      this.feedbackPosted = null;
      this.hideSpinner = false;
      this.feedbackformVisibility = 'shown';
      this.confirmationVisibility = 'hidden';
    }
  }

  onSubmit() {
    this.setFormState('WAITING');
    this.feedback = this.feedbackForm.value;
    this.feedbackService.submitFeedback(this.feedback).subscribe(
      (data) => {
        this.feedbackPosted = data;
        this.setFormState('CONFIRMATION');
        setTimeout(() => {
          this.setFormState('FEEDBACK');
        }, 5000);
      },
      (errmes) => {
        this.errMess = <any>errmes;
        this.setFormState('FEEDBACK');
      }
    );
    console.log(this.feedbackPosted);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });
    this.feedbackFormDirective.resetForm();
  }
}
