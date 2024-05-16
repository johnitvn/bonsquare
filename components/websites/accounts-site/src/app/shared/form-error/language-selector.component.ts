import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'accounts-form-error',
  standalone: true,
  imports: [CommonModule, TuiSvgModule],
  template: `
    <div class="text-error text-xs flex items-center space-x-2 mt-2 ml-2" *ngIf="error">
      <tui-svg src="tuiIconAlertCircle"></tui-svg>
      <span> {{ error }} </span>
    </div>
  `
})
export class FormErrorComponent {
  @Input() error?: string;
}
