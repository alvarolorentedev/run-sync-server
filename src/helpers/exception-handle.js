const Layer = require('express/lib/router/layer')
const AppError = require('./exception-custom')

Object.defineProperty(Layer.prototype, "handle", {
  enumerable: true,
  get: function() { return this.__handle; },
  set: function(fn) {
    if (isAsync(fn))
        fn = wrap(fn)
    this.__handle = fn
  }
});

function isAsync(fn) {
  const type = Object.toString.call(fn.constructor)
  return type.indexOf('AsyncFunction') !== -1
};

function wrap(fn) {
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
};