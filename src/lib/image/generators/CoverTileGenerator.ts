import sharp, { OverlayOptions } from "sharp";
import { floorLocation } from "../../helpers/location";
import { TiledArray } from "../../helpers/Tiler";
import { ImageGenerator } from "../ImageGenerator";
import { AlbumInput, ImageInput, SizeInput } from "../inputs";

export class CoverTileGenerator extends ImageGenerator {
  async tileCovers(
    images: TiledArray<ImageInput>,
    size: SizeInput
  ): Promise<sharp.Sharp> {
    const blank = this.blankCanvas(size, this.defaultBackground);

    const imageSize = Math.floor(size.width / images.length);

    const composites: OverlayOptions[] = [];

    for (let rowIndex = 0; rowIndex < images.length; rowIndex++) {
      const columns = images[rowIndex];

      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];

        const image = await this.getImageFromInput(column);

        composites.push({
          top: rowIndex * imageSize,
          left: columnIndex * imageSize,
          input: await image
            .resize({ height: imageSize, width: imageSize })
            .toBuffer(),
        });
      }
    }

    return blank.composite(composites);
  }

  async tileCoversWithTitles(
    images: TiledArray<AlbumInput>,
    size: SizeInput
  ): Promise<sharp.Sharp> {
    const imageSize = size.width / images.length;

    const padding = 6;
    const color = "white";

    const imagesWithTitles: TiledArray<ImageInput> = await Promise.all(
      images.map(async (row) => {
        return await Promise.all(
          row.map(async (i) => {
            const image = await this.getImageFromInput(i.image);

            if (!i.metadata) return { image };

            const text = `${i.metadata.artist} - ${i.metadata.album}`;

            const fontSize = this.addText.font.fontSizeThatFits(
              imageSize * 0.8,
              text
            );

            const metrics = this.addText.font.textToSVG.getMetrics(text, {
              fontSize,
            });

            const withText = await this.addText.to(image, {
              text,
              fontSize,
              padding,
              color,
              location: floorLocation({
                ...this.getBottomOfImage(imageSize, metrics.height + padding),
                ...this.centerTextHorizontally(imageSize, metrics),
              }),
            });

            return { image: withText };
          })
        );
      })
    );

    return await this.tileCovers(imagesWithTitles, size);
  }
}
