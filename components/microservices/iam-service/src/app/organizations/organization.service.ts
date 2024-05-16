import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationModel } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(@InjectModel(Organization.name) private readonly organizationModel: OrganizationModel) {}

  async findAll(): Promise<Organization[]> {
    return await this.organizationModel.find().exec();
  }

  async findOneById(id: string): Promise<Organization> {
    return await this.organizationModel.findById(id).exec();
  }

  async findOneByName(name: string): Promise<Organization | null> {
    return await this.organizationModel.findOne({ name }).exec();
  }

  async create(organization: Organization): Promise<Organization> {
    const newOrganization = new this.organizationModel(organization);
    return await newOrganization.save();
  }

  async update(id: string, organization: Organization): Promise<Organization> {
    return await this.organizationModel.findByIdAndUpdate(id, organization, { new: true });
  }

  async delete(id: string): Promise<Organization> {
    return await this.organizationModel.findByIdAndDelete(id);
  }
}
