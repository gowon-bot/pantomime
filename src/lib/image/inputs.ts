import sharp from "sharp";

type URLInput = {
  url: string;
};

type FilepathInput = {
  path: string;
};

type SharpInput = {
  image: sharp.Sharp;
};

export type ImageInput = URLInput | FilepathInput | SharpInput;

export type AlbumMetadata = {
  artist?: string;
  album?: string;
};

export type AlbumInput = {
  image: ImageInput;
  metadata?: AlbumMetadata;
};

export function imageInputIsSharp(input: ImageInput): input is SharpInput {
  return !!(input as SharpInput).image;
}

export function imageInputIsURL(input: ImageInput): input is URLInput {
  return !!(input as URLInput).url;
}

export function imageInputIsFilepath(
  input: ImageInput
): input is FilepathInput {
  return !!(input as FilepathInput).path;
}

export type SizeInput = { height: number; width: number };

export interface TextOptions {
  text: string;
  fontSize: number;
  color?: string;
  padding?: number;
}

export interface LocationOptions {
  top: number;
  left: number;
  bottom?: number;
}

export type TextOptionsWithLocation = TextOptions & {
  location: LocationOptions;
};
