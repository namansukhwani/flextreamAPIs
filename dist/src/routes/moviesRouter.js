"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const importantRegex_1 = require("../util/importantRegex");
const trendingService_1 = __importDefault(require("../services/trendingService"));
const moviesRouter = express_1.default.Router();
const trendingService = new trendingService_1.default();
moviesRouter.get("/trending", (req, res, next) => {
    const { limit } = req.query;
    if (limit && importantRegex_1.numberOnlyRegx.test(limit))
        trendingService.getTreanding(res, next, parseInt(limit));
    else
        trendingService.getTreanding(res, next);
});
exports.default = moviesRouter;
//# sourceMappingURL=moviesRouter.js.map