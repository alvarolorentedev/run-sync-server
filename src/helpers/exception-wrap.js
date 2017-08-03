
const AppError = require('../helpers/exception-custom')

function exceptionWrap(fn) {  
    return (req, res, next) => {
        const routePromise = fn(req, res, next)
        if (routePromise.catch) {
            routePromise.catch(err => {
                if(!err || !(err instanceof AppError) )
                    err = new AppError()
                next(new AppError(err.message, err.status))
            })
        }
    }
}

module.exports = exceptionWrap
