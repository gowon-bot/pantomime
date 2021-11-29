import fetch from "node-fetch";
import sharp, { Color, RGBA } from "sharp";
import { ArrayTiler } from "../helpers/Tiler";
import {
  ImageInput,
  imageInputIsFilepath,
  imageInputIsURL,
  SizeInput,
} from "./inputs";

export abstract class ImageGenerator {
  protected readonly defaultBackground: RGBA = {
    r: 0,
    g: 0,
    b: 0,
    alpha: 0,
  };

  protected imageTiler = new ArrayTiler<ImageInput>();

  protected blankCanvas(size: SizeInput, background: Color): sharp.Sharp {
    return sharp({
      create: {
        ...size,
        channels: isRGBA(background) ? 4 : 3,
        background,
      },
    }).png();
  }

  protected async getImageFromInput(input: ImageInput): Promise<sharp.Sharp> {
    if (imageInputIsFilepath(input)) {
      return sharp(input.path);
    } else if (imageInputIsURL(input)) {
      const image = await fetch(input.url);

      const buffer = Buffer.from(await image.arrayBuffer());

      return sharp(buffer);
    }

    return this.blankCanvas(
      { height: 300, width: 300 },
      this.defaultBackground
    );
  }
}

export function isRGBA(value: Color): value is RGBA {
  return !!(value as RGBA).alpha;
}
