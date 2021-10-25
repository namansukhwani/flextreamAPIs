import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(_req, res, _next) {
  res.render('index', { title: 'VPN API' });
});

router.get('/readiness',(_req, res, _next)=>{
  res.send();
})

export default router;
