const Layer = require('express/lib/router/layer')
const AppError = require('./exception-custom')

Object.defineProperty(Layer.prototype, "handle", {
  enumerable: true,
  get: function() { return this.__handle; },
  set: function(fn) { this.__handle = wrap(fn) }
});

function wrap(fn) {
  return (req, res, next) => {
      try {
            const routePromise = fn(req, res, next)
            if (routePromise && routePromise.catch)
                routePromise.catch(err => continueToErrorMiddleware(err, next))
      } catch (err) {
            continueToErrorMiddleware(err, next)
      }
    }
};

function continueToErrorMiddleware(err, next){
    if(!err || !(err instanceof AppError) )
        err = new AppError()
    next(new AppError(err.message, err.status))
}