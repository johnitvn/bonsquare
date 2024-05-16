import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([UserModelDefinition])],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
