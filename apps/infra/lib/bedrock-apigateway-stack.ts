import {
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
  aws_apigateway as apigateway,
  aws_bedrock as bedrock,
  aws_cognito as cognito,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
} from "aws-cdk-lib";
import type { Construct } from "constructs";

export class BedrockApigatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const model = bedrock.FoundationModel.fromFoundationModelId(
      this,
      "Model",
      bedrock.FoundationModelIdentifier
        .ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0,
    );

    const logGroup = new logs.LogGroup(this, "LogGroup", {
      retention: logs.RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const handler = new lambda_nodejs.NodejsFunction(this, "Lambda", {
      entry: "../../packages/bedrock/src/index.ts",
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      timeout: Duration.seconds(30),
      memorySize: 256,
      bundling: { minify: true },
      environment: { MODEL_ID: model.modelId },
      logGroup,
    });

    handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: [model.modelArn],
      }),
    );

    const userPool = new cognito.UserPool(this, "UserPool", {
      signInAliases: {
        email: true,
        username: false,
      },
      selfSignUpEnabled: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    userPool.addClient("Client", {
      authFlows: {
        adminUserPassword: true,
      },
    });

    userPool.addDomain("Domain", {
      cognitoDomain: {
        domainPrefix: "bedrock-apigateway",
      },
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "Authorizer",
      {
        cognitoUserPools: [userPool],
      },
    );

    const api = new apigateway.LambdaRestApi(this, "Api", {
      handler,
      proxy: false,
    });

    api.root.addMethod("POST", undefined, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
  }
}
