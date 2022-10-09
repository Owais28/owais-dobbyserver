var express = require('express');
var api = express.Router();

api.post('/login', (req,res) => {
    console.log(req.body);
    res.json({
        message : "Login"
    })
})

module.exports = api