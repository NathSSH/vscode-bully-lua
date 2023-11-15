export type TLuaDataTypeWithoutNil =
  | "string"
  | "number"
  | "function"
  | "boolean"
  | "table"
  | "userdata"
  | "thread";

export type TLuaDataType = TLuaDataTypeWithoutNil | "nil";

export type TDataTypeWithoutNil = TLuaDataTypeWithoutNil | "any" | "integer";

export type TDataType = TLuaDataType | "any" | "integer";
