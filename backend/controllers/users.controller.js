import { User } from '../models/user.schema.js';
import { emailChecker, fieldChecker, nameChecker, passwordChecker, usernameChecker } from './lib/fieldChecker.js'
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt'
import express from 'express'
import { checkExact, body } from 'express-validator';
import { errorClass } from './lib/errorClass.js';
import { Mongoose, sanitizeFilter } from 'mongoose';
const userRouter = express.Router()
const loginRouter = express.Router()




userRouter.post('/',
    async (request, response, next) => {
        const error = new errorClass("", 999, [])
        const { name, email, username, password } = request.body
        fieldChecker(nameChecker, name, error)
        fieldChecker(emailChecker, email, error)
        fieldChecker(usernameChecker, username, error)
        fieldChecker(passwordChecker, password, error)
        if (!error.noErrorsPresent()) {
            return next(error)
        }
        try {
            const existingUser = await User.findOne({ email: email })
            if (existingUser) {
                error.title = "Error while trying to create a user"
                error.addmessages("An account with this email is already registered")
                error.status = 422
                return next(error)
            }
            const hashedPassword = await hash(password, 10)
            await User.create({
                name: name,
                email: email,
                username: username,
                hashedPassword: hashedPassword
            })
            response.status(201).send("User created succesfually")
        }
        catch (err) {
            error.title = "Failed to create a user"
            error.addmessages("Internal server error")
            error.status = 500
            return next(error)
        }

    }
)

loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body
    const error = new errorClass("", 999, [])

    if (!passwordChecker[0].checker(password)) {
        error.title = "Error with user input"
        error.status = passwordChecker[0].status
        error.addmessages(passwordChecker[0].message)
    }

    if (!usernameChecker[0].checker(username)) {
        error.title = "Error with user input"
        error.status = usernameChecker[0].status
        error.addmessages(usernameChecker[0].message)
    }

    if (!error.noErrorsPresent()) {
        return next(error)
    }
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            error.title = "Error with login"
            error.status = 404
            error.addmessages("User not found")
            return next(error)
        }

        const passwordCorrect = await compare(password, user.hashedPassword)
        if (!passwordCorrect) {
            error.title = "Error with login"
            error.status = 422
            error.addmessages("Password is not correct")
            return next(error)
        }
        const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
        response.status(200).send({ token: token, username: user.username, name: user.name })
    } catch (err) {
        console.print(err)
        error.title = "Failed to add user"
        error.addmessages("Internal server error")
        error.status = 500
        return next(error)
    }

})

export { userRouter, loginRouter }

