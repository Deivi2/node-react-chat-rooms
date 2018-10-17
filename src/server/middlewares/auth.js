const {User} = require('./../modals/user');


let auth = (req, res, next) => {
    let token = req.cookies.x_auth;

    User.findByToken(token,(err, user) => {
        if (err) return res.json({'err': err});

        req.user = user;
        req.token = token;

        next();

    })


};

module.exports = {auth};
