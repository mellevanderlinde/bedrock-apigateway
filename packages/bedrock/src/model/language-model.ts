export interface LanguageModel {
  invoke: (prompt: string) => Promise<string>;
}
