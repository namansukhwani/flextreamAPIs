"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get('/', function (_req, res, _next) {
    res.render('index', { title: 'VPN API' });
});
router.get('/readiness', (_req, res, _next) => {
    res.send();
});
exports.default = router;
//# sourceMappingURL=index.js.map