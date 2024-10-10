import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export function validateEvent(
  event: APIGatewayProxyEvent,
): string | APIGatewayProxyResult {
  const prompt = event.queryStringParameters?.prompt;
  if (!prompt) {
    return { statusCode: 400, body: "Prompt is missing" };
  }
  return prompt;
}
