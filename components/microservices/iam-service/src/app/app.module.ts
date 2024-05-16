import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { MongoConfigModule } from './config/mongo/config.module';
import { MongoConfigService } from './config/mongo/config.service';
import { OrganizationModule } from './organizations/organization.module';
import { OrganizationService } from './organizations/organization.service';
import { PermissionModule } from './permissions/permission.module';
import { RoleModule } from './roles/role.module';
import { UserModule } from './users/user.module';
import { UserService } from './users/user.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      inject: [MongoConfigService],
      useFactory: async (config: MongoConfigService) => ({
        uri: config.uri
      })
    }),
    OrganizationModule,
    PermissionModule,
    RoleModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [Logger]
})
export class AppModule implements OnModuleInit {
  constructor(
    private organizationService: OrganizationService,
    private userService: UserService,
    private logger: Logger
  ) {}

  async onModuleInit() {
    this.logger.debug('Intializing application', AppModule.name);
    if ((await this.organizationService.findOneByName('erp')) == null) {
      this.logger.debug('Seeding administrator accounts and erp organization');
      const administator = await this.userService.create({
        email: 'admin@email.com',
        firstName: 'System',
        lastName: 'Administrator',
        password: 'P@ssw0rd'
      });
      await this.organizationService.create({
        name: 'erp',
        owner: administator
      });
    }
    this.logger.debug('Intialized application', AppModule.name);
  }
}
