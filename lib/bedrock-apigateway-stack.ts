import {
  Stack,
  StackProps,
  Duration,
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

    const bedrock = new lambda_nodejs.NodejsFunction(this, "Bedrock", {
      entry: "src/bedrock.ts",
      timeout: Duration.seconds(30),
      memorySize: 256,
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    bedrock.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["bedrock:InvokeModel"],
        resources: [
          "arn:aws:bedrock:eu-central-1::foundation-model/anthropic.claude-v2",
        ],
      }),
    );

    const api = new apigateway.LambdaRestApi(this, "BedrockApi", {
      handler: bedrock,
      proxy: false,
    });

    const resource = "invoke";
    const method = "GET";
    const secret = new secretsmanager.Secret(this, "Secret", {
      generateSecretString: {
        excludePunctuation: true,
      },
    });

    const authorization = new lambda_nodejs.NodejsFunction(
      this,
      "Authorization",
      {
        entry: "src/authorization.ts",
        logRetention: logs.RetentionDays.ONE_DAY,
        environment: {
          API_ID: api.restApiId,
          API_RESOURCE: resource,
          API_METHOD: method,
          SECRET_NAME: secret.secretName,
          REGION: this.region,
        },
      },
    );

    secret.grantRead(authorization);

    const authorizer = new apigateway.RequestAuthorizer(this, "Authorizer", {
      handler: authorization,
      identitySources: [apigateway.IdentitySource.header("Authorization")],
    });

    api.root.addResource(resource).addMethod(method, undefined, {
      authorizer: authorizer,
    });
  }
}
