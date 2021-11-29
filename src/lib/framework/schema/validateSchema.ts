import {
  isSchema,
  PantomimeSchema,
  PantomimeSchemaProperty,
  PantomimeTypes,
} from "./types";

class InvalidParamsError extends Error {
  name = "InvalidParamsError";

  constructor() {
    super("The parameters you have provided are invalid!");
  }
}

export function validateSchema(schema: PantomimeSchema, params: any): void {
  if (!testSchema(schema, params)) throw new InvalidParamsError();
}

export function testSchema(schema: PantomimeSchema, params: any): boolean {
  console.log("Matching ", schema, " against ", params);

  if (typeof params === "object") {
    for (const [name, property] of Object.entries(schema)) {
      if (!testSchemaProperty(property, params[name])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export function testSchemaProperty(
  property: PantomimeSchemaProperty,
  param: any
): boolean {
  if (PantomimeTypes.isUnion(property)) {
    return property.types.some((t) => testSchemaProperty(t, param));
  } else if (property instanceof Array) {
    return (
      param instanceof Array &&
      param.every((p) => testSchemaProperty(property[0], p))
    );
  } else if (isSchema(property)) {
    return testSchema(property, param);
  } else {
    return PantomimeTypes.getType(property).validate(param);
  }
}
