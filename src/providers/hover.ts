import * as vscode from "vscode";
import { BULLY_SCRIPTING_LANGUAGE } from "../constant";
import {
  createDescription,
  createFormattedFunctionParams,
  createFunctionCode,
  createVariableCode,
  getBullyFunctionObj,
  getBullyVariableObj,
  isBullyFunction,
  isBullyVariableOrFunction,
} from "../utils";
import { TBullyFunction } from "../types/function";
import { TVariable } from "../types/variable";

const hoverProvider = vscode.languages.registerHoverProvider(
  BULLY_SCRIPTING_LANGUAGE,
  {
    provideHover: (document, position, token): vscode.Hover | undefined => {
      const wordRange = document.getWordRangeAtPosition(position);
      // Ngecek apakah sedang nge-hover kata atau ngga
      if (!wordRange) {
        // console.log("Anda sedang tidak meng-hover kata.");
        return;
      }

      const writtenText = document.getText(wordRange);

      // New
      const textContent = new vscode.MarkdownString();

      switch (isBullyVariableOrFunction(writtenText, "exact")) {
        case "variable": {
          const varObj = getBullyVariableObj(writtenText) as TVariable;

          const varCode = createVariableCode(varObj.name, varObj.value);
          const varDesc = createDescription(varObj.desc);

          textContent.appendMarkdown(varCode + varDesc);

          return new vscode.Hover(textContent, wordRange);
        }

        case "function": {
          const funcObj = getBullyFunctionObj(writtenText) as TBullyFunction;

          const funcCode = createFunctionCode(
            funcObj.name,
            createFormattedFunctionParams(funcObj.params),
            funcObj.returnValue
          );

          const funcDesc =
            funcObj.desc !== "" ? createDescription(funcObj.desc) : "";

          textContent.appendMarkdown(funcCode + funcDesc);

          return new vscode.Hover(textContent, wordRange);
        }
      }

      return;

      // Old
      /* if (!isBullyFunction(writtenText)) {
        return;
      }
      const functionInfo = getBullyFunctionObj(writtenText) as TBullyFunction;

      const hoverText = new vscode.MarkdownString();

      const formattedFunctionParams = createFormattedFunctionParams(
        functionInfo.params
      );
      const functionCode = createFunctionCode(
        functionInfo.name,
        formattedFunctionParams,
        functionInfo.returnValue
      );

      hoverText.appendMarkdown(
        functionCode + createDescription(functionInfo.desc)
      );

      return new vscode.Hover(hoverText, wordRange); */
    },
  }
);

export default hoverProvider;