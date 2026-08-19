import { jwtDecode } from 'jwt-decode'
import { Note } from '../models/note.schema.js'
import { User } from '../models/user.schema.js'
import { authCheck, noteIdCheck } from '../middleware/auth.js'
import { titleChecker, contentChecker, fieldChecker, pageChecker, limitChecker } from './lib/fieldChecker.js'
import { errorClass } from './lib/errorClass.js'
import { header, matchedData, oneOf, param, query, body, validationResult, checkExact } from 'express-validator'
import express from 'express'
import mongoose from 'mongoose'

export const notesRouter = express.Router()




notesRouter.post('/', authCheck, async (request, response, next) => {
    const userId = request.user.id
    const { title, content } = request.body
    const error = new errorClass("", 999, [])
    fieldChecker(titleChecker, title, error)
    fieldChecker(contentChecker, content, error)
    if (!error.noErrorsPresent()) {
        return next(error)
    }
    try {
        const user = await User.findById(userId)
        if (!user) {
            error.title = "Error with user id"
            error.status = min(401, error.status)
            error.addmessages("No user with this id found")
            return next(error)
        }
        const savedNote = await Note.create({
            title: title,
            author: userId,
            content: content
        })
        response.status(201).send({
            title: title,
            author: {
                name: user.name,
                email: user.email,
            },
            content: content,
            userId: userId,
            _id: savedNote._id
        })
    } catch (err) {
        console.log(err)
        const error = new errorClass("Error while trying to add a note", 500, [])
        return next(error)
    }
})

notesRouter.put('/:_id', authCheck, noteIdCheck, async (request, response, next) => {
    const userId = request.user.id
    const content = request.body.content
    const _id = request.params._id
    const error = new errorClass("", 999, [])
    fieldChecker(contentChecker, content, error)
    if (!error.noErrorsPresent()) {
        return next(error)
    }
    try {
        const note = await Note.findById(_id)
        if (!note) {
            error.title = "Error with user input"
            error.status = 404
            error.addmessages("Note doesn't exist!")
            return next(error)
        }
        if (!note.author.equals(userId)) {
            error.title = "Error with user input"
            error.status = 401
            error.addmessages("Note doesn't belong to the user!")
            return next(error)
        }
        await Note.findByIdAndUpdate(_id, { content: content })
        response.status(200).end()
    } catch (err) {
        console.log(err)
        const error = new errorClass("Error while trying to add a note", 500, [])
        return next(error)
    }
})

notesRouter.delete('/:_id', authCheck, noteIdCheck, async (request, response, next) => {
    const userId = request.user.id
    const _id = request.params._id
    const error = new errorClass("", 999, [])
    try {
        const note = await Note.findById(_id)
        if (!note) {
            error.title = "Error with user input"
            error.status = 404
            error.addmessages("Note doesn't exist!")
            return next(error)
        }
        if (!note.author.equals(userId)) {
            error.title = "Error with user input"
            error.status = 401
            error.addmessages("Note doesn't belong to the user!")
            return next(error)
        }
        await Note.findByIdAndDelete(_id)
        response.status(204).end()
    } catch (err) {
        console.log(err)
        const error = new errorClass("Error while trying to add a note", 500, [])
        return next(error)
    }
})


//Things we learnt: query, validationResult and express-validator
notesRouter.get('/', async (request, response, next) => {
    var { _page, _limit } = request.query
    const error = new errorClass("", 999, [])
    fieldChecker(pageChecker, _page, error)
    fieldChecker(limitChecker, _limit, error)
    if (!error.noErrorsPresent()) {
        return next(error)
    }
    _page = parseInt(_page)
    _limit = parseInt(_limit)
    try {
        //Because why we'll bring the whole database for counting???
        const totalNotes = await Note.countDocuments()
        console.log(totalNotes)
        if (totalNotes === 0) {
            return response.status(200).set( 'x-total-count', totalNotes).json([])
        }
        const offset = _limit * (_page - 1)
        if (offset >= totalNotes) {
            const error = new Error("Page exceeded the maximum notes in the system")
            error.status = 404
            return next(error)
        }
        //Use this to bring the the ones you want. Things we learnt: .skip(), .limit()
        const neededNotes = await Note.find({}).sort('-createdAt').skip(offset).limit(_limit).populate('author', 'name email').exec()
        const notesForFrontEnd = []
        neededNotes.forEach(note => {
            const newNote = {
                title: note.title,
                author: {
                    name: note.author.name,
                    email: note.author.email
                },
                content: note.content,
                userId: note.author._id,
                _id: note._id
            }
            notesForFrontEnd.push(newNote)
        })
        response.status(200).set(
            {
                'x-total-count': totalNotes
            }
        ).json(notesForFrontEnd)
    } catch (err) {
        console.log(err)
        const error = new errorClass("Error while trying to add a note", 500, [])
        return next(error)
    }
})

