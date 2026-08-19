import  {errorClass}  from "./errorClass.js"

export const passwordChecker = [
    {
        checker: function (password) {
            return password && typeof password === "string"
        },
        message: "Password field is missing or isn't string!",
        status: 400
    },
    {
        checker: function (password) {
            return /^.{8,16}$/.test(password)
        },
        message: "Password must be between 8 to 16 characters long",
        status: 422
    },
    {
        checker: function (password) {
            return /(?=.*[a-z])/.test(password)
        },
        message: "Password must contain at least one lowercase character",
        status: 422
    },
    {
        checker: function (password) {
            return /(?=.*[A-Z])/.test(password)
        },
        message: "Password must contain at least one uppercase letter",
        status: 422
    },
    {
        checker: function (password) {
            return /(?=.*[0-9])/.test(password)
        },
        message: "Password must contain at least one digit",
        status: 422
    },
    {
        checker: function (password) {
            return /(?=.*[!#$&?])/.test(password)
        },
        message: "Password must contain one special character",
        status: 422
    },
    {
        checker: function (password) {
            return /^(?:(.)(?!\1))*$/.test(password)
        },
        message: "Password cannot have 3 or more repeating characters one after the other",
        status: 422
    }

]

export const emailChecker = [
    {
        checker: function (email) {
            return email && typeof email === "string"
        },
        message: "Email field is missing or isn't string!",
        status: 400
    },
    {
        checker: function (email) {
            return (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,254}$/.test(email))
        },
        message: "Invalid email",
        status: 422
    }
]

export const usernameChecker = [
    {
        checker: function (username) {
            return username && typeof username === 'string'
        },
        message: 'Username not present or is not type of string!',
        status: 400
    },
    {
        checker: function (username) {
            return /(?=.*[a-zA-Z])/.test(username)
        },
        message: 'Username must contain a letter!',
        status: 422
    },
    {
        checker: function (username) {
            return username.length >= 4 && username.length <= 16
        },
        message: 'Username must be 4-16 characters long!',
        status: 422
    }


]

export const nameChecker = [
    {
        checker: function (name) {
            return name && typeof name === "string"
        },
        message: "Name field is missing or isn't string!",
        status: 400
    },
    {
        checker: function (name) {
            return /^[A-Za-z]/.test(name)
        },
        message: "Name must only contain letters and apostrophes! ",
        status: 422
    },
    {
        checker: function (name) {
            return name.length > 2 && name.length < 21
        },
        message: "Name must be 3-20 characters long! ",
        status: 422
    }
]

export const titleChecker = [
    {
        checker: function (title) {
            return title && typeof title === "string"
        },
        message: "Title field is missing or isn't string!",
        status: 400
    },
    {
        checker: function (title) {
            return /^[a-zA-z0-9]+/.test(title)
        },
        message: "Title must contain letters!",
        status: 422
    },
    {
        checker: function (title) {
            return title.length > 2 && title.length < 21
        },
        message: "Title must be 3-20 characters long! ",
        status: 422
    }
]

export const contentChecker = [
    {
        checker: function (content) {
            return content && typeof content === "string"
        },
        message: "Content field is missing or isn't string!",
        status: 400
    },
    {
        checker: function (content) {
            return content.length >= 5 && content.length <= 200
        },
        message: "Note's content must be between 5-200 characters long!",
        status: 422
    },
    {
        checker: function (content) {
            return /^[a-zA-Z0-9]+/.test(content)
        },
        message: "Note must contain letters or numbers!",
        status: 422
    }
]

export const pageChecker = [
    {
        checker: function (_page) {
            return _page && typeof _page === 'string'
        },
        message: "_page is missing or is not a string!",
        status: 400
    },
    {
        checker: function (_page) {
            return !isNaN(_page) && parseInt(_page) > 0
        },
        message: "_page is not a positive integer!",
        status: 422
    }
]

export const limitChecker = [
    {
        checker: function (_limit) {
            return _limit && typeof _limit === 'string'
        },
        message: "_limit is missing or is not a string!",
        status: 400
    },
    {
        checker: function (_limit) {
            return !isNaN(_limit) && parseInt(_limit) > 0
        },
        message: "_limit is not a positive integer!",
        status: 422
    },
    {
        checker: function (_limit) {
            return parseInt(_limit) <= 20
        },
        message: "_limit must be at most 20!",
        status: 422
    }
]

export function fieldChecker(checker, field, error) {
    if (!checker[0].checker(field)) {
        error.title = "Error with user input"
        error.status = checker[0].status
        error.addmessages(checker[0].message)
        return
    }
    checker.slice(1).forEach(validation => {
        if (!validation.checker(field)) {
            error.title = error.title.length > 0 ? error.title : "Error with user input"
            error.status = Math.min(error.status, validation.status)
            console.log(validation.message)
            error.addmessages(validation.message)
        }
    })

}


