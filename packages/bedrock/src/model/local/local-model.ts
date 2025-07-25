import type { LanguageModel } from "../language-model";

export class LocalModel implements LanguageModel {
  private readonly response: string;

  constructor(response: string) {
    this.response = response;
  }

  async invoke(): Promise<string> {
    return this.response;
  }
}
