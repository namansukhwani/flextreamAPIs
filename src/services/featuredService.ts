import axios from 'axios';
import cheerio from 'cheerio';
import { NextFunction, Response } from 'express';
import Genre from './dto/genre.dto';
import FeaturedMovieResponse from './dto/featuredMovieResponse.dto';

class FeaturedService {
    async getFeaturedMovies(
        res: Response,
        next: NextFunction,
        genre: Genre,
        page = 1
    ): Promise<void> {
        try {
            const result = await this.getMovies(genre, page);
            res.statusCode = 200;
            res.send(result)
        }
        catch (e) {
            console.error("Error while featured: ", e);
            next(e);
        }
    }

    private async getMovies(genre: Genre, page: number): Promise<FeaturedMovieResponse[]> {
        try {
            const { data } = await axios.get(this.getUrl(genre, page));

            const $ = cheerio.load(data as string);

            const allMovieDivs = $('.browse-movie-wrap');
            console.info('No of movies scraped:', allMovieDivs.length);

            let searchList: FeaturedMovieResponse[] = [];
            allMovieDivs.each((i, el) => {
                const movieBottomDiv = $(el).find('div[class="browse-movie-bottom"]');
                const aTag = movieBottomDiv.find('a[class="browse-movie-title"]');
                aTag.find('span').remove();

                const name = aTag.text().trim();
                const slug = aTag.attr('href');
                const medium_cover = $(el)
                    .find(
                        'a[class="browse-movie-link"] > figure > img[class="img-responsive"]'
                    )
                    .attr('src');
                const small_cover =
                    medium_cover.substring(0, medium_cover.lastIndexOf('/') + 1) +
                    'small-cover.jpg';
                const year = movieBottomDiv.find('div[class="browse-movie-year"]').text();

                searchList.push({
                    id: page === 1 ? i + 1 : (page - 1) * 20 + i + 1,
                    name: name.trim(),
                    slug: slug.substring(slug.lastIndexOf('/') + 1),
                    medium_cover: medium_cover,
                    small_cover: small_cover,
                    year: year,
                    useNewMethod: true,
                });
            });
            return searchList;
        }
        catch (e) {
            throw new Error(`Error from Get Featured movies: ${e.message}`);
        }


    }

    private getUrl(genre: Genre, page: number) {
        return page === 1
            ? `https://yts.mx/browse-movies/0/all/${encodeURIComponent(
                genre
            )}/0/featured/0/all`
            : `https://yts.mx/browse-movies/0/all/${encodeURIComponent(
                genre
            )}/0/featured/0/all?page=${encodeURIComponent(page)}`;
    }
}

export default FeaturedService;