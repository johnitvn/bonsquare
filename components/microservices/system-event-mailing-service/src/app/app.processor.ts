import { Define, Processor } from '@bonsquare/nest-agenda';
import { ActivationInfo } from '@bonsquare/system-event-mailing-service-proto';
import { Logger } from '@nestjs/common';
import { Job } from 'agenda';
import { Data } from 'ejs';
import { readFileSync } from 'fs';
import { I18nService } from 'nestjs-i18n';
import { join } from 'path';
import { AppConfigService } from './config/app/config.service';
import { MailerService } from './mailer/mailer.service';
import { TemplateService } from './template/template.service';
import { convertImageToBase64URL } from './utils/convert-image-to-base64';

@Processor()
export class AppProcessor {
  constructor(
    private readonly translater: I18nService,
    private appConfig: AppConfigService,
    private mailer: MailerService,
    private template: TemplateService,
    private logger: Logger
  ) {}

  @Define('send-activation-email')
  async sendActivationEmail(job: Job<ActivationInfo & { lang: string }>) {
    const { lang, token, firstName, lastName, email } = job.attrs.data;
    this.logger.log(
      `send activation email to ${email} ${job.attrs.failCount ? `(retry ${job.attrs.failCount} times)` : ``}`
    );
    const subject = this.translater.t('activation-email.subject', { lang });
    const fullName = this.translater.t('activation-email.fullName', { args: { firstName, lastName }, lang });
    const heading = this.translater.t('activation-email.heading', { args: { fullName }, lang });
    const message = this.translater.t('activation-email.message', { lang });
    const actionButtonTitle = this.translater.t('activation-email.actionButtonTitle', { lang });
    const actionHref = `${this.appConfig.accountSiteUrl}/onboard?token=${token}`;
    const brandPrimaryColor = JSON.parse(readFileSync(join(__dirname, 'static', 'brand.json'), 'utf-8')).primaryColor;
    const logo = convertImageToBase64URL(join(__dirname, 'static', 'logo-white.svg'), 'svg+xml');

    const substitutions = {
      lang,
      subject,
      fullName,
      heading,
      message,
      actionButtonTitle,
      actionHref,
      logo,
      brandPrimaryColor
    };

    await this.sendEmail({ template: 'activation', substitutions, job, email, subject });
  }

  private async sendEmail(data: {
    job: Job<unknown>;
    email: string;
    subject: string;
    substitutions: Data;
    template: string;
  }) {
    const { job, email, subject, substitutions, template } = data;
    const html = await this.template.compile(template, substitutions);
    try {
      await this.mailer.send({ to: email, html, subject });
    } catch (err) {
      await this.failOrRetry(job, err, { maxRetries: 3, interval: 1000 });
    }
  }

  private async failOrRetry(job: Job, err: any, options?: { maxRetries?: number; interval?: number }) {
    job.attrs.failCount = job.attrs.failCount ?? 0;
    if (job.attrs.failCount < (options?.maxRetries ?? 3)) {
      job.attrs.failedAt = new Date();
      job.attrs.failCount += 1;
      job.attrs.failReason = err;
      job.attrs.nextRunAt = new Date(job.attrs.failedAt.getTime() + (options.interval ?? 3000));
      await job.save();
    } else {
      this.logger.error(`Failing job '${job.attrs.name}' after ${job.attrs.failCount} retries! ${err}`);
      job.fail(err);
    }
  }
}
