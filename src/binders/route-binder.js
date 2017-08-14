function routeBinder(app){
    app.use('/nike', require('../routes/nike'))
    app.use('/endomondo', require('../routes/endomondo'))
    app.use('/runtastic', require('../routes/runtastic'))
}

module.exports = routeBinder
