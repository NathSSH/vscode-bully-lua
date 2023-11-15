import { TDataType, TDataTypeWithoutNil } from "./dataType";

export type TReturn = {
  name?: string;
  desc?: string;
  type: TDataType | `${TDataTypeWithoutNil}|${"nil"}`;
};

export type TBullyFunctionParam = {
  name: string;
  desc?: string;
  type: TDataType;
  isRequired: boolean;
};

export type TBullyFunction = {
  name: string;
  desc?: string;
  params: TBullyFunctionParam[] | "nil";
  returnValue: TReturn[] | "nil";
};
