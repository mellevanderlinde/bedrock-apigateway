import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_iam as iam,
  aws_apigateway as apigateway,
  aws_cognito as cognito,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class BedrockApigatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
    const handler = this.createLambda(modelId);
    const userPool = this.createUserPool();
    this.createApi(handler, userPool);
  }

  createLambda(modelId: string): lambda.Function {
    const logGroup = new logs.LogGroup(this, "LogGroup", {
      retention: logs.RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const handler = new lambda.Function(this, "Lambda", {
      handler: "index.handler",
      code: lambda.Code.fromAsset("src"),
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: { MODEL_ID: modelId },
      logGroup,
    });

    handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: [
          `arn:aws:bedrock:${this.region}::foundation-model/${modelId}`,
        ],
      }),
    );

    return handler;
  }

  createUserPool(): cognito.UserPool {
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

    return userPool;
  }

  createApi(
    handler: lambda.Function,
    userPool: cognito.UserPool,
  ): apigateway.RestApi {
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

    api.root.addMethod("GET", undefined, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    return api;
  }
}
