import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../roles/role.module';
import { OrganizationModelDefinition } from './organization.schema';
import { OrganizationService } from './organization.service';

@Module({
  imports: [MongooseModule.forFeature([OrganizationModelDefinition]), RoleModule],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
