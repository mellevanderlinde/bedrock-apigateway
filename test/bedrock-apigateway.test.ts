import { App, assertions } from "aws-cdk-lib";
import { BedrockApigatewayStack } from "../lib/bedrock-apigateway-stack";

test("Match with snapshot", () => {
  const app = new App();
  const stack = new BedrockApigatewayStack(app, "TestBedrockApigatewayStack");
  const template = assertions.Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
