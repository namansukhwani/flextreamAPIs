const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const file_type = require('file-type');

const validateRequest = (body) => {
    if ("username" in body && "password" in body && "url" in body) {
        if (body.username === "Hitman12355" && body.password === "qwerty123456") {
            return true
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}

router.post('/', (req, res, next) => {
    if (validateRequest(req.body)) {
        if ("options" in req.body) {
            fetch(req.body.url, req.body.options)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                })
                .catch(err => {
                    // console.log("error:::::::");
                    res.statusCode = 500
                    res.json({ err: err })
                    // next(err)
                })
        }
        else {
            fetch(req.body.url)
                .then(response => response.json())
                .then(data => {
                    // console.log("DATA::::",data);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                })
                .catch(err => {
                    // console.log("error:::::::");
                    res.statusCode = 500
                    res.json({ err: err })
                    // next(err)
                })
        }
    }
    else {
        var err = new Error("Invalid user request either a wrong user or wrong body parameters.")
        next(err)
    }
})

router.get('/image', (req, res, next) => {
    if (req.query.url) {
        fetch(req.query.url)
            .then(responce => responce.buffer())
            .then(data => {
                // const base64String=new Buffer.from(data).toString('base64')
                // console.log(data);
                // console.log(base64String);
                res.statusCode = 200;
                res.set({
                    "content-type": "image/jpeg"
                })
                // res.send("data:image/jpg;base64,"+base64String)
                res.send(data)
            })
            .catch(err => {
                console.log(err);
                res.statusCode = 500
                res.json({ err: err })
            })
    }
    else {
        var error = new Error("url query not available");
        res.statusCode = 500;
        res.send({ err: error })
        // next(err)
    }

})

module.exports = router