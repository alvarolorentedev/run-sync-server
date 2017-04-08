const User = require('./model');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('config');


module.exports = {
    find: function(query, fields, callback) {
        User.find(query, fields, {
            lean: true,
            sort: {
                updated: -1
            }
        }, callback);
    },
    findOne: function(query, fields, callback) {
        User.findOne(query, fields, {
            lean: true
        }, callback);
    },
    create: function(payload, callback) {
        new User(payload).save((err, result) => {
            if (result) {
                result = result.toObject();
            }
          return callback(err, result);
        });
    },
    update: function(query, payload, callback) {
        delete payload._id;
        User.findOneAndUpdate(query, payload, {
            new: true
        }, callback);
    },
    remove: function(query, callback) {
        User.findOneAndRemove(query, callback);
    },

    createToken: function (email) {
        var payload = {
            sub: email,
            exp: moment().add(1, 'day').unix()
        };
        return jwt.sign(payload, config.SECRET);
    },

    verifyAuth: function (token, callback) {
        if (token) {
            jwt.verify(token, config.SECRET, function (err, payload) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    }
};
