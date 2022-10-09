var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/user");

exports.signup = (req, res) => {
    // console.log(req.body)
    const user = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    console.log(user)

    user.save((err, user) => {
        if (err) {
            res.status(500)
                .send({
                    message: err
                });
            return;
        } else {
            res.status(200)
                .send({
                    message: "User Registered successfully"
                })
        }
    });
};