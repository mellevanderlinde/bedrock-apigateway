import {
  Stack,
  StackProps,
  Duration,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  aws_iam as iam,
  aws_apigateway as apigateway,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class BedrockApigatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const modelId = "anthropic.claude-v2:1";
    const region = "eu-central-1";
    const handler = this.createLambda(modelId, region);
    const api = this.createApi(handler);
    const method = "GET";
    this.addApiMethod(api, method);
  }

  createLambda(modelId: string, region: string): lambda.Function {
    const handler = new lambda_nodejs.NodejsFunction(this, "Lambda", {
      entry: "src/index.ts",
      timeout: Duration.seconds(30),
      memorySize: 256,
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: { MODEL_ID: modelId, REGION: region },
    });

    handler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["bedrock:InvokeModel"],
        resources: [`arn:aws:bedrock:${region}::foundation-model/${modelId}`],
      }),
    );

    return handler;
  }

  createApi(handler: lambda.Function): apigateway.RestApi {
    return new apigateway.LambdaRestApi(this, "Api", {
      handler,
      proxy: false,
    });
  }

  addApiMethod(api: apigateway.RestApi, method: string): void {
    api.root.addMethod(method);
  }
}
