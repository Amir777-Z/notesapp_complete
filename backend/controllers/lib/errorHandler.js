export const errorHandler = function (err, request, response, next) {
    console.log(err.status)
    response.status(err.status).json({
        title:err.title,
        messages:err.messages
    })
}
