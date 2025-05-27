import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { LanguageModel } from "../model/language-model";
import { validateEvent } from "./validate-event";

export class ModelHandler {
  private readonly model: LanguageModel;

  constructor(model: LanguageModel) {
    this.model = model;
  }

  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const promptOrError = validateEvent(event);

    if (typeof promptOrError === "string") { // valid prompt
      const response = await this.model.getResponse(promptOrError);
      return { statusCode: 200, body: response };
    }

    return promptOrError; // error response
  }
}
