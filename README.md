# Bedrock with API Gateway

This project is an integration between API Gateway and Bedrock. The calls to Bedrock are made by AWS Lambda. The API is secured with Amazon Cognito.

## Deploy

To install the project's dependencies and deploy to AWS, run the following:

```
npm ci
npm run build
cd apps/infra
npx cdk deploy 
```

Please be aware that the CloudFormation stack is deployed in the `eu-central-1` region, as Bedrock is currently unavailable in certain regions.

## Call API

To call the API, run the following:

```
curl -X POST -G \
    'https://<ApiEndpoint>.amazonaws.com/prod' \
    --data-urlencode 'prompt=Who is the CEO of AWS?' \
    --header 'Authorization: <IdToken>'
```

In the `curl` command `<ApiEndpoint>` should be the API endpoint output (which is printed in the terminal after deployment) and `<IdToken>` should be the ID Token from a registered user in Cognito.

Example response: 

```
The CEO of Amazon Web Services (AWS) is Adam Selipsky. He became CEO of AWS in 2021, replacing Andy Jassy who became CEO of Amazon.
```