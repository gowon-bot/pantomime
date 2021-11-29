import sharp, { OverlayOptions } from "sharp";
import { ImageGenerator } from "../ImageGenerator";
import { ImageInput, SizeInput } from "../inputs";

export class CoverTileGenerator extends ImageGenerator {
  async tileCovers(
    images: ImageInput[],
    size: SizeInput
  ): Promise<sharp.Sharp> {
    const tiledImages = this.imageTiler.tile(images);

    const blank = this.blankCanvas(size, this.defaultBackground);

    const imageSize = Math.floor(size.width / tiledImages.length);

    const composites: OverlayOptions[] = [];

    for (let rowIndex = 0; rowIndex < tiledImages.length; rowIndex++) {
      const columns = tiledImages[rowIndex];

      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];

        const image = await this.getImageFromInput(column);

        composites.push({
          top: rowIndex * imageSize,
          left: columnIndex * imageSize,
          input: await image.resize(imageSize).toBuffer(),
        });
      }
    }

    return blank.composite(composites);
  }
}
