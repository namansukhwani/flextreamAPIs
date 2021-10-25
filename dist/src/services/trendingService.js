"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
class TrendingService {
    constructor() {
        this.url = "https://yts.mx/trending-movies";
        this.apiUrl = `https://yts.mx/api/v2/list_movies.json?limit=6&${encodeURIComponent("query_term")}=`;
    }
    async getTreanding(res, next, limit) {
        try {
            const scrappedMovies = await this.scrapMovies();
            const movies = await this.getMovies(scrappedMovies, limit);
            res.statusCode = 200;
            res.send(movies);
        }
        catch (e) {
            console.error(`Error:`, e);
            next(e);
        }
    }
    async getMovie(name) {
        var _a;
        try {
            const { data } = await axios_1.default.get(`${this.apiUrl}${encodeURIComponent(name)}`);
            return (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.movies;
        }
        catch (e) {
            throw new Error(`Error from API call: ${e.message}`);
        }
    }
    async scrapMovies() {
        try {
            const { data } = await axios_1.default.get(this.url);
            const $ = cheerio_1.default.load(data);
            const allMovieDivs = $(".browse-movie-title");
            console.info("No of movies scraped:", allMovieDivs.length);
            let searchList = [];
            allMovieDivs.each((i, el) => {
                if ($(el).is("a")) {
                    const name = $(el).text();
                    const slug = $(el).attr("href");
                    searchList.push({
                        id: i + 1,
                        name: name.trim(),
                        slug: slug.substring(slug.lastIndexOf("/") + 1),
                    });
                }
            });
            return searchList;
        }
        catch (e) {
            throw new Error(`Error from data scraping: ${e.message}`);
        }
    }
    async getMovies(moviesList, limit) {
        const list = this.getLimitedList(moviesList, limit);
        const promises = [];
        for (const data of list) {
            promises.push(this.getMovie(data.name));
        }
        const allMovies = await Promise.all(promises);
        console.info("Parallel API calls: ", allMovies.length);
        const slugs = list.map((movie) => movie.slug);
        const flattenedMovies = [].concat(...allMovies);
        const filterMovies = flattenedMovies.filter((movie) => {
            const slugIndex = slugs.indexOf(movie === null || movie === void 0 ? void 0 : movie.slug);
            if (slugIndex !== -1) {
                slugs.splice(slugIndex, 1);
                return true;
            }
            return false;
        });
        console.info("Filtered Movies:", filterMovies.length);
        return filterMovies;
    }
    getLimitedList(moviesList, limit) {
        if (limit)
            return moviesList.length > limit
                ? moviesList.slice(0, limit)
                : moviesList;
        return moviesList;
    }
}
exports.default = TrendingService;
//# sourceMappingURL=trendingService.js.map