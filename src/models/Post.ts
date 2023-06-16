import mongoose, { Document, Model } from "mongoose";

interface Post extends Document {
  title: string,
  text: string,
  tags: string[],
  viewCount: number,
  user: mongoose.Schema.Types.ObjectId
  avatarUrl?: string
}

const PostSchema = new mongoose.Schema<Post>(
  {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    avatarUrl: String
  },
  {
    timestamps: true
  }
);

const PostModel: Model<Post> = mongoose.model<Post>('Post', PostSchema)

export default PostModel;