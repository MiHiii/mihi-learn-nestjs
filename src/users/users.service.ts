import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { genSaltSync, hashSync, compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const count = await this.userModel.countDocuments();
    if (count === 0) {
      const salt = genSaltSync(10);
      const hash = hashSync('123456', salt);
      await this.userModel.insertMany([
        {
          name: 'Mihi',
          email: 'admin@gmail.com',
          password: hash,
        },
        {
          name: 'Mihi',
          email: 'user@gmail.com',
          password: hash,
        },
        {
          name: 'User 1',
          email: 'user1@gmail.com',
          password: hash,
        },
        {
          name: 'User 2',
          email: 'user2@gmail.com',
          password: hash,
        },
        {
          name: 'User 3',
          email: 'user3@gmail.com',
          password: hash,
        },
      ]);
    }
  }

  async findAll() {
    return await this.userModel.find({});
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async isValidPassword(password: string, hash: string) {
    return await compare(password, hash);
  }
}
