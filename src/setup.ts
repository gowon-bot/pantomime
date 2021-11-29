import chalk from "chalk";
import express, { json } from "express";
import { ensureCacheDirectoryExists } from "./lib/framework/cache/ImageCache";
import { createRoutes } from "./lib/framework/routing";
import { globalRoutes } from "./routes";

const titleScreen = chalk.blue`
8888888b.                   888                          d8b                        
888   Y88b                  888                          Y8P                        
888    888                  888                                                     
888   d88P 8888b.  88888b.  888888 .d88b.  88888b.d88b.  888 88888b.d88b.   .d88b.  
8888888P"     "88b 888 "88b 888   d88""88b 888 "888 "88b 888 888 "888 "88b d8P  Y8b 
888       .d888888 888  888 888   888  888 888  888  888 888 888  888  888 88888888 
888       888  888 888  888 Y88b. Y88..88P 888  888  888 888 888  888  888 Y8b.     
888       "Y888888 888  888  "Y888 "Y88P"  888  888  888 888 888  888  888  "Y8888    판토마임
==============================================================================================
`;

export async function setup() {
  require("dotenv").config();

  const port = process.env.PORT || 3000;
  const app = express();

  app.use(json());

  console.log(titleScreen);

  await ensureCacheDirectoryExists(process.env.IMAGE_CACHE_DIR!);

  createRoutes(app, globalRoutes);

  app.listen(port, () => {
    console.log(chalk`\nServer started at {magenta http://localhost:${port}}`);
  });
}
