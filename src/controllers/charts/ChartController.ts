import { ControllerCallbackParams } from "../../lib/framework/routing";
import { CoverTileGenerator } from "../../lib/image/generators/CoverTileGenerator";
import { ImageInput, SizeInput } from "../../lib/image/inputs";
import { BaseController } from "../BaseController";

type CreateParams = {
  urls: ImageInput[];
  size: SizeInput;
};

export class ChartController extends BaseController {
  private readonly coverTileGenerator = new CoverTileGenerator();

  async create({ res, params }: ControllerCallbackParams<CreateParams>) {
    const tiledCovers = await this.coverTileGenerator.tileCovers(params.urls, {
      width: params.size?.width || 1000,
      height: params.size?.height || 1000,
    });

    const buffer = await tiledCovers.png().toBuffer();

    res.writeHead(200, {
      "Content-Type": `image/png`,
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  }
}
