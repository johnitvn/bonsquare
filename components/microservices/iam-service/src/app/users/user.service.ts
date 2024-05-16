import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOneById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async create(User: User): Promise<UserDocument> {
    const newUser = new this.userModel(User);
    return await newUser.save();
  }

  async update(id: string, User: User): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, User, { new: true });
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
