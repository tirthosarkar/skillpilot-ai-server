import mongoose from 'mongoose';
import { ICourseDocument } from '../types';

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  content: { type: String, required: true },
});

const CourseSchema = new mongoose.Schema<ICourseDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    category: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
      index: true,
    },
    duration: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    thumbnail: { type: String, required: true },
    price: { type: Number, default: 0, min: 0 },
    enrolledCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false, index: true },
    curriculum: [ModuleSchema],
  },
  { timestamps: true }
);

// Text index for full-text search on title + description
CourseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model<ICourseDocument>('Course', CourseSchema);
export default Course;
