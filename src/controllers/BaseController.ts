import sharp from "sharp";
import { Response } from "express";

export abstract class BaseController {
  protected async sendImage(res: Response, image: sharp.Sharp) {
    const buffer = await image.png().toBuffer();

    res.writeHead(200, {
      "Content-Type": `image/png`,
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  }
}
