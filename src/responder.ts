import type { ServerResponse } from "http";

export function respondWithJSON<Type>(
  res: ServerResponse,
  statusCode: number,
  payload: Type,
) {
  const jsonResponse = JSON.stringify(payload);
  res.setHeader("Content-Type", "application/json");
  res.writeHead(statusCode);
  res.end(jsonResponse);
}

export function respondWithError(
  res: ServerResponse,
  statusCode: number,
  message: string,
) {
  if (statusCode > 499) {
    console.error("Server error ");
  }

  const errorResponse = { message: message };
  respondWithJSON(res, statusCode, errorResponse);
}
