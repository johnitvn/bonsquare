import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ejs, { Data } from 'ejs';
import { Template, TemplateModel } from './template.schema';

export class TemplateService {
  constructor(@InjectModel(Template.name) private templateModel: TemplateModel, private logger: Logger) {}

  findAll() {
    return this.templateModel.find().exec();
  }

  async create(data: Pick<Template, 'name' | 'content'>) {
    const template = new this.templateModel(data);
    await template.save({});
    return template;
  }

  async findByName(name: string) {
    return this.templateModel.findOne({ name }).exec();
  }

  async removeByName(name: string) {
    await this.templateModel.find({ name }).deleteOne().exec();
  }

  async compile(name: string, substitutions: Data) {
    const template = await this.findByName(name);

    if (template == null) {
      this.logger.fatal(`Template ${name} is not exists`, TemplateService.name);
      throw new Error(`Template ${name} is not exists`);
    }

    try {
      return ejs.compile(template.content)(substitutions);
    } catch (err) {
      this.logger.fatal('Error white compile template: ' + err.message, {
        context: TemplateService.name,
        stack: err.stack
      });
      throw err;
    }
  }
}
