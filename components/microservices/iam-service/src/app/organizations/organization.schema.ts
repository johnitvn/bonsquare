import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Role } from '../roles/role.schema';
import { User } from '../users/user.schema';

@Schema({ timestamps: true })
export class Organization {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop()
  staff?: Array<{
    user: User;
    role: Role;
  }>;
}

export type OrganizationModel = Model<Organization>;
export type OrganizationDocument = HydratedDocument<Organization>;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
export const OrganizationModelDefinition: ModelDefinition = { name: Organization.name, schema: OrganizationSchema };
