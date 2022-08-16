import axios from "axios";
import { NextFunction, Request, Response } from "express";
import cheerio from "cheerio";
import { trendingScrappedResponse } from "./dto/trendingResponse.dto";
import redisService from './redisService';
import { getMovieWithDetails } from "../util/commonFunctions";

export default class TrendingService {
  private url = "https://yts.mx/trending-movies";
  private apiUrl = `https://yts.mx/api/v2/list_movies.json?limit=6&${encodeURIComponent(
    "query_term"
  )}=`;

  async getTreandingHome(
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const redisKeyTrendingHome = this.getRedisKeyTrendingHome();
      let moviesExtra = await redisService.getValue(redisKeyTrendingHome)
      if (!moviesExtra) {
        console.log(`Nothing in cache moviesExtra(${moviesExtra})`);
        const movies = await this.getMoviesIfNotInCache();
        moviesExtra = await this.getMoviesExtraIfNotInCache(movies);
      }
      res.statusCode = 200;
      res.send(moviesExtra);
    } catch (e) {
      console.error(`Error:`, e);
      next(e);
    }

  }

  async getTreanding(
    res: Response,
    next: NextFunction,
    limit?: number
  ): Promise<void> {
    try {
      const redisKey = this.getRedisKey();
      let movies = await redisService.getValue(redisKey);
      if (!movies) {
        movies = await this.getMoviesIfNotInCache();
        this.getMoviesExtraIfNotInCache(movies);
      }
      movies = this.getLimitedList(movies, limit)
      res.statusCode = 200;
      res.send(movies);
    } catch (e) {
      console.error(`Error:`, e);
      next(e);
    }
  }

  private async getMovie(name: string, slug: string): Promise<unknown> {
    try {
      const { data }: { data: any } = await axios.get(
        `${this.apiUrl}${encodeURIComponent(name)}`
      );
      return data?.data?.movies?.find((movie: { slug: string; }) => movie.slug.trim() == slug.trim());
    } catch (e) {
      throw new Error(`Error from API call: ${e.message}`);
    }
  }

  private async scrapMovies(): Promise<trendingScrappedResponse[]> {
    try {
      const { data } = await axios.get(this.url);

      const $ = cheerio.load(data as string);
      const allMovieDivs = $(".browse-movie-title");
      console.info("No of movies scraped:", allMovieDivs.length);

      let searchList = [];
      allMovieDivs.each((i, el) => {
        if ($(el).is("a")) {
          $(el).find('span').remove();
          const name = $(el).text();
          const slug = $(el).attr("href");

          searchList.push({
            id: i + 1,
            name: name.trim(),
            slug: slug.substring(slug.lastIndexOf("/") + 1),
          });
        }
      });

      // console.log("movie data", searchList);
      return searchList;
    } catch (e) {
      throw new Error(`Error from data scraping: ${e.message}`);
    }
  }

  private async getMovies(
    moviesList: trendingScrappedResponse[],
  ): Promise<unknown> {

    const promises = [];
    for (const data of moviesList) {
      promises.push(this.getMovie(data.name, data.slug));
    }

    let allMovies = await Promise.all(promises);
    console.info("Parallel API calls: ", allMovies.length);
    allMovies=allMovies.filter(movie=>movie)
    // const filterMovies = allMovies.filter(movie => movie);

    // console.info("Filtered Movies:", filterMovies.length);

    return allMovies;
  }

  private getLimitedList(
    moviesList: [any],
    limit: number
  ): trendingScrappedResponse[] {
    if (limit)
      return moviesList.length > limit
        ? moviesList.slice(0, limit)
        : moviesList;
    return moviesList;
  }

  private getRedisKey(): string {
    return 'movies:trending'
  }

  private getRedisKeyTrendingHome(): string {
    return `movies:trending:homeView:8`
  }

  private async getMovieWithExtraData(movies: any): Promise<unknown> {
    console.info("Fetching movies with extra info: ", movies.length);
    const promises = [];
    for (const data of movies) {
      promises.push(getMovieWithDetails(data.id));
    }

    return await Promise.all(promises);
  }

  private async getMoviesIfNotInCache(): Promise<unknown> {
    const redisKey = this.getRedisKey();
    const scrappedMovies = await this.scrapMovies();
    const movies = await this.getMovies(scrappedMovies);
    redisService.setValue(redisKey, movies as JSON);
    return movies;
  }

  private async getMoviesExtraIfNotInCache(movies: any): Promise<unknown> {
    movies = this.getLimitedList(movies, 8)
    const redisKey = this.getRedisKeyTrendingHome();
    const moviesExtra = await this.getMovieWithExtraData(movies);
    redisService.setValue(redisKey, moviesExtra as JSON);
    return moviesExtra;
  }

}
