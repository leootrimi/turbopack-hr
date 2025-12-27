import axios, { AxiosRequestConfig, Method } from 'axios';

interface RequestOptions<T = any> {
  url: string;
  method?: Method; // GET, POST, PUT, DELETE, etc.
  body?: any; // request payload
  params?: Record<string, any>; // query parameters
  headers?: Record<string, string>;
  responseType?: 'json' | 'text' | 'blob'; // optional, default json
}

// Generic function to type the response
export async function request<T = any>(options: RequestOptions<T>): Promise<T> {
  const { url, method = 'GET', body, params, headers, responseType = 'json' } = options;

  const config: AxiosRequestConfig = {
    url,
    method,
    data: body,
    params,
    headers,
    responseType,
  };

  try {
    const response = await axios(config);
    return response.data as T;
  } catch (err: any) {
    // Optional: handle axios errors more gracefully
    if (err.response) {
      throw new Error(`Request failed: ${err.response.status} ${err.response.statusText}`);
    }
    throw err;
  }
}
