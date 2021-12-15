import sharp, { Channels } from "sharp";
import { ImageOperator } from "../ImageOperator";
import { Anchor } from "text-to-svg";
import {
  LocationOptions,
  TextOptions,
  TextOptionsWithLocation,
} from "../inputs";
import { locationAdd, locationSubtract } from "../../helpers/location";
import { DefaultFont } from "../../helpers/fonts/Font";

export class AddTextOperator extends ImageOperator {
  public readonly font = new DefaultFont();
  private readonly defaultColour = "black";

  public async to(
    image: sharp.Sharp,
    textOptions: TextOptionsWithLocation
  ): Promise<sharp.Sharp> {
    const svgOptions = this.getTextToSVGOptions(textOptions);

    const svg = sharp(this.font.toSVG(textOptions.text, svgOptions));

    return image.composite([
      this.getTextBackgroundComposite(textOptions),
      {
        ...this.getTextLocation(textOptions),
        input: await svg.toBuffer(),
      },
    ]);
  }

  private getTextLocation(
    textOptions: TextOptionsWithLocation
  ): LocationOptions {
    return locationSubtract(
      locationAdd(textOptions.location, (textOptions.padding || 0) / 2),
      { top: textOptions.location.bottom }
    );
  }

  private getTextBackgroundComposite(textOptions: TextOptionsWithLocation) {
    return {
      ...locationSubtract(textOptions.location, {
        top: textOptions.location.bottom,
      }),
      input: this.createTextBackground(textOptions, textOptions.padding),
    };
  }

  private createTextBackground(
    textOptions: TextOptions,
    textPadding: number = 0
  ) {
    const metrics = this.font.textToSVG.getMetrics(
      textOptions.text,
      textOptions
    );

    return {
      create: {
        channels: 4 as Channels,
        height: Math.floor(metrics.height + textPadding),
        width: Math.floor(metrics.width + textPadding),
        background: { r: 0, g: 0, b: 0, alpha: 0.8 },
      },
    };
  }

  private getTextToSVGOptions(textOptions: TextOptions) {
    return {
      x: 0,
      y: 0,
      fontSize: textOptions.fontSize,
      anchor: "top" as Anchor,
      attributes: {
        stroke: textOptions.color || this.defaultColour,
        fill: textOptions.color || this.defaultColour,
      },
    };
  }
}
