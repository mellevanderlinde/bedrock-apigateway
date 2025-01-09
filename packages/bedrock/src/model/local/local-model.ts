import type { LanguageModel } from "../language-model";

export class LocalModel implements LanguageModel {
  private readonly response: string;

  constructor(response: string) {
    this.response = response;
  }

  // biome-ignore lint/suspicious/useAwait: required by interface
  async getResponse(): Promise<string> {
    return this.response;
  }
}
