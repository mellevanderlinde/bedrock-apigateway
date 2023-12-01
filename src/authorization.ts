import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { Handler } from "aws-lambda";

const client = new SecretsManagerClient();

export function getPolicyDocument(effect: string, accountId: string) {
  const apiId = process.env.API_ID;
  const resource = process.env.API_RESOURCE;
  const method = process.env.API_METHOD;

  return {
    policyDocument: {
      Statement: [
        {
          Effect: effect,
          Action: "execute-api:Invoke",
          Resource: `arn:aws:execute-api:eu-west-1:${accountId}:${apiId}/prod/${method}/${resource}`,
        },
      ],
    },
  };
}

export const handler: Handler = async (event) => {
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
