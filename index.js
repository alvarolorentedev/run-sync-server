const app = require('./server');
// const cluster = require('cluster');
const logger = require('pino')({
  enabled: process.env.NODE_ENV !== 'test'
});

const port = process.env.PORT || 8080;
const numWorkers = require('os').cpus().length;

// if (cluster.isMaster) {

//   for (let i = 0; i < numWorkers; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', function(worker, code, signal) {
//     logger.info(`Worker ${ worker.process.pid } died with code: ${ code }, and signal: ${ signal }`);
//     cluster.fork();
//   });
// } else {
  app.listen(port, function(error) {
    if (error) {
      logger.error('Unable to bind to port: ', port, error);
    } else {
      logger.info(`Worker ${ process.pid } listening on port: ${ port }`);
    }
  });
// }
