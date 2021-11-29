import { mkdir, access, writeFile } from "fs/promises";
import { constants, existsSync } from "fs";
import chalk from "chalk";
import sharp, { Sharp } from "sharp";
import fetch from "node-fetch";
import path from "path/posix";

export class ImageCache {
  private readonly lastfmRegex =
    /https:\/\/lastfm\.freetls\.fastly\.net\/i\/.*\/(\w+\.(jpg|png)).*/;

  async getImageFromURL(url: string): Promise<Sharp> {
    const id = this.getIDFromLastfmURL(url);

    if (!id || !(await this.isImageCached(id))) {
      const image = await fetch(url);

      const buffer = Buffer.from(await image.arrayBuffer());

      this.cacheImage(buffer, id);

      return sharp(buffer);
    } else {
      return sharp(this.getFilepath(id));
    }
  }

  // https://lastfm.freetls.fastly.net/i/u/174s/be55f190b862b7fc1a7b518a294daafe.jpg
  private getIDFromLastfmURL(url: string): string | undefined {
    return (url.match(this.lastfmRegex) || [])[1];
  }

  private getFilepath(filename: string): string {
    return path.join(process.env.IMAGE_CACHE_DIR!, filename);
  }

  private async isImageCached(id: string) {
    try {
      await access(this.getFilepath(id), constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async cacheImage(buffer: Buffer, id?: string) {
    if (id) {
      console.log(chalk.grey`Caching image '${id}'`);

      await writeFile(this.getFilepath(id), buffer);
    }
  }
}

export async function ensureCacheDirectoryExists(path: string) {
  if (!existsSync(path)) {
    console.log(chalk.yellow`Creating cache directory '${path}'\n`);

    await mkdir(path, { recursive: true });
  }
}
