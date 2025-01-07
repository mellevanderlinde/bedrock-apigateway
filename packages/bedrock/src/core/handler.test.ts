import { it, expect } from "vitest";
import { ModelHandler } from "src/core/handler";
import { LocalModel } from "../model/local/local-model";

it("should return a 200 response when prompt is provided", async () => {
  const model = new LocalModel("test-response");
  const handler = new ModelHandler(model);
  const event = { body: "test-prompt" };
  const response = await handler.handler(event as never);
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("test-response");
});

it("should return a 400 response when prompt is missing", async () => {
  const model = new LocalModel("test-response");
  const handler = new ModelHandler(model);
  const event = {};
  const response = await handler.handler(event as never);
  expect(response.statusCode).toBe(400);
  expect(response.body).toBe("Prompt is missing");
});
