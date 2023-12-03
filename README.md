# Bedrock with API Gateway

This project is an integration between API Gateway and Bedrock. The calls to Bedrock are made by AWS Lambda.

## Deploy

To install the project's dependencies and deploy to AWS, run the following:

```
npm install
npm run cdk deploy 
```

## Call API

To call the deployed API, run the following:

```
curl -X GET -G \
    'https://<ApiEndpoint>.amazonaws.com/prod/invoke' \
    --data-urlencode "prompt=Who is the CEO of AWS?" \
    --header 'Authorization: <SecretValue>'
```

In the `curl` command `<ApiEndpoint>` should be the API endpoint output (which is printed in the terminal after deploying) and `<SecretValue>` should be the secret value of the secret in AWS Secrets Manager.