import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { LanguageModel } from "../language-model";

export class BedrockModel implements LanguageModel {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor(client?: BedrockRuntimeClient) {
    this.client = client || new BedrockRuntimeClient();

    const modelId = process.env.MODEL_ID;
    if (!modelId) {
      throw new Error("MODEL_ID is missing");
    }
    this.modelId = modelId;
  }

  async getResponse(prompt: string): Promise<string> {
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    };

    const command = new InvokeModelCommand({
      modelId: this.modelId,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await this.client.send(command);

    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);

    return responseBody.content[0].text;
  }
}
