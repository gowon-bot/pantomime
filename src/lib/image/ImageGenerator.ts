import sharp, { Color, RGBA } from "sharp";
import TextToSVG from "text-to-svg";
import { ImageCache } from "../framework/cache/ImageCache";
import {
  ImageInput,
  imageInputIsFilepath,
  imageInputIsSharp,
  imageInputIsURL,
  SizeInput,
} from "./inputs";
import { AddTextOperator } from "./operators/AddTextOperator";

export abstract class ImageGenerator {
  protected cache = new ImageCache();

  // operators
  protected readonly addText = new AddTextOperator();

  protected readonly defaultBackground: RGBA = {
    r: 0,
    g: 0,
    b: 0,
    alpha: 0,
  };

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
      return await this.cache.getImageFromURL(input.url);
    } else if (imageInputIsSharp(input)) {
      return input.image;
    }

    return this.blankCanvas(
      { height: 300, width: 300 },
      this.defaultBackground
    );
  }

  protected getBottomOfImage(height: number, threshold = 50): { top: number } {
    return { top: height - threshold };
  }

  protected centerTextHorizontally(
    width: number,
    textMetrics: TextToSVG.Metrics
  ): { left: number } {
    return { left: Math.ceil((width - textMetrics.width) / 2) };
  }
}

export function isRGBA(value: Color): value is RGBA {
  return !!(value as RGBA).alpha;
}
