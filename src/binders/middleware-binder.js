const exceptionHandler = require('express-exception-handler')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')


function middlewareBinder(app){
    exceptionHandler.handle()
    app.use(helmet())
    app.use(morgan('combined'))
    app.use(bodyParser.json())
    app.use(exceptionHandler.middleware)
    app.use(cors({
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }))
}

module.exports = middlewareBinder
