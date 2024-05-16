import { Component, Input } from '@angular/core';

@Component({
  selector: 'accounts-auth-title',
  standalone: true,
  imports: [],
  template: `
    <h1 class="text-xl md:text-2xl font-bold leading-tight w-full text-center mb-6">
      {{ title }}
    </h1>
  `
})
export class AuthTitleComponent {
  @Input() title: string;
}
