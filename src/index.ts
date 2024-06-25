import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { Handler, APIGatewayEvent } from "aws-lambda";

const client = new BedrockRuntimeClient();

export const handler: Handler = async (event: APIGatewayEvent) => {
  const prompt = event.queryStringParameters?.prompt;
  if (!prompt) {
    return { statusCode: 400, body: "Prompt is missing" };
  }

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
    modelId: process.env.MODEL_ID,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);

  const decodedResponseBody = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decodedResponseBody);

  return { statusCode: 200, body: responseBody.content[0].text };
};
