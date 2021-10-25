import express from "express";
import fetch from "node-fetch";
import axios from "axios";

const router = express.Router();

const validateRequest = (body) => {
  if ("username" in body && "password" in body && "url" in body) {
    if (body.username === "Hitman12355" && body.password === "qwerty123456") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

router.post("/", (req, res, next) => {
  if ("options" in req.body) {
    fetch(req.body.url, req.body.options)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
      })
      .catch((err) => {
        // console.log("error:::::::");
        res.statusCode = 500;
        res.json({ err: err });
        // next(err)
      });
  } else {
    fetch(req.body.url)
      .then((response) => response.json())
      .then((data) => {
        // console.log("DATA::::",data);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
      })
      .catch((err) => {
        // console.log("error:::::::");
        res.statusCode = 500;
        res.json({ err: err });
        // next(err)
      });
  }
});

router.get("/image", (req, res, next) => {
  if (req.query.url) {
    // axios
    //   .get(req.query.url as string)
    //   .then((response) => response.data)
    //   .then((data) => {
    //     res.statusCode = 200;
    //     res.set({
    //       "content-type": "image/jpeg",
    //     });
    //     console.log(data);
        
    //     res.end(data, "binary");
    //   });
    fetch(req.query.url)
      .then((responce) => responce.buffer())
      .then((data) => {
        res.statusCode = 200;
        res.set({
          "content-type": "image/jpeg",
        });
        res.end(data,'binary');
      })
      .catch((err) => {
        console.log(err);
        res.statusCode = 500;
        res.json({ err: err });
      });
  } else {
    var error = new Error("url query not available");
    res.statusCode = 500;
    res.send({ err: error });
    // next(err)
  }
});

export default router;
