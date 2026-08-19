import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { errorClass } from '../controllers/lib/errorClass.js'


export function authCheck(request, response, next) {
    const authHeader = request.header('Authorization')
    if (!authHeader) {
        const error = new errorClass("Error with authorization"
            , 401
            , ["Author header is missing!"])
        return next(error)
    }

    const [bearerPrefix, token] = authHeader.split(' ')


    if (!bearerPrefix || bearerPrefix.toLowerCase() !== 'bearer') {
        const error = new errorClass("Error with authorization"
            , 401
            , ["Non-approved authorization"]
        )
        return next(error)
    }
    try {
        const approvedToken = jwt.verify(token, process.env.SECRET)
        request.user = approvedToken
        if (!mongoose.Types.ObjectId.isValid(request.user.id)) {
            const error = new errorClass("Error with authorization"
                , 401
                , ["UserId is not mongoid!"]
            )
            return next(error)
        }
    } catch (err) {
        console.log(err)
        const error = new errorClass("Error handling authorization"
            , 500
            , []
        )
        return next(error)
    }
    next()
}


export function noteIdCheck(request, response, next) {
    const _id = request.params._id
    if (typeof _id !== 'string') {
        const error = new errorClass("Error handling authorization"
            , 400
            , ["_id is not present or not of type String!"]
        )
        return next(error)
    }
    else if (!mongoose.Types.ObjectId.isValid(_id)) {
        const error = new errorClass("Error handling authorization"
            , 422
            , ["_id is not a valid mongoid!"]
        )
        return next(error)
    }
    next()
}