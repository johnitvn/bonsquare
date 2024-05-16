import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RuntimeConfig } from '../../core/models/RuntimeConfig';

@Component({
  selector: 'accounts-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16"
  >
    <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
      <div class="relative">
        <div class="absolute">
          <div class="">
            <img class="h-12" [src]="logo" />
            <h1 class="my-2 text-gray-800 font-bold text-2xl">404. That’s an error!</h1>
            <p class="my-2 text-gray-800">The requested url was not found on this server. That’s all we know.</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
    </div>
  </div>`
})
export class NotFoundComponent {
  logo: string;

  constructor(readonly config: RuntimeConfig) {
    // this.logo = `${config.API_SERVER}/logo.svg`;
  }
}
