import express from 'express'
import { postRouter } from './modules/post/post.route'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
const app=express()
// middleware
app.use(cors({origin:process.env.APP_URL}))
app.all("/api/auth/*splat", toNodeHandler(auth));
// post route
app.use("/posts",postRouter.router)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app