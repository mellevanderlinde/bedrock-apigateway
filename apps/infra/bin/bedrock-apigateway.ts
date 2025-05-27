import { App, Aspects } from "aws-cdk-lib";
import { RemovalPolicyDestroyAspect } from "../lib/aspects";
import { BedrockApigatewayStack } from "../lib/bedrock-apigateway-stack";

const app = new App();

new BedrockApigatewayStack(app, "BedrockApigatewayStack", {
  env: { region: "eu-central-1" },
});

Aspects.of(app).add(new RemovalPolicyDestroyAspect());
