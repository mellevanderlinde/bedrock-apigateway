import { expect, it } from "vitest";
import { validateEvent } from "./validate-event";

it("should return prompt if present in the event body", () => {
  expect(
    validateEvent({ body: "test-prompt" } as never),
  ).toBe("test-prompt");
});

it("should return 400 response if prompt is missing", () => {
  expect(
    validateEvent({} as never),
  ).toMatchObject({
    statusCode: 400,
    body: "✖ Invalid input: expected string, received undefined\n  → at body",
  });

  expect(
    validateEvent({ body: "" } as never),
  ).toMatchObject({
    statusCode: 400,
    body: "✖ Too small: expected string to have >1 characters\n  → at body",
  });
});
