import { ModelHandler } from "@repo/bedrock/src/core/handler";
import { LocalModel } from "../model/local/local-model";

it("should return a response", async () => {
  const model = new LocalModel("test-response");
  const handler = new ModelHandler(model);
  const event = {
    queryStringParameters: {
      prompt: "test-prompt",
    },
  };
  const response = await handler.handler(event as never);
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("test-response");
});
