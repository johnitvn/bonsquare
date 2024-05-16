import { SYSTEM_LANGUAGES } from '@bonsquare/languages';
import { NestLogger } from '@bonsquare/nest-logger';
import { Inject } from '@nestjs/common';
import * as chokidar from 'chokidar';
import { readFileSync } from 'fs';
import { I18N_LOADER_OPTIONS, I18nAbstractLoaderOptions, I18nLoader, I18nTranslation } from 'nestjs-i18n';
import { exists, getFiles } from 'nestjs-i18n/dist/utils';
import { basename, extname, normalize, sep } from 'path';
import { Observable, Subject, merge, of, switchMap } from 'rxjs';

export class I18nError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'I18nError';
  }
}

export class NestI18nLoader extends I18nLoader {
  private watcher?: chokidar.FSWatcher;
  private events: Subject<string> = new Subject();
  private logger = new NestLogger(NestI18nLoader.name);

  constructor(
    @Inject(I18N_LOADER_OPTIONS)
    private options: I18nAbstractLoaderOptions
  ) {
    super();
    this.options = this.sanitizeOptions(options);
    if (this.options.watch) {
      this.watcher = chokidar.watch(this.options.path, { ignoreInitial: true }).on('all', (event) => {
        this.events.next(event);
      });
    }
    this.logger.debug?.('Instance initialized');
  }

  async onModuleDestroy() {
    if (this.watcher) {
      await this.watcher.close();
    }
  }

  async languages(): Promise<string[] | Observable<string[]>> {
    if (this.options.watch) {
      return merge(of(await this.parseLanguages()), this.events.pipe(switchMap(() => this.parseLanguages())));
    }

    const languages = await this.parseLanguages();

    if (!this.equals(languages, SYSTEM_LANGUAGES)) {
      const missing = SYSTEM_LANGUAGES.filter((lang) => !languages.includes(lang));
      throw new I18nError('Missing tranlations file for languages: ' + missing.join(','));
    }

    return languages;
  }

  async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    if (this.options.watch) {
      return merge(of(await this.parseTranslations()), this.events.pipe(switchMap(() => this.parseTranslations())));
    }
    return this.parseTranslations();
  }

  protected async parseTranslations(): Promise<I18nTranslation> {
    const i18nPath = normalize(this.options.path + sep);

    const translations: I18nTranslation = {};

    if (!(await exists(i18nPath))) {
      throw new I18nError(`i18n path (${i18nPath}) cannot be found`);
    }

    if (!this.options.filePattern?.match(/\*\.[A-z]+/)) {
      throw new I18nError(`filePattern should be formatted like: *.json, *.txt, *.custom etc`);
    }

    const pattern = new RegExp('.' + this.options.filePattern.replace('.', '.'));

    const files = await getFiles(i18nPath, pattern, false);

    for (const file of files) {
      const lang = basename(file, extname(file));
      const data = this.formatData(readFileSync(file, 'utf-8'));
      translations[lang] = data;
    }

    return translations;
  }

  protected async parseLanguages(): Promise<string[]> {
    const i18nPath = normalize(this.options.path + sep);
    const pattern = new RegExp('.' + this.options.filePattern?.replace('.', '.'));
    const files = await getFiles(i18nPath, pattern, false);
    return files.map((file) => basename(file, extname(file)));
  }

  protected sanitizeOptions(options: I18nAbstractLoaderOptions) {
    options = { ...this.getDefaultOptions(), ...options };

    options.path = normalize(options.path + sep);
    if (!options.filePattern?.startsWith('*.')) {
      options.filePattern = '*.' + options.filePattern;
    }

    return options;
  }

  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.json',
      watch: false
    };
  }

  formatData(data: any) {
    try {
      return JSON.parse(data);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new I18nError('Invalid JSON file. Please check your JSON syntax.');
      }
      throw e;
    }
  }

  private equals(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
      return false;
    }

    const seen: Record<string, number> = {};
    a.forEach(function (v) {
      const key = typeof v + v;
      if (!seen[key]) {
        seen[key] = 0;
      }
      seen[key] += 1;
    });

    return b.every(function (v) {
      const key = typeof v + v;
      if (seen[key]) {
        seen[key] -= 1;
        return true;
      }
      return false;
    });
  }
}
