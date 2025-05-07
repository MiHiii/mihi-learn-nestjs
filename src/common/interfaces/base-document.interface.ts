import { Types } from 'mongoose';

// Interface cho document Mongoose
export interface BaseDocument {
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  isDeleted?: boolean;
  deletedAt?: Date;
}
