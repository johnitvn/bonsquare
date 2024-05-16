import { LogWriterConfig } from '@bonsquare/ng-logger';

export class RuntimeConfig extends LogWriterConfig {
  readonly APP_URL: string;
  readonly API_SERVER: string;
  readonly primaryColor: string;
  readonly primaryHoverColor: string;
  readonly primaryActiveColor: string;
  readonly secondaryColor: string;
  readonly secondaryHoverColor: string;
  readonly secondaryActiveColor: string;
  readonly accentColor: string;
  readonly accentHoverColor: string;
  readonly accentActiveColor: string;
}
