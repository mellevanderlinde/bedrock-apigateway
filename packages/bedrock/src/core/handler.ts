import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateEvent } from "./validate-event";
import { LanguageModel } from "../model/language-model";

export class ModelHandler {
  private readonly model: LanguageModel;

  constructor(model: LanguageModel) {
    this.model = model;
  }

  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const prompt = validateEvent(event);
    const response = await this.model.getResponse(prompt);
    return { statusCode: 200, body: response };
  }
}
