import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class Permission {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type PermissionModel = Model<Permission>;
export type PermissionDocument = HydratedDocument<Permission>;
export const PermissionSchema = SchemaFactory.createForClass(Permission);
export const PermissionModelDefinition: ModelDefinition = { name: Permission.name, schema: PermissionSchema };
