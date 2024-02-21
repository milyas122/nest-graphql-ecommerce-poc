export interface IResponse {
  message?: string | string[];
  error: string;
  statusCode: number;
  data: Record<string, any> | Record<string, any>[];
}

export type SuccessResponse = Omit<IResponse, 'error'>;
export type ErrorResponse = Omit<IResponse, 'data'> &
  Required<Pick<IResponse, 'message'>>;

/**
 * A helper function that sends a success response with the provided status code, message, and data.
 *
 * @param {SuccessResponse} statusCode - The status code of the response
 * @param {SuccessResponse} message - The message to be included in the response
 * @param {SuccessResponse} data - The data to be included in the response
 * @return {Object} An object containing the message, status code, and data
 */
export const sendSuccessResponse = ({
  statusCode,
  message,
  data,
}: SuccessResponse) => {
  return {
    message: message || 'success',
    statusCode,
    data,
  };
};

/**
 * A helper function that sends an error response with the specified statusCode, message, and error details.
 *
 * @param {ErrorResponse} statusCode - The HTTP status code of the error response
 * @param {ErrorResponse} message - The error message to be sent
 * @param {ErrorResponse} error - The error details to be sent
 * @return {object} An object containing the message, error, and statusCode
 */
export const sendErrorResponse = ({
  statusCode,
  message,
  error,
}: ErrorResponse) => {
  return {
    message: message,
    error: error,
    statusCode,
  };
};
