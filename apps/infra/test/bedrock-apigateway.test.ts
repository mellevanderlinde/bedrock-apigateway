import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { expect, it } from "vitest";
import { BedrockApigatewayStack } from "../lib/bedrock-apigateway-stack";

it("should match with snapshot", () => {
  const app = new App();
  const stack = new BedrockApigatewayStack(app, "Stack");
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});
