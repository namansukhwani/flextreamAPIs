export default interface FeaturedMovieResponse {
    id: number;
    name: string;
    slug: string;
    medium_cover:string;
    small_cover: string;
    year: string;
    useNewMethod: boolean;
    rating?:string;
    genres?:string[];
}