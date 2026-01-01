import express from 'express'
import { postRouter } from './modules/post/post.route'
const app=express()

// post route
app.use("/posts",postRouter.router)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app