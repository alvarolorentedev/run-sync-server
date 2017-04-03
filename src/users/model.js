const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      validate: value => validator.isEmail(value),
      unique : true,
      dropDups: true
    },
    password: {
        type: String,
        required: true,
        validate: value => !validator.isEmpty(value)
    },
    created : {
      type : Date,
      default : Date.now()
    },
    updated: {
      type: Date,
      default: Date.now
    },
    role: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });


userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
 
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
 
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
             user.password = hash;
            next();
        });
    });
});


module.exports = mongoose.model('User', userSchema);
