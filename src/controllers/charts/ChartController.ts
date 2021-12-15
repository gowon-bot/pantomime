import { ControllerCallbackParams } from "../../lib/framework/routing";
import { ArrayTiler } from "../../lib/helpers/Tiler";
import { CoverTileGenerator } from "../../lib/image/generators/CoverTileGenerator";
import { AlbumInput, ImageInput, SizeInput } from "../../lib/image/inputs";
import { BaseController } from "../BaseController";

type CreateParams = {
  urls: ImageInput[];
  size: SizeInput;
};

type CreateWithTitlesParams = {
  albums: AlbumInput[];
  size: SizeInput;
};

export class ChartController extends BaseController {
  protected imageTiler = new ArrayTiler();

  private readonly coverTileGenerator = new CoverTileGenerator();

  async create({ res, params }: ControllerCallbackParams<CreateParams>) {
    const tiledImages = this.imageTiler.tile(params.urls);

    const tiledCovers = await this.coverTileGenerator.tileCovers(tiledImages, {
      width: params.size?.width || 1000,
      height: params.size?.height || 1000,
    });

    await this.sendImage(res, tiledCovers);
  }

  async createWithTitles({
    res,
    params,
  }: ControllerCallbackParams<CreateWithTitlesParams>) {
    const tiledAlbums = this.imageTiler.tile(params.albums);

    const tiledCovers = await this.coverTileGenerator.tileCoversWithTitles(
      tiledAlbums,
      {
        width: params.size?.width || 1000,
        height: params.size?.height || 1000,
      }
    );

    await this.sendImage(res, tiledCovers);
  }
}
