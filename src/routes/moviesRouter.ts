import express, { NextFunction, Response, Request } from "express";
import { numberOnlyRegx } from "../util/importantRegex";
import TrendingService from "../services/trendingService";
import Genre from './../services/dto/genre.dto';
import FeaturedService from './../services/featuredService';
import MovieService from './../services/movieService';

const moviesRouter = express.Router();
const trendingService = new TrendingService();
const featuredService = new FeaturedService();
const movieService=new MovieService();

moviesRouter.get('/name/:name/slug/:slug',
  (req: Request, res: Response, next: NextFunction) => {
    const {name,slug}=req.params;
    movieService.getMovie(res,next,name,slug);
  }
)

moviesRouter.get('/list/:type',
(req: Request, res: Response, next: NextFunction)=> {
  const {type}=req.params;
  movieService.getMoviesList(res,next,type);
}
)

moviesRouter.get(
  "/featured/:genre/genre",
  (req: Request, res: Response, next: NextFunction) => {
    const { genre } = req.params;
    const { page } = req.query;
    if (genre in Genre) {
      parseInt(page as string)
        ? featuredService.getFeaturedMovies(res, next, genre as Genre, parseInt(page as string))
        : featuredService.getFeaturedMovies(res, next, genre as Genre);
    }
    else {
      res.statusCode = 400;
      res.send({ statusCode: 400, message: "Genre not available" })
    }

  }
);

moviesRouter.get(
  "/trending",
  (req: Request, res: Response, next: NextFunction) => {
    const { limit } = req.query;
    if (limit && numberOnlyRegx.test(limit as string))
      trendingService.getTreanding(res, next, parseInt(limit as string));
    else trendingService.getTreanding(res, next);
  }
);

moviesRouter.get("/trending/extraDetails",
(req: Request, res: Response, next: NextFunction) => {
  trendingService.getTreandingHome(res, next);
}
)

export default moviesRouter;
