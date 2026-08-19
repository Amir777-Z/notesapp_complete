import express, { json } from 'express'
import cors from 'cors'
import { errorHandler } from './controllers/lib/errorHandler.js'
import { userRouter, loginRouter } from './controllers/users.controller.js'
import { notesRouter } from './controllers/notes.controller.js'
import mongoose from "mongoose"

const app = express()

var corsOptions = {
  exposedHeaders:'x-total-count'  //if we don't have it, the response in the client won't see it 
}
app.use(cors(corsOptions))
app.use(json())

try {
  mongoose.connect(process.env.MONGOURI, { family: 4 }) //connecting, and family is for ipv(either 4/6)
  console.log('Connected to mongo')
} catch (error) {
  console.log(error)
  process.exit(1)
}



const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Query:  ', request.query)
  console.log('---')
  next()
}

//app.use(requestLogger)
app.use('/notes', notesRouter)
app.use('/user', userRouter)
app.use('/login', loginRouter)
app.use(errorHandler)


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

if (!process.env.SECRET) {
  process.exit(1)
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})