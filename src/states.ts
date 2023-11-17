// import * as vscode from "vscode";

/* type TState = {
  command: `bully-lua.${string}`;
  title: string;
}; */
export type TState = {
  label: string;
  command: `bully-lua.${string}`;
  title: string;
  value: any;
};

/* export const STATES: {
  [key: string]: TState;
} = {
  SNIPPET: {
    name: "snippet",
    value: true,
  },
}; */
export const STATES: {
  [key: string]: TState;
} = {
  SNIPPET: {
    label: "SNIPPET",
    command: "bully-lua.toggleSnippet",
    title: "Toggle code snippet",
    value: true,
  },
};

/* export class CommandState {
  private value: any;

  constructor(
    command: string,
    title: string,
    value: any,
    callback: () => void
  ) {
    this.value = value;

    vscode.commands.registerCommand(`bully-lua`, callback);
  }

  getValue() {
    return this.value;
  }

  setValue(newValue: (currentValue: typeof this.value) => any | any): void {
    if (typeof newValue === "function") {
      this.value = newValue(this.value);

      return;
    }

    this.value = newValue;
  }
} */

/* export const getState = () => {};

export const registerCommand = (
  command: string,
  title: string,
  callback: () => void
) => {}; */
