import e, { NextFunction, Response } from "express";
import axios from 'axios';
import ResponseBody, { ErrorCodes } from "../util/dto/responseBody.dto";
import { MovieBodyQuery, moviesListCategories } from "./dto/moviesListCategories.dto";
import redisService from './redisService';
import { getMovieWithDetails } from './../util/commonFunctions';

export default class MovieService {
    private readonly apiSearchUrl = `https://yts.mx/api/v2/list_movies.json?limit=10&${encodeURIComponent(
        "query_term"
    )}=`;
    private readonly apiListUrl = 'https://yts.mx/api/v2/list_movies.json'

    async getMovie(res: Response, next: NextFunction, name: string, slug: string): Promise<void> {
        try {
            const { data }: { data: any } = await axios.get(`${this.apiSearchUrl}${encodeURIComponent(name)}`);
            const result = data?.data?.movies?.find((movie: { slug: string; }) => movie.slug.trim() == slug.trim());
            let response: ResponseBody;
            if (result) {
                const movie=await getMovieWithDetails(result.id)
                response = {
                    status: true,
                    data: movie,
                }
                res.statusCode = 200;
                res.send(response);
            }
            else {
                response = {
                    status: false,
                    message: "Not able to fetch movie details currently. Please try again later.",
                    errorCode: ErrorCodes.MOVIE_NOT_FOUND
                }
                res.statusCode = 204;
                res.send(response);
            }
        }
        catch (e) {
            console.error('Error from movie service: ', e.message);
            next(e);
        }
    }

    async getMoviesList(res: Response, next: NextFunction, type: string): Promise<void> {
        try {
            if (type in moviesListCategories) {
                const redisKey = this.getRedisKeyForMoviesList(type);
                let movies = await redisService.getValue(redisKey);
                if (!movies) {
                    const { data }: { data: any } = await axios.get(this.getListUrl(type));
                    movies=data?.data?.movies;
                    if(!movies) throw new Error(`Unable to get the movies list for the type: ${type}`);
                    redisService.setValue(redisKey,movies);
                }
                res.statusCode = 200;
                res.send(movies)
            }
            else {
                res.statusCode = 400;
                res.send({ stausCode: 400, message: "Worng movie type" })
            }
        }
        catch (e) {
            console.error("Error from movie list : ", e.message);
            next(e);
        }
    }

    private getListUrl(type: string): string {
        const url = new URL(this.apiListUrl);
        const params: MovieBodyQuery = moviesListCategories[type];
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        return url.toString();
    }

    private getRedisKeyForMoviesList(type: string) {
        return `HomePage:moviesList:${type}`
    }
}
