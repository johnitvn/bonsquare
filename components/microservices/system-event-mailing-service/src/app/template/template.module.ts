import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { TemplateModelDefinition } from './template.schema';
import { TemplateService } from './template.service';

@Module({
  imports: [MongooseModule.forFeature([TemplateModelDefinition])],
  providers: [TemplateService, Logger],
  exports: [TemplateService]
})
export class TemplateModule implements OnModuleInit {
  private logger = new Logger(TemplateModule.name);

  constructor(private templateService: TemplateService) {}

  async onModuleInit() {
    this.logger.debug('Seeding templates');
    const templates = readdirSync(join(__dirname, 'assets', 'templates'))
      .filter((name) => name.endsWith('.ejs'))
      .map((name) => name.replace(/\.[^/.]+$/, ''));

    const currentTemplates = (await this.templateService.findAll()).map((template) => template.name);
    const missingTemplates = templates.filter((name) => !currentTemplates.includes(name));
    const redundantTemplates = currentTemplates.filter((name) => !templates.includes(name));

    this.logger.verbose(`Missing templates: ${missingTemplates.length > 0 ? missingTemplates.join(', ') : 'None'}`);
    this.logger.verbose(
      `Redundant templates: ${redundantTemplates.length > 0 ? redundantTemplates.join(', ') : 'None'}`
    );

    await this.addMissingTemplates(missingTemplates);
    await this.removeRedundantTemplates(redundantTemplates);
  }

  async addMissingTemplates(templates: string[]) {
    for (let i = 0; i < templates.length; i++) {
      const name = templates[i];
      const content = readFileSync(join(__dirname, 'assets', 'templates', `${name}.ejs`), 'utf-8');
      await this.templateService.create({ name, content });
    }
  }

  async removeRedundantTemplates(templates: string[]) {
    for (let i = 0; i < templates.length; i++) {
      const name = templates[i];
      await this.templateService.removeByName(name);
    }
  }
}
