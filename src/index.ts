import { NextApiRequest, NextApiResponse } from "next";

type APIFunction = (req: NextApiRequest, res: NextApiResponse) => any;

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
  handlers: Record<string, APIFunction>;

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
  route(method: string, fn: APIFunction): Router {
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
      if (handler == undefined) {
        res.status(405).send("405 Method Not Allowed");
        return;
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
  get(fn: APIFunction) {
    return this.route("GET", fn);
  }

  /**
   * Route HTTP Post request.
   */
  post(fn: APIFunction) {
    return this.route("POST", fn);
  }

  /**
   * Route HTTP Put request.
   */
  put(fn: APIFunction) {
    return this.route("PUT", fn);
  }

  /**
   * Route HTTP Patch request.
   */
  patch(fn: APIFunction) {
    return this.route("PATCH", fn);
  }

  /**
   * Route HTTP Delete request.
   */
  delete(fn: APIFunction) {
    return this.route("DELETE", fn);
  }
}

export default Router;
