const express = require('express'),
      middlewareBinder = require('./binders/middleware-binder'),
      routeBinder = require('./binders/route-binder'),
      port = process.env.PORT || 8080,
      app = express()

middlewareBinder(app)
routeBinder(app)

app.listen(port)
