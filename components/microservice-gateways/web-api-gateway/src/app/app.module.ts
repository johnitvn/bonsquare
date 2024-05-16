import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app/config.module';

@Module({
  imports: [AppConfigModule, AuthModule]
})
export class AppModule {}
