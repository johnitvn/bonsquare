import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'accounts-main-layout',
  standalone: true,
  imports: [RouterModule],
  styles: ``,
  template: `<router-outlet></router-outlet>`
})
export class MainLayoutComponent {}
