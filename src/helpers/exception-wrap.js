function exceptionWrap(fn) {  
    return (req, res, next) => {
        const routePromise = fn(req, res, next)
        if (routePromise.catch) {
            routePromise.catch(err => next(new Error(err)))
        }
    }
}

module.exports = exceptionWrap
