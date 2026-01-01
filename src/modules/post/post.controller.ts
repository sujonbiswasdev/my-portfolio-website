import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req:Request,res:Response)=>{
    res.send("create a new posts")
    try {
        const result = await postService.createPost(req.body)
        res.status(201).json(result)
    } catch (error) {
        
    }

}

export const postController={
    createPost
}