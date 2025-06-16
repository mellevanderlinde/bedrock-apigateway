import { expect, it } from "vitest";
import { LocalModel } from "../model/local/local-model";
import { ModelHandler } from "./handler";

const model = new LocalModel("test-response");
const handler = new ModelHandler(model);

it("should return a 200 response when prompt is provided", async () => {
  const event = { body: "test-prompt" };
  const response = await handler.handler(event as never);
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("test-response");
});

it("should return a 400 response when body is missing", async () => {
  const event = {};
  const response = await handler.handler(event as never);
  expect(response.statusCode).toBe(400);
  expect(response.body).toBe("✖ Invalid input: expected string, received undefined\n  → at body");
});

it("should return a 400 response when body is empty", async () => {
  const event = { body: "" };
  const response = await handler.handler(event as never);
  expect(response.statusCode).toBe(400);
  expect(response.body).toBe("✖ Too small: expected string to have >=1 characters\n  → at body");
});
