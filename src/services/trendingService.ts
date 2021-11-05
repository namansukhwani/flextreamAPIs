import axios from "axios";
import { NextFunction, Request, Response } from "express";
import cheerio from "cheerio";
import { trendingScrappedResponse } from "./dto/trendingResponse.dto";
import redisService from './redisService';

export default class TrendingService {
  private url = "https://yts.mx/trending-movies";
  private apiUrl = `https://yts.mx/api/v2/list_movies.json?limit=6&${encodeURIComponent(
    "query_term"
  )}=`;

  async getTreanding(
    res: Response,
    next: NextFunction,
    limit?: number
  ): Promise<void> {
    try {
      const redisKey=this.getRedisKey();
      let movies=await redisService.getValue(redisKey);
      if(!movies){
        const scrappedMovies = await this.scrapMovies();
        movies = await this.getMovies(scrappedMovies);
        redisService.setValue(redisKey,movies);
      }
      movies=this.getLimitedList(movies,limit)
      res.statusCode = 200;
      res.send(movies);
    } catch (e) {
      console.error(`Error:`, e);
      next(e);
    }
  }

  private async getMovie(name: string,slug:string): Promise<unknown> {
    try {
      const { data }: { data: any } = await axios.get(
        `${this.apiUrl}${encodeURIComponent(name)}`
      );
      return data?.data?.movies?.find((movie: { slug: string; })=>movie.slug===slug);
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
      promises.push(this.getMovie(data.name,data.slug));
    }

    const allMovies = await Promise.all(promises);
    console.info("Parallel API calls: ", allMovies.length);

    // const slugs = list.map((movie) => movie.slug);
    // const flattenedMovies = [].concat(...allMovies);
    // const filterMovies = flattenedMovies.filter((movie) => {
    //   const slugIndex = slugs.indexOf(movie?.slug);
    //   if (slugIndex !== -1) {
    //     slugs.splice(slugIndex, 1);
    //     return true;
    //   }
    //   return false;
    // });

    const filterMovies=allMovies.filter(movie=>movie);

    console.info("Filtered Movies:", filterMovies.length);

    return filterMovies;
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

  private getRedisKey():string{
    return 'movies:trending'
  }
}
