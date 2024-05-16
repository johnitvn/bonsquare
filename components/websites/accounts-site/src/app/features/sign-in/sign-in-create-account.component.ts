import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SignInService } from './sign-in.service';

@Component({
  selector: 'accounts-sign-in-create-account',
  standalone: true,
  imports: [TranslateModule],
  providers: [SignInService],
  template: `
    <p class="mt-8">
      Do not have an account?
      <a href="#" class="text-blue-500 hover:text-blue-700 font-semibold"> Create an account </a>
    </p>
  `
})
export class SignInCreateAccountComponent {}
