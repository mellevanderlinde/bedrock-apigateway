import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  aws_iam as iam,
  aws_apigateway as apigateway,
  aws_cognito as cognito,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class BedrockApigatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const modelId = "anthropic.claude-v2:1";
    const region = "eu-central-1";
    const handler = this.createLambda(modelId, region);
    const userPool = this.createUserPool();
    this.createApi(handler, userPool);
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
