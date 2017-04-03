const User = require('./model');

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
    }
};
