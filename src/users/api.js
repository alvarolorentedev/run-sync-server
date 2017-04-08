const UserService = require('./service');

module.exports = {
  list: (request, response, next) => {
    UserService.find({}, {
      _id: 1,
      email: 1,
      isVerified: 1,
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
          data: result,
          message: 'Welcome to run-sync, you are now logged in',
          token: UserService.createToken(result.email),
      });
    });
  },
  fetch: (request, response, next) => {
    UserService.findOne({ _id: request.params.id }, {
      _id: 1,
      email: 1,
      created: 1,
      updated: 1,
      isVerified: 1,
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
      isVerified: 1,
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


  login: (request, response, next) => {
    UserService.findOne({email: request.body.email}, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return response.status(401).json({
          error: 'Invalid email/password.'
        });
      }
      user.comparePwd(request.body.password, (err, isMatch) => {
        if (!isMatch) {
          return response.status(401).send({ message: 'Invalid email/password' });
        }
        return response.status(200).json({
          message: 'You are now logged in', 
          token: UserService.createToken(user.email)
        });
      });
    });
  },

  verifyAuth: (request, response, next) => {
    const token = request.headers['x-access-token'];
    if (!token) {
      return response.status(403).send({
        message: 'No token provided.'
      });
    } else {
      UserService.verifyAuth(token, (err) => {
        if (err) {
          return response.status(403).send({
            message: 'Failed to authenticate token.'
          });
        } else {
          next();
        }
      });
    }
  },

  generateToken: (request, response, next) => {
    return response.status(200).json({
      message: 'hi'
    });
  }
};
