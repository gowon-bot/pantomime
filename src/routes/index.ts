import { TestController } from "../controllers/charts/TestController";
import { Routes } from "../lib/framework/routing";
import { chartRoutes } from "./charts";

const testController = new TestController();

export const globalRoutes: Routes = {
  namespace: "api",

  endpoints: {
    "GET ping": {
      callback: testController.ping,
    },
  },

  subroutes: [chartRoutes],
};
