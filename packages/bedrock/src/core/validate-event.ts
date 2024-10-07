import { APIGatewayProxyEvent } from "aws-lambda";

export function validateEvent(event: APIGatewayProxyEvent): string {
  const prompt = event.queryStringParameters?.prompt;
  if (!prompt) {
    throw new Error("Prompt is missing");
  }
  return prompt;
}
