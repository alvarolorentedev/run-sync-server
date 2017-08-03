const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const exceptionMiddleware = require('./helpers/exception-middleware')


const port = process.env.PORT || 8080
const app = express()

app.use(helmet())
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(exceptionMiddleware)
app.use(cors({
  origin: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use('/nike', require('./routes/nike'))
app.use('/endomondo', require('./routes/endomondo'))

app.listen(port)
