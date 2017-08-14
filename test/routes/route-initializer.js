function routeInitializer(depPath, routeBase){
    const app = require('express')()
    require('../../src/binders/middleware-binder')(app, true)
    app.use(routeBase, require(depPath))
    return require('supertest')(app)
}

module.exports = routeInitializer