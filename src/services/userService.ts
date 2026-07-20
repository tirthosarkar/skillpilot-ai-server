import User from "../models/User";
import {
  IUserDocument,
  UserQueryParams,
  PaginationMeta,
} from "../types";
import { AppError } from "../utils/AppError";

/**
 * Returns a paginated list of users (admin use).
 */
export const getAllUsers = async (
  query: UserQueryParams
): Promise<{ users: IUserDocument[]; pagination: PaginationMeta }> => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    filter.$or = [
      {
        name: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Returns a single user by ID.
 */
export const getUserById = async (
  id: string
): Promise<IUserDocument> => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Update own profile.
 */
export const updateUserProfile = async (
  id: string,
  data: Partial<Pick<IUserDocument, "name" | "email">>
): Promise<IUserDocument> => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Admin update user.
 */
export const adminUpdateUser = async (
  id: string,
  data: Partial<Pick<IUserDocument, "name" | "email" | "role">>
): Promise<IUserDocument> => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Delete user.
 */
export const deleteUser = async (
  targetId: string,
  requesterId: string
): Promise<void> => {
  if (targetId === requesterId) {
    throw new AppError("You cannot delete your own account", 400);
  }

  const user = await User.findByIdAndDelete(targetId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
};