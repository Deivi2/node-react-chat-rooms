const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT_I = 10;

require('dotenv').config();

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        unique: true,
    },
    role:{
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    online:{
        type: Boolean,
        default: false
    },
    token:{
        type: String,
    }
});

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


userSchema.methods.generateToken = function(cb){
    var user = this;

    var token = jwt.sign({id:user._id.toHexString()},process.env.SECRET);

    user.token = token;

    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
};

userSchema.statics.findByToken = function(token,cb){
    var user = this;

    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id":decode.id,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
};



const User = mongoose.model('User', userSchema);
module.exports = {User};
