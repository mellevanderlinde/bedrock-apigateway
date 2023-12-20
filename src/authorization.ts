import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { Handler, APIGatewayEvent } from "aws-lambda";

const client = new SecretsManagerClient();

export function getPolicyDocument(effect: string, accountId: string) {
  const apiId = process.env.API_ID;
  const method = process.env.API_METHOD;
  const region = process.env.REGION;

  return {
    policyDocument: {
      Statement: [
        {
          Effect: effect,
          Action: "execute-api:Invoke",
          Resource: `arn:aws:execute-api:${region}:${accountId}:${apiId}/prod/${method}/*`,
        },
      ],
    },
  };
}

export const handler: Handler = async (event: APIGatewayEvent) => {
  const accountId = event.requestContext.accountId;
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: process.env.SECRET_NAME }),
  );
  if (event.headers.Authorization === response.SecretString) {
    return getPolicyDocument("Allow", accountId);
  } else {
    return getPolicyDocument("Deny", accountId);
  }
};
