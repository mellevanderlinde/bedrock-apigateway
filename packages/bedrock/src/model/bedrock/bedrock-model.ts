import type { LanguageModel } from "../language-model";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { generateText } from "ai";

const bedrock = createAmazonBedrock({
  credentialProvider: fromNodeProviderChain(),
});

export class BedrockModel implements LanguageModel {
  private modelId: string;

  constructor() {
    // eslint-disable-next-line node/prefer-global/process
    const modelId = process.env.MODEL_ID;
    if (!modelId) {
      throw new Error("MODEL_ID is missing");
    }
    this.modelId = modelId;
  }

  async invoke(prompt: string): Promise<string> {
    const { text } = await generateText({
      model: bedrock(this.modelId),
      prompt,
    });
    return text;
  }
}
