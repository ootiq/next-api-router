import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

// And to throw an error when an error happens in a middleware
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

class Router {
  middlewares: Function[];
  handlers: Record<string, NextApiHandler>;

  constructor() {
    this.middlewares = [];
    this.handlers = {};
  }

  /**
   * Add custom middleware.
   */
  use(fn: Function) {
    this.middlewares.push(fn);
    return this;
  }

  /**
   * Create a route with specified method.
   * Note: method needs to be in uppercase. Example: `GET`, `POST`
   * @param method HTTP Method
   * @param fn Callback function of the route.
   * @returns {Router}
   */
  route<T = any>(method: string, fn: NextApiHandler<T>): Router {
    const _router = new Router();
    _router.middlewares = this.middlewares;
    _router.handlers = this.handlers;
    _router.handlers[method] = fn;

    return _router;
  }

  /**
   * Handle the route request. Should be chained in last.
   */
  handle() {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const handler = this.handlers[req.method ?? ""];
      // no handler defined for method
      if (handler === undefined) {
        const fallback = this.handlers["*"];
        // no handler defined as fallback `.all()`
        if (fallback === undefined) {
          res.status(405).send("Method not allowed");
          return;
        }

        return fallback(req, res);
      }

      for (const i of this.middlewares) {
        await runMiddleware(req, res, i);
      }

      return handler(req, res);
    };
  }

  /**
   * Route HTTP Get request.
   */
  get<T = any>(fn: NextApiHandler<T>) {
    return this.route("GET", fn);
  }

  /**
   * Route HTTP Post request.
   */
  post<T = any>(fn: NextApiHandler<T>) {
    return this.route("POST", fn);
  }

  /**
   * Route HTTP Put request.
   */
  put<T = any>(fn: NextApiHandler<T>) {
    return this.route("PUT", fn);
  }

  /**
   * Route HTTP Patch request.
   */
  patch<T = any>(fn: NextApiHandler<T>) {
    return this.route("PATCH", fn);
  }

  /**
   * Route HTTP Delete request.
   */
  delete<T = any>(fn: NextApiHandler<T>) {
    return this.route("DELETE", fn);
  }

  /**
   * Fallback handler for all other http requests.
   */
  all<T = any>(fn: NextApiHandler<T>) {
    return this.route("*", fn);
  }
}

export default Router;
