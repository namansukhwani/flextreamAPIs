"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = express_1.default.Router();
const validateRequest = (body) => {
    if ("username" in body && "password" in body && "url" in body) {
        if (body.username === "Hitman12355" && body.password === "qwerty123456") {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
router.post("/", (req, res, next) => {
    if ("options" in req.body) {
        (0, node_fetch_1.default)(req.body.url, req.body.options)
            .then((response) => response.json())
            .then((data) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
            .catch((err) => {
            res.statusCode = 500;
            res.json({ err: err });
        });
    }
    else {
        (0, node_fetch_1.default)(req.body.url)
            .then((response) => response.json())
            .then((data) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
            .catch((err) => {
            res.statusCode = 500;
            res.json({ err: err });
        });
    }
});
router.get("/image", (req, res, next) => {
    if (req.query.url) {
        (0, node_fetch_1.default)(req.query.url)
            .then((responce) => responce.buffer())
            .then((data) => {
            res.statusCode = 200;
            res.set({
                "content-type": "image/jpeg",
            });
            res.end(data, 'binary');
        })
            .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.json({ err: err });
        });
    }
    else {
        var error = new Error("url query not available");
        res.statusCode = 500;
        res.send({ err: error });
    }
});
exports.default = router;
//# sourceMappingURL=fetch.js.map