const logger = require('pino')({
  enabled: process.env.NODE_ENV !== 'test'
});

module.exports = (request, response) => {
    logger.info('404', {
      query: request.query
    });
    return response.status(404).json({
      error: 'No route match'
    });
};
