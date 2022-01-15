import axios from "axios";

const getMovieDetailsUrl = (movieId: string): string => {
    return `https://yts.mx/api/v2//movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`;
}

export const getMovieWithDetails = async (movieId: string): Promise<unknown> => {
    try {
        const { data }: { data: any } = await axios.get(getMovieDetailsUrl(movieId));
        return data.data.movie;
    } catch (e) {
        throw new Error(`Error from API call: ${e.message}`);
    }
}