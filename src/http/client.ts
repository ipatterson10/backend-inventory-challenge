type RequestOptions = Omit<RequestInit, "method">;

// Generic http interface to make testing the service easier. Can mock/spy on
// http calls
export abstract class HttpClient {
  readonly baseUrl: string;

  abstract post(path: string, options: RequestOptions): Promise<Response>;
  abstract put(path: string, options: RequestOptions): Promise<Response>;
}

// basic fetch implementation, to demonstrate an http call. Not currently
// using this in sync so we can run the code without a live server to hit
export class FetchHttpClient extends HttpClient {
  constructor(readonly baseUrl: string) {
    super();
  }

  post(path: string, options: RequestOptions): Promise<Response> {
    return fetch(`${this.baseUrl}/${path}`, { ...options, method: "POST" });
  }

  put(path: string, options: RequestOptions): Promise<Response> {
    return fetch(`${this.baseUrl}/${path}`, { ...options, method: "PUT" });
  }
}

// No op client to simulate http request
export class NoOpHttpClient extends HttpClient {
  constructor(readonly baseUrl: string) {
    super();
  }

  post(_path: string, _options: RequestOptions): Promise<Response> {
    return Promise.resolve({ status: 201, statusText: "Created" } as Response);
  }

  put(_path: string, _options: RequestOptions): Promise<Response> {
    return Promise.resolve({ status: 200, statusText: "Success" } as Response);
  }
}
