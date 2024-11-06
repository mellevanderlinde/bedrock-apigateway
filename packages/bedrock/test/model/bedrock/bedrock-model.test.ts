import { BedrockModel } from "src/model/bedrock/bedrock-model";

it("should create a new BedrockModel instance", () => {
  process.env.MODEL_ID = "test-model-id";
  const model = new BedrockModel();
  expect(model).toBeDefined();
});

it("should throw an error if MODEL_ID is missing", () => {
  delete process.env.MODEL_ID;
  expect(() => new BedrockModel()).toThrow("MODEL_ID is missing");
});
