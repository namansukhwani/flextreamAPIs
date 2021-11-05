export default interface ResponseError extends Error {
  status?: number;
  statusCode?: string | number;
  description?: string;
}
