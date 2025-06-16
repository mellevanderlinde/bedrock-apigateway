import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { LanguageModel } from "../model/language-model";
import { z } from "zod/v4";

const Event = z.object({
  body: z.string().min(1),
});

export class ModelHandler {
  private readonly model: LanguageModel;

  constructor(model: LanguageModel) {
    this.model = model;
  }

  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const { success, data, error } = Event.safeParse(event);

    if (success) { // valid prompt
      const response = await this.model.invoke(data.body);
      return { statusCode: 200, body: response };
    }

    return { statusCode: 400, body: z.prettifyError(error) }; // error response
  }
}
