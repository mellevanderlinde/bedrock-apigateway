#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { BedrockApigatewayStack } from "../lib/bedrock-apigateway-stack";

const app = new App();
new BedrockApigatewayStack(app, "BedrockApigatewayStack");
