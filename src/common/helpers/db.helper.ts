import { Model, Document, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { BaseDocument } from '../interfaces/base-document.interface';

// Kiểm tra ObjectId hợp lệ
function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

/**
 * Creates a new entity with the provided data and associates it with the user.
 * @param model - Mongoose model for the entity
 * @param createData - Data to create the entity
 * @param user - JWT payload containing user information
 * @param entityName - Optional name of the entity for error messages
 * @returns The created entity
 * @throws Error if no data is provided
 */
export async function createEntity<T extends BaseDocument, C>(
  model: Model<T>,
  createData: C,
  user: JwtPayload,
  entityName?: string,
): Promise<T> {
  if (!createData || Object.keys(createData).length === 0) {
    throw new Error(
      `${entityName ?? 'Entity'} creation failed: No data provided`,
    );
  }

  const doc = await model.create({
    ...createData,
    createdBy: user.sub,
  });

  return doc;
}

/**
 * Soft deletes an entity by marking it as deleted.
 * @param entityName - Name of the entity for error messages
 * @param model - Mongoose model for the entity
 * @param id - ID of the entity to delete
 * @param user - JWT payload containing user information
 * @returns The soft-deleted entity
 * @throws NotFoundException if the entity is not found or already deleted
 */
export async function softDelete<T extends BaseDocument>(
  entityName: string,
  model: Model<T>,
  id: string,
  user: JwtPayload,
): Promise<T> {
  if (!isValidObjectId(id)) {
    throw new NotFoundException(`${entityName} not found: Invalid ID`);
  }

  const doc = await model.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user.sub,
    },
    { new: true },
  );

  if (!doc) {
    throw new NotFoundException(`${entityName} not found or already deleted`);
  }

  return doc;
}

/**
 * Updates an entity with the provided data.
 * @param entityName - Name of the entity for error messages
 * @param model - Mongoose model for the entity
 * @param id - ID of the entity to update
 * @param updateData - Data to update the entity
 * @param user - JWT payload containing user information
 * @returns The updated entity
 * @throws NotFoundException if the entity is not found or already deleted
 * @throws Error if no data is provided
 */
export async function updateEntity<T extends BaseDocument, U>(
  entityName: string,
  model: Model<T>,
  id: string,
  updateData: U,
  user: JwtPayload,
): Promise<T> {
  if (!isValidObjectId(id)) {
    throw new NotFoundException(`${entityName} not found: Invalid ID`);
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error(`${entityName} update failed: No data provided`);
  }

  const doc = await model.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    {
      ...updateData,
      updatedBy: user.sub,
    },
    { new: true },
  );

  if (!doc) {
    throw new NotFoundException(`${entityName} not found or already deleted`);
  }

  return doc;
}

/**
 * Finds an entity by ID, ensuring it is not soft-deleted.
 * @param entityName - Name of the entity for error messages
 * @param model - Mongoose model for the entity
 * @param id - ID of the entity to find
 * @returns The found entity
 * @throws NotFoundException if the entity is not found or already deleted
 */
export async function findEntity<T extends BaseDocument>(
  entityName: string,
  model: Model<T>,
  id: string,
): Promise<T> {
  if (!isValidObjectId(id)) {
    throw new NotFoundException(`${entityName} not found: Invalid ID`);
  }

  const doc = await model.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
  if (!doc) {
    throw new NotFoundException(`${entityName} not found or already deleted`);
  }

  return doc;
}
