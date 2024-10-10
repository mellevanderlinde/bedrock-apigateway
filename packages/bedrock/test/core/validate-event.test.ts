import { validateEvent } from "@repo/bedrock/src/core/validate-event";

it("should return prompt if it is present in the event body", () => {
  const event = { body: "test-prompt" };
  expect(validateEvent(event as never)).toBe("test-prompt");
});

it("should throw an error if prompt is missing", () => {
  const event = {};
  expect(validateEvent(event as never)).toStrictEqual({
    statusCode: 400,
    body: "Prompt is missing",
  });
});
