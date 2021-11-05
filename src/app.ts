import dotenv from 'dotenv'
import createError from 'http-errors'
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import ResponseError from './util/dto/ResponseError';

import indexRouter from './routes/index'
import  fetchRouter from './routes/fetch'
import moviesRouter from './routes/moviesRouter';
import configration from './configration';
import redisService from './services/redisService';

dotenv.config();
configration.config();
redisService.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('x-powered-by')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: process.env.NODE_ENV === "development" ? "*" : ["https://flextream.vercel.app"],
  credentials: true
}))

app.use('/', indexRouter);
app.use('/fetch', fetchRouter);
app.use('/movies',moviesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err:ResponseError, req:Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
