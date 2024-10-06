import axios, { AxiosResponse } from "axios";
import { backendURL } from "../../config/backendURLConfig";

// USAGE:
// To use the request interface, call the corresponding function,
// supply your route as  string, and your parameters as a Javascript object
// e.g.:
// request.get(/student/details, { studentId: 5 });

export class sendRequest {
  public static get<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(`${backendURL.HOST}:${backendURL.PORT}${path}?${new URLSearchParams(params)}`, {
      ...headers
    });
    // only reason ... spread is used is incase in the future we want to add some headers that
    // are sent everytime in every request.
  }

  public static post<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>> {
    return axios.post<T>(`${backendURL.HOST}:${backendURL.PORT}${path}`, params, {
      ...headers
    });
  }

  public static put<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>>  {
    return axios.put<T>(`${backendURL.HOST}:${backendURL.PORT}${path}`, params, {
      ...headers
    });
  }

  public static delete<T>(path: string, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<AxiosResponse<T, any>> {
    return axios.delete<T>(`${backendURL.HOST}:${backendURL.PORT}${path}?${new URLSearchParams(params)}`, {
      ...headers
    });
  }

  // handleErrorStatus(error, [400, 401, etc.], () => { do something })
  // give the error object a list of status codes and a callback function for handling those error statuses
  public static handleErrorStatus(error: unknown, statuses: Array<number>, handler: CallableFunction) {
    if (axios.isAxiosError(error)) {
      const potentialErrorStatus = error.response?.status;
      if (potentialErrorStatus) {
        const errorStatus = potentialErrorStatus as number;
        if (statuses.includes(errorStatus)) {
          handler();
          return;
        }
      }
    } else {
      throw error;
    }
  }
}