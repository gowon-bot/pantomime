import { testSchemaProperty } from "./validateSchema";

export type PantomimeSchemaProperty =
  | PantomimeType
  | PantomimeSchemaProperty[]
  | PantomimeSchema
  | PantomimeTypes._Union;

export type PantomimeSchema = {
  [key: string]: PantomimeSchemaProperty;
};

export function isSchema(value: any): value is PantomimeSchema {
  if (value instanceof Function && value.name in PantomimeTypes.all) {
    return !PantomimeTypes.getType(value.name as PantomimeTypes.TypeName)
      .isPantomimeType;
  }

  return !(value as any).isPantomimeType;
}

export type PantomimeType = { new (): BasePantomimeType };

export abstract class BasePantomimeType<T = any> {
  isPantomimeType = true;

  abstract validate(value: any): boolean;
  properties: PantomimeSchema = {};

  extract(value: any): T {
    return value as T;
  }

  protected validateProperty(
    property: PantomimeSchemaProperty,
    value: any
  ): boolean {
    return testSchemaProperty(property, value);
  }
}

export namespace PantomimeTypes {
  export class _Union {
    isUnion = true;

    constructor(
      public types: Array<PantomimeType | PantomimeType[] | PantomimeSchema>
    ) {}
  }

  export function union(
    ...types: Array<PantomimeType | PantomimeType[] | PantomimeSchema>
  ) {
    return new _Union(types);
  }

  export function optional(
    ...types: Array<PantomimeType | PantomimeType[] | PantomimeSchema>
  ) {
    return union(Undefined, ...types);
  }

  export function isUnion(
    property: PantomimeSchemaProperty | _Union
  ): property is _Union {
    return property instanceof _Union;
  }

  export class Boolean extends BasePantomimeType<boolean> {
    validate(value: any): boolean {
      return typeof value === "boolean";
    }
  }

  export class Number extends BasePantomimeType<number> {
    validate(value: any): boolean {
      return typeof value === "number";
    }
  }

  export class SizeData extends BasePantomimeType<SizeData> {
    override properties = {
      width: Number,
      height: Number,
    };

    validate(value: any): boolean {
      return (
        this.validateProperty(this.properties, value) &&
        value.height * value.width !== 0
      );
    }
  }

  export class String extends BasePantomimeType<string> {
    validate(value: any): boolean {
      return typeof value === "string";
    }
  }

  export class Undefined extends BasePantomimeType<undefined> {
    validate(value: any): boolean {
      return typeof value === "undefined" || value === null;
    }
  }

  export class ImageInput extends BasePantomimeType<ImageInput> {
    override properties = {
      url: String,
    };

    validate(value: any): boolean {
      return this.validateProperty(this.properties, value);
    }
  }

  export const all = {
    Boolean: new Boolean(),
    ImageInput: new ImageInput(),
    Number: new Number(),
    SizeData: new SizeData(),
    String: new String(),
    Undefined: new Undefined(),
  };

  export type TypeName = keyof typeof all;

  export function getType(
    type: PantomimeTypes.TypeName | PantomimeType
  ): BasePantomimeType {
    if (typeof type === "string") {
      return PantomimeTypes.all[type];
    }

    return PantomimeTypes.all[type.name as PantomimeTypes.TypeName];
  }
}
