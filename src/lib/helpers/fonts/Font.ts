import TextToSVG from "text-to-svg";

export abstract class Font {
  public abstract textToSVG: TextToSVG;
  public abstract fontTiers: number[];

  public fontSizeThatFits(width: number, text: string): number {
    return (
      this.fontTiers.find((size) => {
        const metrics = this.textToSVG.getMetrics(text, { fontSize: size });

        if (metrics.width < width) return true;
      }) || this.getSmallestFont()
    );
  }

  public toSVG(text: string, options?: TextToSVG.GenerationOptions) {
    return this.textToSVG.getSVG(text, options);
  }

  private getSmallestFont() {
    return this.fontTiers[this.fontTiers.length - 1];
  }
}

export class DefaultFont extends Font {
  public textToSVG: TextToSVG = TextToSVG.loadSync();
  // To be replaced with auto-scaling
  fontTiers: number[] = [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 1];
}
