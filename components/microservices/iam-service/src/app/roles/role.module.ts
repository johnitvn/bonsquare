import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModelDefinition } from './role.schema';
import { RoleService } from './role.service';

@Module({
  imports: [MongooseModule.forFeature([RoleModelDefinition])],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
