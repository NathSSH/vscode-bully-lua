import * as vscode from "vscode";
import { BULLY_SCRIPTING_LANGUAGE } from "../constant";
import {
  BULLY_FUNCTIONS,
  TParam,
  createFormattedFunctionParams,
} from "../utils";

const signatureHelp = vscode.languages.registerSignatureHelpProvider(
  BULLY_SCRIPTING_LANGUAGE,
  {
    // Works, but only when there's no text before the current written text
    provideSignatureHelp: (
      document,
      position,
      token,
      context
    ): vscode.ProviderResult<vscode.SignatureHelp> => {
      const line = document.lineAt(position.line).text;
      const currentCharacter = position.character;

      // Menemukan posisi tanda kurung buka terdekat sebelum karakter saat ini
      const openParenthesisIndex = line.lastIndexOf("(", currentCharacter);

      if (
        openParenthesisIndex !== -1 &&
        openParenthesisIndex < currentCharacter
      ) {
        const closeParenthesisIndex = line.indexOf(")", openParenthesisIndex);

        // Close the hint when the cursor position is after the closing parenthesis ")"
        if (
          closeParenthesisIndex !== -1 &&
          currentCharacter > closeParenthesisIndex
        ) {
          return undefined;
        }

        const writtenFunction = line
          .substring(0, openParenthesisIndex)
          .match(/(\w+)$/);

        if (writtenFunction && writtenFunction[0]) {
          const functionObj = BULLY_FUNCTIONS.find(
            (func) => func.name === writtenFunction[0]
          );

          if (functionObj) {
            let params: TParam[] | string = Array.isArray(functionObj.params)
              ? createFormattedFunctionParams(functionObj.params)
              : "";
            params = Array.isArray(params) ? params.join(", ") : params;

            const signature = new vscode.SignatureInformation(
              `function ${functionObj.name}(${params})`,
              functionObj.desc
            );

            if (Array.isArray(functionObj.params)) {
              signature.parameters = functionObj.params.map(
                (param, index): vscode.ParameterInformation =>
                  new vscode.ParameterInformation(
                    param.name + ": " + param.type
                    // `param ke-${index + 1}`
                  )
              );
            }

            const signatures: vscode.SignatureInformation[] = [signature];

            return {
              activeSignature: 0,
              activeParameter:
                line.substring(openParenthesisIndex).split(",").length - 1,
              signatures: signatures,
            };
          }
        }
      }
    },
  },
  "(",
  ","
);

export default signatureHelp;
