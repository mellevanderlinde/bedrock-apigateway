import { App, assertions } from "aws-cdk-lib";
import { BedrockApigatewayStack } from "../lib/bedrock-apigateway-stack";

it("should match with snapshot", () => {
  const app = new App();
  const stack = new BedrockApigatewayStack(app, "Stack");
  const template = assertions.Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
