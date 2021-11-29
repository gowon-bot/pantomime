type URLInput = {
  url: string;
};

type FilepathInput = {
  path: string;
};

export type ImageInput = URLInput | FilepathInput;

export function imageInputIsURL(input: ImageInput): input is URLInput {
  return !!(input as URLInput).url;
}

export function imageInputIsFilepath(
  input: ImageInput
): input is FilepathInput {
  return !!(input as FilepathInput).path;
}

export type SizeInput = { height: number; width: number };
