import { Routes } from "../lib/framework/routing";
import { ChartController } from "../controllers/charts/ChartController";
import { PantomimeTypes } from "../lib/framework/schema/types";

const chartController = new ChartController();

export const chartRoutes: Routes = {
  namespace: "chart",

  endpoints: {
    "POST create": {
      callback: chartController.create.bind(chartController),
      schema: {
        urls: [PantomimeTypes.ImageInput],
        size: PantomimeTypes.optional(PantomimeTypes.SizeData),
      },
    },
  },
};
