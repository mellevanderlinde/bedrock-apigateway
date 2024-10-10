import { validateEvent } from "@repo/bedrock/src/core/validate-event";

it("should return prompt if it is present in the event", () => {
  const event = {
    queryStringParameters: {
      prompt: "test",
    },
  };
  expect(validateEvent(event as never)).toBe("test");
});

it("should throw an error if prompt is missing", () => {
  const event = { queryStringParameters: {} };
  expect(validateEvent(event as never)).toStrictEqual({
    statusCode: 400,
    body: "Prompt is missing",
  });
});
