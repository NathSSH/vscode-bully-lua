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

const createVariableCompletionItem = (name: string): vscode.CompletionItem => {
  const variableObj = getBullyVariableObj(name) as TVariable;

  const item = new vscode.CompletionItem(
    variableObj.name,
    vscode.CompletionItemKind.Value
  );

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

  item.detail = name;

  item.insertText = new vscode.SnippetString(
    body.join("\n").replaceAll("  ", "\t")
  );

  const description = Array.isArray(desc) ? desc.join("\n") : desc;

  item.documentation = new vscode.MarkdownString(description);

  return item;
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
      }

      // Snippet
      SNIPPETS.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      ).forEach((snippet, index) => {
        // Insert
        suggestions.push(createSnippetCompletionItem(snippet));
      });

      // Default suggestion
      // Suggest all words that exist in the current file
      // let allWords: vscode.CompletionItem[] = [];

      // const getAllWords = async () => {
      //   // Get all words in the current file, including language reserved word
      //   const defaultSuggestionsPromise =
      //     await vscode.commands.executeCommand<vscode.CompletionList>(
      //       "vscode.executeCompletionItemProvider",
      //       document.uri,
      //       position
      //     );

      //   /* defaultSuggestionsPromise.then(
      //     (completionList: vscode.CompletionList) => {
      //       console.log("completionList.items = ", completionList.items);
      //     }
      //   ); */

      //   return defaultSuggestionsPromise.items;
      // };

      /* const allWords = await getAllWords();

      allWords.forEach(item => {
        suggestions.push(item);
      }); */

      // Attempt 2
      /* console.log("sebelum------");
      vscode.commands
        .executeCommand<vscode.CompletionList>(
          "vscode.executeCompletionItemProvider",
          document.uri,
          position
        )
        .then((completionList: any) => {
          console.log("iterate..");
          completionList.items.forEach((item: vscode.CompletionItem) => {
            suggestions.push(item);

            console.log("-------------");
            console.log("item = ", item);
            console.log("___________\n\n");
          });
        }); */
      // console.log("sebelum..");
      /* const allWords = await vscode.commands.executeCommand<
        Promise<vscode.CompletionList>
      >("vscode.executeCompletionItemProvider", document.uri, position); */
      // console.log("sesudah..");

      /* allWords.items.forEach(item => {
        suggestions.push(item);

        console.log("item = ", item);
      }); */

      // Attempt 3
      /* const editor = vscode.window.activeTextEditor;

      if (editor) {
        const text = editor.document.getText();

        const words = removeDuplicates(text.split(/\s+/));

        words.forEach(word => {
          suggestions.push(
            new vscode.CompletionItem(word, vscode.CompletionItemKind.Text)
          );
        });
      } */

      return suggestions;
    },
  }
);

export default completionProvider;
