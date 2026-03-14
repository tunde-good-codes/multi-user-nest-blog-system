import { fileTypes } from "../enums/file.type.enum";

export interface UploadFile {
  name: string;
  path: string;
  type: fileTypes;
  mime: string;
  size: number;
}
