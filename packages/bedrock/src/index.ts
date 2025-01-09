import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { ModelHandler } from "./core/handler";
import { BedrockModel } from "./model/bedrock/bedrock-model";

const model = new BedrockModel();
const handler_ = new ModelHandler(model);

export const handler: Handler = (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return handler_.handler(event);
};
