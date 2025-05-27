import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod/v4";

const Event = z.object({
  body: z.string().min(1),
});

export function validateEvent(event: APIGatewayProxyEvent): string | APIGatewayProxyResult {
  const { success, data, error } = Event.safeParse(event);
  if (success) {
    return data.body;
  }
  return { statusCode: 400, body: z.prettifyError(error) };
}
