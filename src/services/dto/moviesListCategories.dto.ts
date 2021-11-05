type MoviesListCategories={[key:string]:MovieBodyQuery}

export interface MovieBodyQuery{
    limit?:number;
    page?:number;
    quality?:'720p'|'1080p'|'2160p'|'3D'
    minimum_rating?:number;
    query_term?:string;
    genre?:string;
    sort_by?:"title"| "year"| "rating"| "peers"|"seeds"| "download_count"| "like_count"| "date_added";
    order_by?:"desc"| "asc";
    with_rt_ratings?:boolean
}

export const moviesListCategories:MoviesListCategories={
    mostPopular:{
        limit: 16,
        sort_by: 'like_count',
        minimum_rating: 0,
        genre: '',
    },
    topRated:{
        limit: 20,
        sort_by: 'rating',
        minimum_rating: 0,
        genre: '',
    },
    recentlyAdded:{
        limit: 15,
        sort_by: 'date_added',
        minimum_rating: 0,
        genre:""
    },
    comedy:{
        limit: 15,
        genre: 'Comedy',
        sort_by: "like_count",
        minimum_rating: 0,
    },
    romance:{
        limit: 15,
        genre: 'Romance',
        sort_by: "download_count",
        minimum_rating: 0,
    },
    fantasy:{
        limit: 15,
        genre: 'fantasy',
        sort_by: "year",
        minimum_rating: 7
    },
    drama:{
        limit: 15,
        genre: 'Drama',
        sort_by: "year",
        minimum_rating: 7
    },
    horror:{
        limit: 15,
        genre: 'Horror',
        sort_by: "download_count",
        minimum_rating: 0,
    },
    musical:{
        limit: 15,
        genre: 'Musical',
        sort_by: "download_count",
        minimum_rating: 0,
    }
}