export interface LanguageModel {
  getResponse(prompt: string): Promise<string>;
}
