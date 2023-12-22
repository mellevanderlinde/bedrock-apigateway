import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { Handler, APIGatewayEvent } from "aws-lambda";

const client = new BedrockRuntimeClient({ region: "eu-central-1" });

export const handler: Handler = async (event: APIGatewayEvent) => {
  const prompt = `\n\nHuman: ${event.queryStringParameters?.prompt} \n\nAssistant:`;
  const input = {
    modelId: "anthropic.claude-v2",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      max_tokens_to_sample: 100,
    }),
  };
  const response = await client.send(new InvokeModelCommand(input));
  return {
    statusCode: 200,
    body: JSON.stringify({
      response: JSON.parse(response.body.transformToString())["completion"],
    }),
  };
};
