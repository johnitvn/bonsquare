import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleModel } from './role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private readonly roleModel: RoleModel) {}

  async findAll(): Promise<Role[]> {
    return await this.roleModel.find().exec();
  }

  async findOneById(id: string): Promise<Role> {
    return await this.roleModel.findById(id).exec();
  }

  async findOneByName(name: string): Promise<Role | null> {
    return await this.roleModel.findOne({ name }).exec();
  }
  async create(Role: Role): Promise<Role> {
    const newRole = new this.roleModel(Role);
    return await newRole.save();
  }

  async update(id: string, Role: Role): Promise<Role> {
    return await this.roleModel.findByIdAndUpdate(id, Role, { new: true });
  }

  async delete(id: string): Promise<Role> {
    return await this.roleModel.findByIdAndDelete(id);
  }
}
