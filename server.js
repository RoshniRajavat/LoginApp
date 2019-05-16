
var express = require('express');
var jwt = require('jsonwebtoken');
var fs = require("fs");

var app = express();

app.use(function (req, res, next) {
    if (req.query.username && req.query.password) {
        // console.log(req.query.username);
        var content = JSON.parse(fs.readFileSync("LoginData.json")).loginData;
        content.find(data => {
            if (data.userName === req.query.username && data.password === req.query.password) {
                var token = jwt.sign({ username: req.query.username, password: req.query.password }, 'supersecret', { expiresIn: 1200 });
                req.query.token = token;
            }
        })
    }
    next();
});

app.get('/', function (req, res) {
    if (req.query.token) {
        res.redirect(`/home?token=${req.query.token}`);
    }
    res.sendFile("./login.html",{root: __dirname});
})

app.get('/home', function (req, res) {
    var token = req.query.token;
    jwt.verify(token, 'supersecret', function (err, decoded) {
        if (!err) {
            res.send(`<b>This is Home Page</b><br><br>
            <b>User is logged In</b><br><br>
            <a href='/?token=${token}'> Login </a><br>
            <a href='/detail?token=${token}'> Detail </a><br>
            <a href='/'> logout </a>`);
        } else {
            res.send(err + `<br><b>Authentication Failed</b><br><a href='/'> Login </a>`);
        }
    })
});

app.get('/detail', function (req, res) {
    var token = req.query.token;
    res.send(`<b>This is detail Page</b><br><br>
    <p>Token: ${token}</p><br><br>
    <a href='/?token=${token}'> Login </a><br>
    <a href='/Home?token=${token}'> Home </a><br>
    <a href='/'> logout </a>`);
});

app.listen('3000');