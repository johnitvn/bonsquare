import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SYSTEM_LANGUAGES_MAP } from '@bonsquare/languages';
import { TranslateModule } from '@ngx-translate/core';
import { TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiSizeL, TuiSizeM, TuiSizeS } from '@taiga-ui/core/types';
import {
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
  TuiStringifyPipeModule
} from '@taiga-ui/kit';
import { LanguageService } from '../../core/service/language-service';

@Component({
  selector: 'accounts-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TranslateModule,
    FormsModule,
    TuiTextfieldControllerModule,
    TuiStringifyPipeModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule
  ],
  template: `
    <tui-select
      ngSkipHydration
      class="tui-space_top-4"
      [tuiTextfieldSize]="size"
      [tuiTextfieldLabelOutside]="true"
      [(ngModel)]="currentLang"
      (ngModelChange)="onChange($event)"
    >
      <tui-data-list *tuiDataList>
        <button *ngFor="let language of languages" tuiOption [value]="language.id">
          {{ language.name }}
        </button>
      </tui-data-list>
    </tui-select>
  `
})
export class LanguageSelectorComponent {
  @Input() size: TuiSizeL | TuiSizeS | TuiSizeM = 's';

  languages: Array<{ id: string; name: string }>;
  currentLang: string;

  constructor(private language: LanguageService) {
    const languages = Object.keys(SYSTEM_LANGUAGES_MAP);
    this.languages = languages.map((id) => ({ id, name: SYSTEM_LANGUAGES_MAP[id] }));
    this.currentLang = SYSTEM_LANGUAGES_MAP[language.currentLang.value];
  }

  onChange(languageCode: any) {
    this.currentLang = SYSTEM_LANGUAGES_MAP[languageCode];
    this.language.changeLanguage(languageCode);
  }
}
