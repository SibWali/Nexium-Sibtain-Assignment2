import mongoose, { Schema, models } from 'mongoose';

const BlogSchema = new Schema(
  {
    url: { type: String, unique: true },
    content: String,
  },
  { timestamps: true }
);

export default models.Blog || mongoose.model('Blog', BlogSchema);
