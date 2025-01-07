import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { LanguageModel } from "../model/language-model";
import { validateEvent } from "./validate-event";

export class ModelHandler {
  private readonly model: LanguageModel;

  constructor(model: LanguageModel) {
    this.model = model;
  }

  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const prompt = validateEvent(event);
    if (typeof prompt === "string") {
      const response = await this.model.getResponse(prompt);
      return { statusCode: 200, body: response };
    }
    return prompt;
  }
}
