// src/companies/companies.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import {
  createEntity,
  softDelete,
  updateEntity,
  findEntity,
} from '../../common/helpers/db.helper';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: JwtPayload,
  ): Promise<Company> {
    return createEntity<Company, CreateCompanyDto>(
      this.companyModel,
      createCompanyDto,
      user,
      'Company',
    );
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel
      .find({ isDeleted: { $ne: true } })
      .populate('createdBy', 'email')
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Company> {
    return findEntity<Company>('Company', this.companyModel, id);
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: JwtPayload,
  ): Promise<Company> {
    return updateEntity<Company, UpdateCompanyDto>(
      'Company',
      this.companyModel,
      id,
      updateCompanyDto,
      user,
    );
  }

  async remove(id: string, user: JwtPayload): Promise<Company> {
    return softDelete<Company>('Company', this.companyModel, id, user);
  }
}
