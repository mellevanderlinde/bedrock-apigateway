import type { StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import { Duration, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { FoundationModel, FoundationModelIdentifier } from "aws-cdk-lib/aws-bedrock";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";

export class BedrockApigatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const model = FoundationModel.fromFoundationModelId(
      this,
      "Model",
      FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0,
    );

    const logGroup = new LogGroup(this, "LogGroup", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const handler = new NodejsFunction(this, "Lambda", {
      entry: "../../packages/bedrock/src/index.ts",
      runtime: Runtime.NODEJS_22_X,
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(30),
      memorySize: 256,
      bundling: { minify: true },
      environment: { MODEL_ID: model.modelId },
      logGroup,
    });

    handler.addToRolePolicy(
      new PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: [model.modelArn],
      }),
    );

    const userPool = new UserPool(this, "UserPool", {
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

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "Authorizer",
      {
        cognitoUserPools: [userPool],
      },
    );

    const api = new LambdaRestApi(this, "Api", {
      handler,
      proxy: false,
    });

    api.root.addMethod("POST", undefined, {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    });
  }
}
