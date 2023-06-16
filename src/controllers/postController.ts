import { Response, Request } from "express";
import PostModel from '../models/Post';
import { Error, Document } from "mongoose";
import { handleErrors } from './userController';

interface CreatePost extends Request {
  userId: string,
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts)
  } catch (error) {
    return handleErrors(error, res, 500, "Error, The items could not be received");
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewCount: 1 }
      },
      {
        returnDocument: 'after'
      }
    );

    if (!doc) {
      return res.status(500).json({ message: 'The article could not be found' });
    }

    res.json(doc);
  } catch (error) {
    return handleErrors(error, res, 500, "Error, The items could not be received");
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({ _id: postId }).exec();

    if (!doc) {
      return res.status(404).json({ message: 'The article could not be found' });
    }

    res.json({ success: true });
  } catch (error) {
    return handleErrors(error, res, 500, "The items could not be received");
  }
}

export const update = async (req: CreatePost, res: Response) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({ succes: true })
  } catch (error) {
    return handleErrors(error, res, 500, "The article was not found");
  }
}




export const create = async (req: CreatePost, res: Response) => {
  try {
    const document: Document = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await document.save();

    res.json(post);

  } catch (error) {
    return handleErrors(error, res, 500, "Error, The article could not be created");
  }
}