import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { Observable, of } from 'rxjs';
import { FormErrorComponent } from '../../shared/form-error/language-selector.component';
import { FormSubmitButtonComponent } from '../../shared/form-submit-button/form-submit-button.component';

const EMAIL_PATTERN =
  /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]*$/;

@Component({
  selector: 'accounts-sign-in-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiSvgModule,
    TuiInputModule,
    FormSubmitButtonComponent,
    FormErrorComponent,
    TuiTextfieldControllerModule,
    TuiInputPasswordModule,
    TranslateModule
  ],
  template: `
    <form class="space-y-4 mb-6" [formGroup]="signInForm">
      <!-- Email -->
      <div>
        <tui-input
          formControlName="email"
          tuiTextfieldIconLeft="tuiIconMailLarge"
          [tuiTextfieldCleaner]="true"
          (focusedChange)="clearError('email', 'password')"
        >
          {{ 'sign-in.email' | translate }}
          <span class="tui-required"></span>
          <input type="email" autocomplete="email" tuiTextfield />
        </tui-input>
        <accounts-form-error [error]="emailError | async" />
      </div>
      <!-- Password -->
      <div>
        <tui-input-password
          formControlName="password"
          tuiTextfieldIconLeft="tuiIconKey"
          [tuiTextfieldCleaner]="true"
          (focusedChange)="clearError('password')"
        >
          {{ 'sign-in.password' | translate }}
          <input tuiTextfield type="password" autocomplete="current-password" />
        </tui-input-password>
        <accounts-form-error [error]="passwordError | async" />
      </div>
    </form>
    <accounts-form-submit-button
      [title]="'sign-in.button' | translate"
      [loading]="loading"
      [disabled]="!signInForm.valid"
      (click)="signIn.emit(signInForm.value)"
    />
  `
})
export class SignInFormComponent {
  @Input() loading = false;
  @Output() signIn: EventEmitter<any> = new EventEmitter();

  signInForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN),
        Validators.maxLength(512)
      ]
    })
  });

  constructor(private translate: TranslateService) {}

  @Input()
  set errors(errors: { email?: string; password?: string }) {
    for (const controlName in errors) {
      const control = this.signInForm.get(controlName);
      if (control) {
        control.setErrors({ message: errors[controlName as 'email' | 'password'] });
      }
    }
  }

  clearError(...controlNames: Array<'email' | 'password'>) {
    controlNames.forEach((controlName) => {
      const control = this.signInForm.get(controlName);
      if (control.errors && control.errors['message']) {
        delete control.errors['message'];
        control.updateValueAndValidity();
      }
    });
  }

  get emailError() {
    const emailControl = this.signInForm.controls.email;
    return this.getErrorMessage(emailControl, {
      required: 'sign-in.errors.email.required',
      pattern: 'sign-in.errors.email.pattern'
    });
  }

  get passwordError() {
    const passwordControl = this.signInForm.controls.password;
    return this.getErrorMessage(passwordControl, {
      required: 'sign-in.errors.password.required',
      minlength: 'sign-in.errors.password.minlength',
      maxlength: 'sign-in.errors.password.maxlength',
      pattern: 'sign-in.errors.password.pattern'
    });
  }

  private getErrorMessage(control: FormControl, messages: { [key: string]: string }): Observable<string | undefined> {
    if (!control.errors || (!control.dirty && !control.touched)) {
      return undefined;
    }
    for (const key in messages) {
      if (control.errors[key]) {
        return this.translate.get(messages[key]);
      }
    }
    return of(control.errors['message']);
  }
}
