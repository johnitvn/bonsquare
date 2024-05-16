import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModelDefinition } from './permission.schema';
import { PermissionService } from './permission.service';

@Module({
  imports: [MongooseModule.forFeature([PermissionModelDefinition])],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}
