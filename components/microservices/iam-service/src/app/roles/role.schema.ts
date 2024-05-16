import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Organization } from '../organizations/organization.schema';

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export type RoleModel = Model<Role>;
export type RoleDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);
export const RoleModelDefinition: ModelDefinition = { name: Role.name, schema: RoleSchema };

RoleSchema.index({ name: 1, organization: 1 }, { unique: true });
