import axios from "axios";

/**
 * Pre-configured Axios instance for making API requests.
 * Includes a base URL, timeout, and custom headers.
 */
const instance = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  { synchronous: true, runWhen: () => true /* This function returns true */ },
);

/**
 * Axios response interceptor.
 * onFulfilled: Returns the response object for all successful requests.
 * onRejected: Formats the error and rejects the promise with a standardized error object.
 * This ensures consistent error handling for all API calls made with this instance.
 */
instance.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Return response data
    return response;
  },
  function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error:",
        error.response?.status,
        error.response?.data,
      );
      return Promise.reject({
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    console.error("Unexpected error:", error);
    return Promise.reject({
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  },
);
export default instance;

/**
 * Defines the shape of a generic HTTP calling function.
 * @template ReturnedType The expected return type of the API call.
 * @template ArgType The type of the data or parameters being sent.
 */
export type HttpCaller = <ReturnedType, ArgType>(
  url: string,
  reqData: ArgType,
) => Promise<ReturnedType | unknown>;

/**
 * Performs an HTTP GET request.
 * @template T The expected type of the response data.
 * @template ArgType The type of the query parameters.
 * @param {string} url The URL to send the request to.
 * @param {ArgType} [reqData] The query parameters to include in the request.
 * @returns {Promise<T>} A promise that resolves with the response data.
 */
export const httpGet: HttpCaller = async <T, ArgType>(
  url: string,
  reqData?: ArgType,
): Promise<T | unknown> => {
  const queryParams = new URLSearchParams(reqData || {});
  const response = await instance.get<T>(url, { params: queryParams });
  return response.data;
};

/**
 * Performs an HTTP POST request.
 * @template T The expected type of the response data.
 * @template ArgType The type of the request body data.
 * @param {string} url The URL to send the request to.
 * @param {ArgType} [reqData] The data to send in the request body.
 * @returns {Promise<T>} A promise that resolves with the response data.
 */
export const httpPost: HttpCaller = async <T, ArgType>(
  url: string,
  reqData?: ArgType,
): Promise<T | unknown> => {
  const response = await instance.post<T>(url, reqData);
  return response.data;
};

/**
 * Performs an HTTP PUT request.
 * @template T The expected type of the response data.
 * @template ArgType The type of the request body data.
 * @param {string} url The URL to send the request to.
 * @param {ArgType} [reqData] The data to send in the request body.
 * @returns {Promise<T>} A promise that resolves with the response data.
 */
export const httpPut: HttpCaller = async <T, ArgType>(
  url: string,
  reqData?: ArgType,
): Promise<T | unknown> => {
  const response = await instance.put<T>(url, reqData);
  return response.data;
};

/**
 * Performs an HTTP DELETE request.
 * @template T The expected type of the response data.
 * @template ArgType The type of the query parameters.
 * @param {string} url The URL to send the request to.
 * @param {ArgType} [reqData] The query parameters to include in the request.
 * @returns {Promise<T>} A promise that resolves with the response data.
 */
export const httpDelete: HttpCaller = async <T, ArgType>(
  url: string,
  reqData?: ArgType,
): Promise<T | unknown> => {
  const queryParams = new URLSearchParams(reqData || {});
  const response = await instance.delete<T>(url, { params: queryParams });
  return response.data;
};
