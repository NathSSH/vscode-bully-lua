import { TDataType } from "./dataType";

export type TVariable = {
  name: string;
  desc?: string;
  type: TDataType;
  value: number | string; // Currently just this..
};
