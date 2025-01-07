import { expect, it } from "vitest";
import { LocalModel } from "../model/local/local-model";
import { ModelHandler } from "./handler";

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
