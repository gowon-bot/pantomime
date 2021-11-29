import express, { json } from "express";
import { createRoutes } from "./lib/framework/routing";
import { globalRoutes } from "./routes";

const port = 3002;
const app = express();

app.use(json());

createRoutes(app, globalRoutes);

app.listen(port, () => {
  console.log(`\n\nServer started at http://localhost:${port}`);
});
