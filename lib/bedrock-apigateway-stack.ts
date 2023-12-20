import {
  Stack,
  StackProps,
  Duration,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  aws_iam as iam,
  aws_apigateway as apigateway,
  aws_secretsmanager as secretsmanager,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class BedrockApigatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const resource = "invoke";
    const method = "GET";

    const bedrockLambda = this.createBedrockLambda();
    const api = this.createRestApi(bedrockLambda);
    const secret = this.createSecret();
    const authorizationLambda = this.createAuthorizationLambda(
      api.restApiId,
      resource,
      method,
      secret.secretName,
    );
    secret.grantRead(authorizationLambda);
    this.addRestApiResource(authorizationLambda, api, resource, method);
  }

  createBedrockLambda(): lambda.Function {
    const bedrockLambda = new lambda_nodejs.NodejsFunction(this, "Bedrock", {
      entry: "src/bedrock.ts",
      timeout: Duration.seconds(30),
      memorySize: 256,
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    bedrockLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["bedrock:InvokeModel"],
        resources: [
          "arn:aws:bedrock:eu-central-1::foundation-model/anthropic.claude-v2",
        ],
      }),
    );

    return bedrockLambda;
  }

  createRestApi(bedrockLambda: lambda.Function): apigateway.RestApi {
    return new apigateway.LambdaRestApi(this, "BedrockApi", {
      handler: bedrockLambda,
      proxy: false,
    });
  }

  createSecret(): secretsmanager.Secret {
    return new secretsmanager.Secret(this, "Secret", {
      generateSecretString: {
        excludePunctuation: true,
      },
    });
  }

  createAuthorizationLambda(
    restApiId: string,
    resource: string,
    method: string,
    secretName: string,
  ): lambda.Function {
    return new lambda_nodejs.NodejsFunction(this, "Authorization", {
      entry: "src/authorization.ts",
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: {
        API_ID: restApiId,
        API_RESOURCE: resource,
        API_METHOD: method,
        SECRET_NAME: secretName,
        REGION: this.region,
      },
    });
  }

  addRestApiResource(
    authorizationLambda: lambda.Function,
    api: apigateway.RestApi,
    resource: string,
    method: string,
  ): void {
    const authorizer = new apigateway.RequestAuthorizer(this, "Authorizer", {
      handler: authorizationLambda,
      identitySources: [apigateway.IdentitySource.header("Authorization")],
    });

    api.root.addResource(resource).addMethod(method, undefined, {
      authorizer: authorizer,
    });
  }
}
