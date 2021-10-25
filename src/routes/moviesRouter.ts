import express, { NextFunction, Response, Request } from "express";
import { numberOnlyRegx } from "../util/importantRegex";
import TrendingService from "../services/trendingService";

const moviesRouter = express.Router();
const trendingService = new TrendingService();

// moviesRouter.get(
//   "/featured/:genre/genre",
//   (req: Request, res: Response, next: NextFunction) => {
//     const { genre } = req.params;
//   }
// );

moviesRouter.get(
  "/trending",
  (req: Request, res: Response, next: NextFunction) => {
    const { limit } = req.query;
    if (limit && numberOnlyRegx.test(limit as string))
      trendingService.getTreanding(res, next, parseInt(limit as string));
    else trendingService.getTreanding(res, next);
  }
);

export default moviesRouter;
