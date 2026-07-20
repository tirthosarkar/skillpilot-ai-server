import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  id: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// ─── Course ──────────────────────────────────────────────────────────────────

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface IModule {
  title: string;
  duration: string;
  content: string;
}

export interface ICourse {
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: CourseLevel;
  duration: string;
  rating: number;
  thumbnail: string;
  price: number;
  enrolledCount: number;
  isPublished: boolean;
  curriculum: IModule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseDocument extends ICourse, Document {}

// ─── AI / Chat ───────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'ai';

export interface IMessage {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface IAIChat {
  user: Types.ObjectId;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Recommendation ──────────────────────────────────────────────────────────

export type RecommendationType = 'Course' | 'Project' | 'Soft Skill';

export interface IRecommendation {
  user: Types.ObjectId;
  title: string;
  reason: string;
  type: RecommendationType;
}

// ─── Resume Analysis ─────────────────────────────────────────────────────────

export interface IMissingSkill {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Technical' | 'Soft Skill';
}

export interface ISuggestion {
  title: string;
  desc: string;
}

export interface IResumeAnalysis {
  user: Types.ObjectId;
  targetRole: string;
  atsScore: number;
  missingSkills: IMissingSkill[];
  suggestions: ISuggestion[];
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

export type NodeStatus = 'Pending' | 'InProgress' | 'Completed';
export type NodeType = 'Course' | 'Project' | 'Milestone';

export interface IRoadmapNode {
  _id?: Types.ObjectId;
  title: string;
  status: NodeStatus;
  type: NodeType;
}

export interface IRoadmap {
  user: Types.ObjectId;
  targetRole: string;
  nodes: IRoadmapNode[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request ─────────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: IUserDocument;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  pagination?: PaginationMeta;
  errors?: ValidationError[];
  stack?: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface CourseQueryParams {
  search?: string;
  category?: string;
  level?: CourseLevel;
  sort?: string;
  page?: string;
  limit?: string;
  isPublished?: string;
}

export interface UserQueryParams {
  page?: string;
  limit?: string;
  role?: UserRole;
  search?: string;
}

// ─── Gemini Service ───────────────────────────────────────────────────────────

export interface UserContext {
  targetRole: string;
  currentSkills: string[];
  experienceLevel: string;
}

export interface GeminiRecommendation {
  title: string;
  reason: string;
  type: RecommendationType;
}

export interface GeminiRecommendationsResult {
  recommendations: GeminiRecommendation[];
}

export interface GeminiResumeResult {
  atsScore: number;
  missingSkills: IMissingSkill[];
  suggestions: ISuggestion[];
}

export interface GeminiRoadmapNode {
  title: string;
  type: NodeType;
}

export interface GeminiRoadmapResult {
  nodes: GeminiRoadmapNode[];
}
