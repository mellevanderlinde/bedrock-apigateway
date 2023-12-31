# Bedrock with API Gateway

This project is an integration between API Gateway and Bedrock. The calls to Bedrock are made by AWS Lambda. The API is secured with Amazon Cognito.

## Deploy

To install the project's dependencies and deploy to AWS, run the following:

```
npm install
npm run cdk deploy 
```

## Call API

To call the API, run the following:

```
curl -X GET -G \
    'https://<ApiEndpoint>.amazonaws.com/prod' \
    --data-urlencode "prompt=Who is the CEO of AWS?" \
    --header 'Authorization: <IdToken>'
```

In the `curl` command `<ApiEndpoint>` should be the API endpoint output (which is printed in the terminal after deployment) and `<IdToken>` should be the ID Token from a registered user in Cognito.

Example response: 

```
{
    "response": "The CEO of Amazon Web Services (AWS) is Adam Selipsky. He became CEO of AWS in 2021, replacing Andy Jassy who became CEO of Amazon."
}
```