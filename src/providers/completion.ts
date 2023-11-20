import * as vscode from "vscode";
import { BULLY_SCRIPTING_LANGUAGE } from "../constant";
import {
  BULLY_FUNCTIONS,
  BULLY_VARIABLES,
  createDescription,
  createFormattedFunctionParams,
  createFunctionCode,
  createVariableCode,
  getBullyFunctionObj,
  getBullyVariableObj,
  removeDuplicates,
} from "../utils";
import { TBullyFunction } from "../types/function";
import { TVariable } from "../types/variable";
import SNIPPETS, { TSnippet } from "../snippets";
import { STATES } from "../states";

const createVariableCompletionItem = (name: string): vscode.CompletionItem => {
  const variableObj = getBullyVariableObj(name) as TVariable;

  const item = new vscode.CompletionItem(
    variableObj.name,
    vscode.CompletionItemKind.Value
  );

  // Force on top
  item.sortText = "_";

  item.detail = "variable";

  const varCode = createVariableCode(variableObj.name, variableObj.value);
  const varDesc = createDescription(variableObj.desc);

  item.documentation = new vscode.MarkdownString(varCode + varDesc);

  return item;
};

const createFunctionCompletionItem = (name: string): vscode.CompletionItem => {
  const functionObj = getBullyFunctionObj(name) as TBullyFunction;

  const item = new vscode.CompletionItem(
    functionObj.name,
    vscode.CompletionItemKind.Function
  );

  item.sortText = "b";

  item.detail = "function";

  const functionCode = createFunctionCode(
    functionObj.name,
    createFormattedFunctionParams(functionObj.params),
    functionObj.returnValue
  );

  const functionDescription =
    functionObj.desc !== "" ? createDescription(functionObj.desc) : "";

  item.documentation = new vscode.MarkdownString(
    functionCode + functionDescription
  );

  return item;
};

const createSnippetCompletionItem = ({
  name,
  prefix,
  desc,
  body,
}: TSnippet): vscode.CompletionItem => {
  const item = new vscode.CompletionItem(
    prefix,
    vscode.CompletionItemKind.Snippet
  );

  item.sortText = "c";

  item.detail = name;

  item.insertText = new vscode.SnippetString(
    body.join("\n").replaceAll("  ", "\t")
  );

  const description = Array.isArray(desc) ? desc.join("\n") : desc;

  item.documentation = new vscode.MarkdownString(description);

  return item;
};

const getAllVariableCompletion = (): vscode.CompletionItem[] => {
  const suggestions: vscode.CompletionItem[] = [];

  BULLY_VARIABLES.forEach(variable => {
    suggestions.push(createVariableCompletionItem(variable.name));
  });

  return suggestions;
};

const getAllFunctionCompletion = (): vscode.CompletionItem[] => {
  const suggestions: vscode.CompletionItem[] = [];

  BULLY_FUNCTIONS.forEach(func => {
    suggestions.push(createFunctionCompletionItem(func.name));
  });

  return suggestions;
};

const getAllSnippetCompletion = (): vscode.CompletionItem[] => {
  const suggestions: vscode.CompletionItem[] = [];

  SNIPPETS.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  ).forEach((snippet, index) => {
    // Insert
    suggestions.push(createSnippetCompletionItem(snippet));
  });

  return suggestions;
};

const completionProvider = vscode.languages.registerCompletionItemProvider(
  BULLY_SCRIPTING_LANGUAGE,
  {
    provideCompletionItems: (
      document,
      position,
      token,
      context
    ): vscode.CompletionItem[] | undefined => {
      const wordRange = document.getWordRangeAtPosition(position);
      const suggestions: vscode.CompletionItem[] = [];
      let alreadyShowingSnippets = false;

      // If the cursor position is inside a text
      if (wordRange) {
        const word = document.getText(wordRange);

        const pushMatchingItems = (
          list: TBullyFunction[] | TVariable[],
          itemCallback: (name: string) => vscode.CompletionItem
        ) => {
          list.forEach(item => {
            const itemName = item.name;

            if (itemName.startsWith(word)) {
              suggestions.push(itemCallback(itemName));
            }
          });
        };

        pushMatchingItems(BULLY_VARIABLES, createVariableCompletionItem);
        pushMatchingItems(BULLY_FUNCTIONS, createFunctionCompletionItem);
      } else {
        suggestions.push(...getAllVariableCompletion());
        suggestions.push(...getAllFunctionCompletion());
        suggestions.push(...getAllSnippetCompletion());

        alreadyShowingSnippets = true;
      }

      // Snippet
      if (!alreadyShowingSnippets && STATES.SNIPPET.value === true) {
        suggestions.push(...getAllSnippetCompletion());
      }

      return suggestions;
    },
  }
);

export const globalVariableProvider =
  vscode.languages.registerCompletionItemProvider(
    BULLY_SCRIPTING_LANGUAGE,
    {
      provideCompletionItems: (
        document,
        position,
        token,
        context
      ): vscode.CompletionItem[] | undefined => {
        const suggestions: vscode.CompletionItem[] = [];

        const lineText = document.lineAt(position.line).text;

        // Jika kursor berada pada "_G."
        if (
          lineText.includes("_G.") &&
          lineText.indexOf("_G.") < position.character
        ) {
          suggestions.push(...getAllVariableCompletion());

          suggestions.push(...getAllFunctionCompletion());

          suggestions.push(...getAllSnippetCompletion());

          return suggestions;
        }

        return undefined;
      },
    },
    ".",
    "_G"
  );

export default completionProvider;
