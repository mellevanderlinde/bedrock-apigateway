import { expect, it } from "vitest";
import { BedrockModel } from "./bedrock-model";

it("should throw an error if MODEL_ID is missing", () => {
  expect(() => new BedrockModel()).toThrow("MODEL_ID is missing");
});

it("should create a new BedrockModel instance", () => {
  process.env.MODEL_ID = "test-model-id";
  const model = new BedrockModel();
  expect(model).toBeDefined();
});
