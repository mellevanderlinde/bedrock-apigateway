import { LanguageModel } from "@repo/bedrock/src/model/language-model";

export class LocalModel implements LanguageModel {
  private readonly response: string;

  constructor(response: string) {
    this.response = response;
  }

  async getResponse(): Promise<string> {
    return this.response;
  }
}
