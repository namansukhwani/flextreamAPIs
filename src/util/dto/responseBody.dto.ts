export default interface ResponseBody{
    status:boolean;
    message?:string;
    data?:unknown;
    errorCode?:ErrorCodes
}

export enum ErrorCodes{
    MOVIE_NOT_FOUND="4005",
    BAD_REQUEST="400"
}