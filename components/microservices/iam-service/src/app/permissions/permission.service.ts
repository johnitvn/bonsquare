import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionModel } from './permission.schema';

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission.name) private readonly permissionModel: PermissionModel) {}

  async findAll(): Promise<Permission[]> {
    return await this.permissionModel.find().exec();
  }

  async findOne(id: string): Promise<Permission> {
    return await this.permissionModel.findById(id).exec();
  }

  async create(Permission: Permission): Promise<Permission> {
    const newPermission = new this.permissionModel(Permission);
    return await newPermission.save();
  }

  async update(id: string, Permission: Permission): Promise<Permission> {
    return await this.permissionModel.findByIdAndUpdate(id, Permission, { new: true });
  }

  async delete(id: string): Promise<Permission> {
    return await this.permissionModel.findByIdAndDelete(id);
  }
}
