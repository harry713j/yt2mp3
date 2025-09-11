import { SERVER_URL } from "@/constants";
import type { ConvertRequest } from "@/types/api";

export async function convertToMp3(data: ConvertRequest) {
  return await fetch(`${SERVER_URL}/convert`, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
