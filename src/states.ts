export type TState = {
  label: string;
  command: `bully-lua.${string}`;
  title: string;
  value: any;
};

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
