const exceptionHandler = require('express-exception-handler')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')


function middlewareBinder(app, isTest = false){
    exceptionHandler.handle()
    app.use(helmet())
    app.use(bodyParser.json())
    app.use(exceptionHandler.middleware)
    app.use(cors({
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }))
    if(!isTest)
        app.use(morgan('combined'))
}

module.exports = middlewareBinder
