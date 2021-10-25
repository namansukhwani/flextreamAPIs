import { NextFunction, Response } from "express";
export default class TrendingService {
    private url;
    private apiUrl;
    getTreanding(res: Response, next: NextFunction, limit?: number): Promise<void>;
    private getMovie;
    private scrapMovies;
    private getMovies;
    private getLimitedList;
}
