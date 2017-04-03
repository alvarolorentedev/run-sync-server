const UserService = require('./service');

module.exports = {
  list: (request, response, next) => {
    UserService.find({}, {
      _id: 1,
      email: 1,
      role: 1
    }, (err, results) => {
      if (err) {
        return next(err);
      }
      return response.status(200).json({
        data: results
      });
    });
  },
  register: (request, response, next) => {
    UserService.create(request.body, (err, result) => {
      if (err) {
        return next(err);
      }
      delete result['password'];
      return response.status(201).json({
        data: result
      });
    });
  },
  fetch: (request, response, next) => {
    UserService.findOne({ _id: request.params.id }, {
      _id: 1,
      email: 1,
      created: 1,
      updated: 1,
      role: 1
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      if (!result) {
        return response.status(404).json({
          error: 'User not found.'
        });
      }
      return response.status(200).json({
        data: result
      });
    });
  },
  fetchUser: (request, response, next) => {
    UserService.findOne({email: request.params.email} ,{
      _id: 1,
      email: 1,
      created: 1,
      updated: 1,
      role: 1
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      if (!result) {
        return response.status(404).json({
          error: 'User not found.'
        });
      }
      return response.status(200).json({
        data: result
      });
    });
  },
  update: (request, response, next) => {
    UserService.update({ _id: request.params.id }, request.body, (err, result) => {
      if (err) {
        return next(err);
      }
      return response.status(200).json({
        data: result
      });
    });
  },
  remove: (request, response, next) => {
    UserService.remove({
      _id: request.params.id
    }, (err, removedDoc) => {
      if (err) {
        return next(err);
      }
      if (!removedDoc) {
        return response.status(404).json({
          error: 'User not found.'
        });
      }
      return response.status(200).json({});
    });
  },
  generateToken: (request, response, next) => {
    return response.status(200).json({
      message: 'hi'
    });
  }
};
