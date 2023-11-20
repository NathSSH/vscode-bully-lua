import * as vscode from "vscode";
import hoverProvider from "./providers/hover";
import completionProvider, {
  globalVariableProvider,
} from "./providers/completion";
import signatureHelp from "./providers/signatureHelp";
import { STATES, TState } from "./states";

export const activate = (context: vscode.ExtensionContext) => {
  console.log('"bully-lua" extension is now active.');

  // Hover
  context.subscriptions.push(hoverProvider);

  // Completion
  context.subscriptions.push(completionProvider);
  context.subscriptions.push(globalVariableProvider);

  // Parameter hint
  context.subscriptions.push(signatureHelp);

  // Toggle snippet command
  const registerCommand = (state: TState): vscode.Disposable => {
    return vscode.commands.registerCommand(state.command, () => {
      const enabled = context.globalState.get(state.label, state.value);
      context.globalState.update(state.label, !enabled);
      state.value = enabled;

      vscode.window.showInformationMessage(
        `Bully Lua: ${state.title} ${enabled ? "enabled" : "disabled"}.`
      );
    });
  };

  Object.values(STATES).forEach(state => {
    context.subscriptions.push(registerCommand(state));
  });
};

export const deactivate = () => {
  console.log('"bully-lua" extension has been deactivated.');
};
