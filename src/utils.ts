//eslint-disable-next-line
import GLOBAL_VARIABLES from "./DATA.json";
import { BULLY_SCRIPTING_LANGUAGE } from "./constant";
import { TSnippet } from "./snippets";
import { TBullyFunction, TBullyFunctionParam } from "./types/function";
import { TVariable } from "./types/variable";

//-------------------------------------------------------------------------------------------------

export const createMarkdownCodeBlock = (
  language: string = "",
  code: string = ""
): string => {
  return `\`\`\`${language}
${code}
\`\`\``;
};

//-------------------------------------------------------------------------------------------------

export const BULLY_FUNCTIONS = GLOBAL_VARIABLES.functions as TBullyFunction[];

export const BULLY_VARIABLES = GLOBAL_VARIABLES.variables as TVariable[];

export const isBullyFunction = (query: string): boolean => {
  return BULLY_FUNCTIONS.some(func => func.name === query);
};

const functionLookup: { [key: string]: boolean } = {};
BULLY_FUNCTIONS.forEach(func => {
  functionLookup[func.name] = true;
});

const variableLookup: { [key: string]: boolean } = {};
BULLY_VARIABLES.forEach(variable => {
  variableLookup[variable.name] = true;
});

export const isBullyVariableOrFunction = (
  input: string,
  checkingType: "startsWith" | "exact"
): "function" | "variable" | undefined => {
  if (checkingType === "exact") {
    if (functionLookup[input]) return "function";
    if (variableLookup[input]) return "variable";
    return undefined;
  } else if (checkingType === "startsWith") {
    const isFunction = BULLY_FUNCTIONS.some(func =>
      func.name.startsWith(input)
    );
    if (isFunction) return "function";

    const isVariable = BULLY_VARIABLES.some(variable =>
      variable.name.startsWith(input)
    );
    if (isVariable) return "variable";

    return undefined;
  }
};

export const getBullyFunctionObj = (
  functionName: string
): TBullyFunction | undefined => {
  return BULLY_FUNCTIONS.find(func => func.name === functionName);
};

export const getBullyVariableObj = (
  variableName: string
): TVariable | undefined => {
  return BULLY_VARIABLES.find(variable => variable.name === variableName);
};

//-------------------------------------------------------------------------------------------------

export const getFirstOrLastWord = (input: string): string => {
  const regex = /\b(\w+)\b/g;

  const matches = input.match(regex);

  if (!matches) {
    return "";
  }

  // If there's only 1 word or no space
  if (matches.length === 1 || !/\s/.test(input)) {
    return matches[0];
  }

  return matches[matches.length - 1];
};

//-------------------------------------------------------------------------------------------------

/**
 * Create a heading for variable/function description
 * @param {string} dataType Data type
 * @returns {string} Markdown code block
 */
const createHeader = (dataType: string): string => {
  return `\`\`\`
${dataType}
\`\`\``;
};

type TParamRequired = `${string}: ${string}`;
type TParamOptional = `${string}?: ${string}`;
export type TParam = TParamRequired | TParamOptional;
/**
 * Create formatted function parameters
 * @param params ```TBullyFunctionParam[] || "nil"```. Default is ```"nil"```.
 * @returns ```TParam[] || ''```
 */
export const createFormattedFunctionParams = (
  params: TBullyFunctionParam[] | "nil" = "nil"
): "" | TParam[] => {
  if (params === "nil") {
    return "";
  }

  const formattedParams = params.map((param, index) => {
    return `${param.name}${!param.isRequired ? "?" : ""}: ${param.type}`;
  });

  return formattedParams as TParam[];
};

const createFunctionReturnValue = (
  returnValue: TBullyFunction["returnValue"]
) => {
  // No return value
  if (returnValue === "nil") {
    return "";
  }

  let returnValueName = returnValue.at(0)?.name;
  let isHaveName = Boolean(returnValueName);
  let returnValueNameWithColon = isHaveName ? `${returnValueName}: ` : "";

  // Returns single value
  if (returnValue.length <= 1) {
    return "  -> " + returnValueNameWithColon + returnValue.at(0)?.type;
  }

  // Returns multiple value
  const values = returnValue
    .map((val, index) => {
      isHaveName = Boolean(returnValueName);
      returnValueNameWithColon = isHaveName ? `${returnValueName}: ` : "";

      if (index <= 0) {
        // return `${val.name}: ${val.type}`;
        return "  -> " + returnValueNameWithColon + val.type;
      }

      return `  ${index + 1}. ${val.name}: ${val.type}`;
    })
    .join(",\n");

  return values;
};

export const createFunctionCode = (
  name: TBullyFunction["name"],
  params: TParam[] | "",
  returnValue: TBullyFunction["returnValue"]
): string => {
  const functionLine = `function ${name}(${
    Array.isArray(params) ? params.join(", ") : ""
  })`;

  let returnLine = createFunctionReturnValue(returnValue);
  returnLine = returnLine !== "" ? `\n${returnLine}` : "";

  return createMarkdownCodeBlock(
    BULLY_SCRIPTING_LANGUAGE,
    `${functionLine}${returnLine}`
  );
};

export const createMarkdownString = (
  topSection: string,
  bottomSection: string
): string => {
  return `\n${topSection}\n${bottomSection}`;
};

export const createDescription = (desc: string = ""): string => {
  return `\n---\n\n${desc}`;
};

//-------------------------------------------------------------------------------------------------

export const createVariableCode = (
  name: string,
  value: TVariable["value"]
): string => {
  return createMarkdownCodeBlock(
    BULLY_SCRIPTING_LANGUAGE,
    `_G.${name} = ${value}\n`
  );
};

//-------------------------------------------------------------------------------------------------

/* export const createSnippetMarkdownString = (
  name: TSnippet["name"],
  code: TSnippet["body"]
): string => {
  const codeString = code.join("\n");

  return ``;
}; */

//-------------------------------------------------------------------------------------------------

export const removeDuplicates = (array: string[]): string[] => {
  // Hash map
  const seen: {
    [key: string]: boolean;
  } = {};

  const result = array.filter(str => {
    if (!seen.hasOwnProperty(str)) {
      seen[str] = true;
      return true;
    }

    return false;
  });

  return result;
};

export const isValidWord = (input: string): boolean => {
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(input);
};

//-------------------------------------------------------------------------------------------------

/* export const registerCommand = (
  command: string,
  globalStateKeyName: string,
  value: any
) => {}; */
