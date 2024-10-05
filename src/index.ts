import {
  Handler,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import { BedrockModel } from "./model/bedrock/bedrock-model";
import { ModelHandler } from "./core/handler";

const model = new BedrockModel();
const handler_ = new ModelHandler(model);

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return handler_.handler(event);
};
