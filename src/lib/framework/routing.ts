import chalk from "chalk";
import { Express, Response, Request } from "express";
import { PantomimeSchema } from "./schema/types";
import { validateSchema } from "./schema/validateSchema";

type HTTPMethod = "GET" | "POST";

type ControllerCallback = (
  params: ControllerCallbackParams
) => void | Promise<void>;

export type ControllerCallbackParams<T = any> = {
  res: Response;
  req: Request;
  params: T;
};

export type Routes = {
  namespace?: string;
  endpoints?: Endpoints;
  subroutes?: Routes[];
};

type Endpoint = `${HTTPMethod} ${string}`;

export type Endpoints = {
  [key in Endpoint]: RouteData;
};

export type RouteData = {
  callback: ControllerCallback;
  schema?: PantomimeSchema;
};

export function createRoutes(
  app: Express,
  routes: Routes,
  parentNamespace?: string
): void {
  const namespace = combineRouteElements(parentNamespace, routes.namespace);

  for (const [endpoint, routeData] of Object.entries(routes.endpoints || {})) {
    const [verb, path] = splitEndpoint(endpoint as Endpoint);

    createRouteForMethod(app, verb, path, namespace, routeData);
  }

  if (routes.subroutes) {
    routes.subroutes.forEach((s) => createRoutes(app, s, namespace));
  }
}

function createRouteForMethod(
  app: Express,
  method: HTTPMethod,
  path: string,
  namespace: string,
  routeData: RouteData
): void {
  console.log(
    chalk`Creating {green ${method}} route {grey ${combineRouteElements(
      namespace,
      path
    )}}`
  );

  const methodFunction = method === "GET" ? app.get : app.post;

  methodFunction.bind(app)(
    combineRouteElements(namespace, path),
    (req: Request, res: Response) => {
      if (routeData.schema) validateSchema(routeData.schema, req.body);

      return routeData.callback({ res, req, params: req.body });
    }
  );
}

export function combineRouteElements(
  ...elements: (string | undefined)[]
): string {
  return elements.reduce((acc: string, element) => {
    if (!element) return acc;

    if (acc.endsWith("/") && element.startsWith("/")) {
      return acc + element.substring(1);
    } else if (!acc.endsWith("/") && !element.startsWith("/")) {
      return acc + "/" + element;
    }

    return acc + element;
  }, "");
}

function splitEndpoint(endpoint: Endpoint): [HTTPMethod, string] {
  const split = endpoint.split(" ");

  return [split[0] as HTTPMethod, split.slice(1).join(" ")];
}
