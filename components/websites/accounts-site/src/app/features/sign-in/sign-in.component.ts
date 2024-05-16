import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AuthTitleComponent } from '../../shared/auth-title/sign-in-title.component';
import { SignInCreateAccountComponent } from './sign-in-create-account.component';
import { SignInFormComponent } from './sign-in-form.component';
import { SignInService } from './sign-in.service';
import { SocialSignInComponent } from './social-sign-in.component';

@Component({
  selector: 'accounts-sign-in',
  standalone: true,
  imports: [
    TranslateModule,
    HttpClientModule,
    SignInFormComponent,
    SocialSignInComponent,
    AuthTitleComponent,
    SignInCreateAccountComponent
  ],
  providers: [SignInService],
  template: `
    <accounts-auth-title [title]="'sign-in.title' | translate" />
    <accounts-sign-in-form [errors]="errors" [loading]="loading" (signIn)="onSignIn($event)" />
    <hr class="my-6 border-gray-300 w-full" />
    <accounts-social-sign-in />
    <accounts-sign-in-create-account />
  `
})
export class SignInComponent {
  errors = {};
  loading = false;

  constructor(private title: Title, private signInService: SignInService) {
    this.title.setTitle('Sign In | Bonsquare Accounts');
  }

  async onSignIn(credentials: { email: string; password: string }) {
    this.loading = true;
    this.signInService.signIn(credentials).subscribe({
      next: (_response) => {
        this.loading = false;
        // redirect
      },
      error: (err) => {
        this.loading = false;
        if (err.error && err.error.description && typeof err.error.description == 'object') {
          this.errors = err.error.description;
        }
      }
    });
  }
}
