import { Request, Response, NextFunction } from "express";

export class PantomimeHTTPError extends Error {
  override name = "PantomimeHTTPError";

  constructor(message: string, public status = 500) {
    super(message);
  }

  public asJSObject() {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
    };
  }
}

export function expressErrorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) return next(err);

  if (err instanceof PantomimeHTTPError) {
    res.status(err.status).send(err.asJSObject());
  } else {
    res
      .status(500)
      .send({ status: 500, message: "Something unexpected went wrong" });
  }
}
